/*
 * vigilante.c — Backend HTTP in C per amogaddy's VPS
 * Compila: gcc -O2 -pthread vigilante.c -lsqlite3 -o vigilante
 *
 * API esposte (porta 8080, Nginx fa da reverse proxy):
 *   GET  /status        → stato sistema (CPU, RAM, uptime, istanze)
 *   GET  /instances     → lista istanze VPS attive
 *   POST /command       → esegue un comando (create, stop, reset)
 *   GET  /logs?limit=N  → ultimi N log dal database
 *   GET  /health        → health check rapido (risponde 200 OK)
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <time.h>
#include <pthread.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/sysinfo.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sqlite3.h>

/* ── Configurazione ── */
#define PORT        8080
#define BACKLOG     64
#define BUF_SIZE    4096
#define DB_PATH     "/opt/vigilante/data/vigilante.db"
#define LOG_PATH    "/opt/vigilante/logs/vigilante.log"
#define MAX_CLIENTS 128
#define RATE_WINDOW 60    /* secondi per rate limiting */
#define RATE_LIMIT  30    /* max richieste per IP in RATE_WINDOW */

/* ── Strutture dati ── */
typedef struct {
    int  fd;
    char ip[INET_ADDRSTRLEN];
} client_t;

typedef struct {
    char ip[INET_ADDRSTRLEN];
    int  count;
    time_t first_seen;
} rate_entry_t;

/* ── Variabili globali ── */
static sqlite3       *db          = NULL;
static pthread_mutex_t db_mutex   = PTHREAD_MUTEX_INITIALIZER;
static pthread_mutex_t rate_mutex = PTHREAD_MUTEX_INITIALIZER;
static rate_entry_t    rate_table[MAX_CLIENTS];
static int             rate_count  = 0;

/* ────────────────────────────────────────────────
   LOG
──────────────────────────────────────────────── */
void log_msg(const char *level, const char *msg) {
    time_t now = time(NULL);
    char ts[32];
    strftime(ts, sizeof(ts), "%Y-%m-%d %H:%M:%S", localtime(&now));

    FILE *f = fopen(LOG_PATH, "a");
    if (f) {
        fprintf(f, "[%s] [%s] %s\n", ts, level, msg);
        fclose(f);
    }
    printf("[%s] [%s] %s\n", ts, level, msg);
}

/* ────────────────────────────────────────────────
   DATABASE SQLite
──────────────────────────────────────────────── */
void db_init(void) {
    pthread_mutex_lock(&db_mutex);
    if (sqlite3_open(DB_PATH, &db) != SQLITE_OK) {
        fprintf(stderr, "ERRORE apertura DB: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    /* Tabella log eventi */
    const char *sql_logs =
        "CREATE TABLE IF NOT EXISTS logs ("
        "  id        INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  ts        DATETIME DEFAULT CURRENT_TIMESTAMP,"
        "  level     TEXT NOT NULL,"
        "  message   TEXT NOT NULL"
        ");";

    /* Tabella istanze simulate */
    const char *sql_instances =
        "CREATE TABLE IF NOT EXISTS instances ("
        "  id        TEXT PRIMARY KEY,"
        "  plan      TEXT NOT NULL,"     /* 'free' | 'paas' */
        "  status    TEXT NOT NULL,"     /* 'running' | 'sleeping' | 'caveau' */
        "  node      TEXT NOT NULL,"
        "  runtime   TEXT NOT NULL,"
        "  wallet    REAL DEFAULT 0.0,"
        "  created   DATETIME DEFAULT CURRENT_TIMESTAMP,"
        "  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP"
        ");";

    char *err = NULL;
    sqlite3_exec(db, sql_logs,      NULL, NULL, &err);
    sqlite3_exec(db, sql_instances, NULL, NULL, &err);
    pthread_mutex_unlock(&db_mutex);

    log_msg("INFO", "Database SQLite inizializzato.");
}

void db_log(const char *level, const char *msg) {
    pthread_mutex_lock(&db_mutex);
    const char *sql = "INSERT INTO logs(level,message) VALUES(?,?);";
    sqlite3_stmt *stmt;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, level, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, msg,   -1, SQLITE_STATIC);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }
    pthread_mutex_unlock(&db_mutex);
}

