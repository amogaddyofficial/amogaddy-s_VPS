import React from 'react';
import { createHashRouter, RouterProvider, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomeDashboard from './pages/HomeDashboard';
import AppHosting from './pages/AppHosting';
import VPSLinux from './pages/VPSLinux';
import MacPlans from './pages/MacPlans';
import WalletPage from './pages/WalletPage';
import Wiki from './pages/Wiki';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DocsPage from './pages/DocsPage';

// Dashboard layout con sidebar
const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/dashboard/')[1] || 'home';

  const handleTabChange = (tab) => {
    navigate(`/dashboard/${tab}`);
  };

  return (
    <div className="flex min-h-screen bg-space-950 text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={() => navigate('/')}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const router = createHashRouter([
  { path: '/', element: <LandingPageWrapper /> },
  { path: '/docs', element: <DocsPageWrapper /> },
  { path: '/auth', element: <AuthPageWrapper /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard/home" replace /> },
      { path: 'home', element: <HomeDashboardWrapper /> },
      { path: 'app-hosting', element: <AppHosting /> },
      { path: 'vps', element: <VPSLinux /> },
      { path: 'mac', element: <MacPlans /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'wiki', element: <Wiki /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

// Wrapper components that inject navigate
function LandingPageWrapper() {
  const navigate = useNavigate();
  return <LandingPage onEnter={() => navigate('/auth')} />;
}

function DocsPageWrapper() {
  const navigate = useNavigate();
  return <DocsPage onEnter={() => navigate('/auth')} />;
}

function AuthPageWrapper() {
  const navigate = useNavigate();
  return <AuthPage onLogin={() => navigate('/dashboard')} onBack={() => navigate('/')} />;
}

function HomeDashboardWrapper() {
  const navigate = useNavigate();
  return <HomeDashboard onNavigate={(tab) => navigate(`/dashboard/${tab}`)} />;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
