FROM golang:1.21-alpine AS builder
WORKDIR /build
COPY . .
RUN if [ -f go.mod ]; then go mod download; fi
RUN go build -o app .

FROM alpine:3.18
RUN addgroup -S app && adduser -S app -G app
WORKDIR /home/app
COPY --from=builder /build/app .
USER app
CMD ["./app"]