/* ────────────────────────────────────────────────
   RATE LIMITING per IP
──────────────────────────────────────────────── */
int rate_check(const char *ip) {
    pthread_mutex_lock(&rate_mutex);
    time_t now = time(NULL);

    for (int i = 0; i < rate_count; i++) {
        if (strcmp(rate_table[i].ip, ip) == 0) {
            /* Resetta se fuori finestra temporale */
            if (now - rate_table[i].first_seen > RATE_WINDOW) {
                rate_table[i].count     = 1;
                rate_table[i].first_seen = now;
                pthread_mutex_unlock(&rate_mutex);
                return 1; /* OK */
            }
            rate_table[i].count++;
            int ok = rate_table[i].count <= RATE_LIMIT;
            pthread_mutex_unlock(&rate_mutex);
            return ok;
        }
    }

    /* Nuovo IP */
    if (rate_count < MAX_CLIENTS) {
        strncpy(rate_table[rate_count].ip, ip, INET_ADDRSTRLEN - 1);
        rate_table[rate_count].count      = 1;
        rate_table[rate_count].first_seen = now;
        rate_count++;
    }
    pthread_mutex_unlock(&rate_mutex);
    return 1; /* OK */
}

/* ────────────────────────────────────────────────
   LETTURA SISTEMA (CPU, RAM, Uptime)
──────────────────────────────────────────────── */
void get_system_info(char *out, size_t len) {
    struct sysinfo si;
    sysinfo(&si);

    long total_ram = si.totalram / (1024 * 1024);
    long free_ram  = si.freeram  / (1024 * 1024);
    long used_ram  = total_ram - free_ram;
    long uptime_h  = si.uptime / 3600;
    long uptime_m  = (si.uptime % 3600) / 60;

    /* CPU usage: legge /proc/stat */
    double cpu_pct = 0.0;
    FILE *f = fopen("/proc/stat", "r");
    if (f) {
        unsigned long long u1, n1, s1, i1, w1, x1, y1, z1;
        fscanf(f, "cpu %llu %llu %llu %llu %llu %llu %llu %llu",
               &u1, &n1, &s1, &i1, &w1, &x1, &y1, &z1);
        fclose(f);
        unsigned long long busy  = u1 + n1 + s1 + w1 + x1 + y1 + z1;
        unsigned long long total = busy + i1;
        if (total > 0) cpu_pct = (double)busy / total * 100.0;
    }

    snprintf(out, len,
        "\"cpu_pct\":%.1f,"
        "\"ram_total_mb\":%ld,"
        "\"ram_used_mb\":%ld,"
        "\"uptime_h\":%ld,"
        "\"uptime_m\":%ld",
        cpu_pct, total_ram, used_ram, uptime_h, uptime_m);
}

/* ────────────────────────────────────────────────
   COSTRUTTORI RISPOSTE HTTP/JSON
──────────────────────────────────────────────── */
void send_response(int fd, int code, const char *body) {
    const char *status =
        code == 200 ? "200 OK" :
        code == 400 ? "400 Bad Request" :
        code == 429 ? "429 Too Many Requests" :
        "500 Internal Server Error";

    char header[512];
    snprintf(header, sizeof(header),
        "HTTP/1.1 %s\r\n"
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "Content-Length: %zu\r\n"
        "Connection: close\r\n"
        "\r\n",
        status, strlen(body));

    send(fd, header, strlen(header), 0);
    send(fd, body,   strlen(body),   0);
}

/* ────────────────────────────────────────────────
   HANDLERS delle API
──────────────────────────────────────────────── */

/* GET /health */
void handle_health(int fd) {
    send_response(fd, 200, "{\"status\":\"ok\",\"service\":\"vigilante\"}");
}

