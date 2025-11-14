import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ClubsListPage from './pages/ClubsListPage';
import ClubDetailsPage from './pages/ClubDetailsPage';
import CreateClubPage from './pages/CreateClubPage';
import EventsListPage from './pages/EventsListPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="clubs" element={<ClubsListPage />} />
              <Route path="clubs/:id" element={<ClubDetailsPage />} />
              <Route path="clubs/create" element={<AdminRoute><CreateClubPage /></AdminRoute>} />
              <Route path="events" element={<EventsListPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// A component to render the correct dashboard based on user role
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};


export default App;