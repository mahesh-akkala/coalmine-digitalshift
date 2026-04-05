import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminRegistration from './pages/AdminRegistration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkerRegistration from './pages/WorkerRegistration';
import WorkerAttendance from './pages/WorkerAttendance';
import WorkerRecords from './pages/WorkerRecords';
import HealthAlerts from './pages/HealthAlerts';
import HealthAnalytics from './pages/HealthAnalytics';
import Settings from './pages/Settings';
import './styles/global.css';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/admin-register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegistration />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/worker-registration" element={<WorkerRegistration />} />
        <Route path="/worker-attendance" element={<WorkerAttendance />} />
        <Route path="/worker-records" element={<WorkerRecords />} />
        <Route path="/health-alerts" element={<HealthAlerts />} />
        <Route path="/health-analytics" element={<HealthAnalytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