/* GET /status */
void handle_status(int fd) {
    char sysinfo[512];
    get_system_info(sysinfo, sizeof(sysinfo));

    /* Conta istanze per stato */
    pthread_mutex_lock(&db_mutex);
    int running = 0, sleeping = 0, caveau = 0;
    sqlite3_stmt *stmt;
    const char *sql = "SELECT status, COUNT(*) FROM instances GROUP BY status;";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            const char *st = (const char*)sqlite3_column_text(stmt, 0);
            int cnt = sqlite3_column_int(stmt, 1);
            if      (strcmp(st, "running")  == 0) running  = cnt;
            else if (strcmp(st, "sleeping") == 0) sleeping = cnt;
            else if (strcmp(st, "caveau")   == 0) caveau   = cnt;
        }
        sqlite3_finalize(stmt);
    }
    pthread_mutex_unlock(&db_mutex);

    char body[1024];
    snprintf(body, sizeof(body),
        "{"
        "%s,"
        "\"instances\":{\"running\":%d,\"sleeping\":%d,\"caveau\":%d},"
        "\"service\":\"vigilante\","
        "\"version\":\"1.0.0\""
        "}",
        sysinfo, running, sleeping, caveau);

    send_response(fd, 200, body);
    db_log("INFO", "GET /status");
}

/* GET /instances */
void handle_instances(int fd) {
    pthread_mutex_lock(&db_mutex);
    sqlite3_stmt *stmt;
    const char *sql =
        "SELECT id, plan, status, node, runtime, wallet, created, last_seen "
        "FROM instances ORDER BY created DESC;";

    char body[8192];
    strcpy(body, "{\"instances\":[");
    int first = 1;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            char entry[512];
            snprintf(entry, sizeof(entry),
                "%s{"
                "\"id\":\"%s\","
                "\"plan\":\"%s\","
                "\"status\":\"%s\","
                "\"node\":\"%s\","
                "\"runtime\":\"%s\","
                "\"wallet\":%.2f,"
                "\"created\":\"%s\","
                "\"last_seen\":\"%s\""
                "}",
                first ? "" : ",",
                sqlite3_column_text(stmt, 0),
                sqlite3_column_text(stmt, 1),
                sqlite3_column_text(stmt, 2),
                sqlite3_column_text(stmt, 3),
                sqlite3_column_text(stmt, 4),
                sqlite3_column_double(stmt, 5),
                sqlite3_column_text(stmt, 6),
                sqlite3_column_text(stmt, 7));
            strncat(body, entry, sizeof(body) - strlen(body) - 1);
            first = 0;
        }
        sqlite3_finalize(stmt);
    }
    pthread_mutex_unlock(&db_mutex);

    strncat(body, "]}", sizeof(body) - strlen(body) - 1);
    send_response(fd, 200, body);
}

/* GET /logs?limit=N */
void handle_logs(int fd, const char *query) {
    int limit = 50;
    if (query) {
        const char *p = strstr(query, "limit=");
        if (p) limit = atoi(p + 6);
        if (limit <= 0 || limit > 500) limit = 50;
    }

    pthread_mutex_lock(&db_mutex);
    sqlite3_stmt *stmt;
    char sql[128];
    snprintf(sql, sizeof(sql),
        "SELECT ts, level, message FROM logs ORDER BY id DESC LIMIT %d;", limit);

    char body[16384];
    strcpy(body, "{\"logs\":[");
    int first = 1;

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            char entry[512];
            snprintf(entry, sizeof(entry),
                "%s{\"ts\":\"%s\",\"level\":\"%s\",\"msg\":\"%s\"}",
                first ? "" : ",",
                sqlite3_column_text(stmt, 0),
                sqlite3_column_text(stmt, 1),
                sqlite3_column_text(stmt, 2));
            strncat(body, entry, sizeof(body) - strlen(body) - 1);
            first = 0;
        }
        sqlite3_finalize(stmt);
    }
    pthread_mutex_unlock(&db_mutex);

    strncat(body, "]}", sizeof(body) - strlen(body) - 1);
    send_response(fd, 200, body);
}

/* POST /command — body JSON: {"action":"create-free"|"stop"|"reset-12"|"balance-cron","id":"..."} */
void handle_command(int fd, const char *body) {
    if (!body) { send_response(fd, 400, "{\"error\":\"body mancante\"}"); return; }

    char log_buf[256];

    /* Parsing minimale senza librerie esterne */
    if (strstr(body, "\"create-free\"")) {
        /* Genera ID casuale */
        char inst_id[16];
        snprintf(inst_id, sizeof(inst_id), "app-%06X", (unsigned)(time(NULL) & 0xFFFFFF));

        const char *nodes[] = {"free-node-gcp-1","free-node-gcp-2","free-node-gcp-3"};
        const char *runtimes[] = {"Python 3.11","Node.js 20","Go 1.21","HTML Static"};
        const char *node    = nodes[rand()    % 3];
        const char *runtime = runtimes[rand() % 4];

        pthread_mutex_lock(&db_mutex);
        sqlite3_stmt *stmt;
        const char *sql =
            "INSERT INTO instances(id,plan,status,node,runtime,wallet) VALUES(?,?,?,?,?,?);";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, inst_id,  -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 2, "free",   -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 3, "running",-1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 4, node,     -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 5, runtime,  -1, SQLITE_STATIC);
            sqlite3_bind_double(stmt, 6, 0.0);
            sqlite3_step(stmt);
            sqlite3_finalize(stmt);
        }
        pthread_mutex_unlock(&db_mutex);

        snprintf(log_buf, sizeof(log_buf), "Istanza FREE creata: %s su %s", inst_id, node);
        db_log("INFO", log_buf);

        char resp[256];
        snprintf(resp, sizeof(resp),
            "{\"ok\":true,\"id\":\"%s\",\"node\":\"%s\",\"runtime\":\"%s\"}",
            inst_id, node, runtime);
        send_response(fd, 200, resp);

    } else if (strstr(body, "\"reset-12\"")) {
        /* Aggiorna last_seen di tutte le istanze FREE running */
        pthread_mutex_lock(&db_mutex);
        sqlite3_exec(db,
            "UPDATE instances SET last_seen=CURRENT_TIMESTAMP "
            "WHERE plan='free' AND status='running';",
            NULL, NULL, NULL);
        pthread_mutex_unlock(&db_mutex);

        db_log("INFO", "reset-12: istanze FREE riavviate");
        send_response(fd, 200, "{\"ok\":true,\"action\":\"reset-12\"}");

    } else if (strstr(body, "\"balance-cron\"")) {
        /* Ruota i nodi delle istanze FREE */
        pthread_mutex_lock(&db_mutex);
        sqlite3_stmt *stmt;
        const char *sel = "SELECT id FROM instances WHERE plan='free' AND status='running';";
        const char *nodes[] = {"free-node-gcp-1","free-node-gcp-2","free-node-gcp-3"};

        if (sqlite3_prepare_v2(db, sel, -1, &stmt, NULL) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                const char *id   = (const char*)sqlite3_column_text(stmt, 0);
                const char *node = nodes[rand() % 3];
                char upd[256];
                snprintf(upd, sizeof(upd),
                    "UPDATE instances SET node='%s', last_seen=CURRENT_TIMESTAMP WHERE id='%s';",
                    node, id);
                sqlite3_exec(db, upd, NULL, NULL, NULL);
            }
            sqlite3_finalize(stmt);
        }
        pthread_mutex_unlock(&db_mutex);

        db_log("INFO", "balance-cron: rotazione nodi FREE completata");
        send_response(fd, 200, "{\"ok\":true,\"action\":\"balance-cron\"}");

    } else if (strstr(body, "\"caveau-check\"")) {
        /* Metti nel Caveau istanze inattive da > 3 giorni */
        pthread_mutex_lock(&db_mutex);
        sqlite3_exec(db,
            "UPDATE instances SET status='caveau' "
            "WHERE plan='free' AND status='running' "
            "AND (strftime('%s','now') - strftime('%s',last_seen)) > 259200;",
            /* 259200 = 3 giorni in secondi */
            NULL, NULL, NULL);
        pthread_mutex_unlock(&db_mutex);

        db_log("INFO", "caveau-check: istanze inattive spostate nel Caveau");
        send_response(fd, 200, "{\"ok\":true,\"action\":\"caveau-check\"}");

    } else {
        send_response(fd, 400, "{\"error\":\"azione sconosciuta\"}");
    }
}

/* ────────────────────────────────────────────────
   THREAD per ogni client
──────────────────────────────────────────────── */
void *handle_client(void *arg) {
    client_t *c = (client_t *)arg;
    int fd      = c->fd;
    char ip[INET_ADDRSTRLEN];
    strncpy(ip, c->ip, sizeof(ip));
    free(c);

    /* Rate limiting */
    if (!rate_check(ip)) {
        send_response(fd, 429, "{\"error\":\"Too Many Requests\"}");
        close(fd);
        return NULL;
    }

    /* Leggi la richiesta */
    char buf[BUF_SIZE];
    memset(buf, 0, sizeof(buf));
    ssize_t n = recv(fd, buf, sizeof(buf) - 1, 0);
    if (n <= 0) { close(fd); return NULL; }

    /* Parsing prima riga HTTP */
    char method[8], path[256];
    sscanf(buf, "%7s %255s", method, path);

    /* Separa path e query string */
    char *query = strchr(path, '?');
    if (query) { *query = '\0'; query++; }

    /* Trova il body (dopo \r\n\r\n) */
    char *body = strstr(buf, "\r\n\r\n");
    if (body) body += 4;

    /* Preflight CORS */
    if (strcmp(method, "OPTIONS") == 0) {
        send_response(fd, 200, "{}");

    } else if (strcmp(path, "/health") == 0) {
        handle_health(fd);

    } else if (strcmp(path, "/status") == 0) {
        handle_status(fd);

    } else if (strcmp(path, "/instances") == 0) {
        handle_instances(fd);

    } else if (strcmp(path, "/logs") == 0) {
        handle_logs(fd, query);

    } else if (strcmp(path, "/command") == 0 && strcmp(method, "POST") == 0) {
        handle_command(fd, body);

    } else {
        send_response(fd, 400, "{\"error\":\"endpoint sconosciuto\"}");
    }

    close(fd);
    return NULL;
}

/* ────────────────────────────────────────────────
   MAIN — Server loop
──────────────────────────────────────────────── */
int main(void) {
    srand((unsigned)time(NULL));
    log_msg("INFO", "Avvio Vigilante v1.0.0...");

    /* Init database */
    db_init();

    /* Crea socket TCP */
    int srv = socket(AF_INET, SOCK_STREAM, 0);
    if (srv < 0) { perror("socket"); exit(1); }

    int opt = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr = {
        .sin_family      = AF_INET,
        .sin_addr.s_addr = INADDR_ANY,
        .sin_port        = htons(PORT)
    };

    if (bind(srv, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind"); exit(1);
    }
    if (listen(srv, BACKLOG) < 0) {
        perror("listen"); exit(1);
    }

    char msg[64];
    snprintf(msg, sizeof(msg), "In ascolto su 0.0.0.0:%d", PORT);
    log_msg("INFO", msg);

    /* Loop principale */
    while (1) {
        struct sockaddr_in client_addr;
        socklen_t addr_len = sizeof(client_addr);
        int client_fd = accept(srv, (struct sockaddr *)&client_addr, &addr_len);
        if (client_fd < 0) { perror("accept"); continue; }

        client_t *c = malloc(sizeof(client_t));
        c->fd = client_fd;
        inet_ntop(AF_INET, &client_addr.sin_addr, c->ip, sizeof(c->ip));

        pthread_t tid;
        pthread_create(&tid, NULL, handle_client, c);
        pthread_detach(tid);
    }

    sqlite3_close(db);
    return 0;
}
