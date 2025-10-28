import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import Login from './components/Auth/Login';
import TravelerDashboard from './components/Traveler/TravelerDashboard';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import CompanyDashboard from './components/Employee/CompanyDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
  font-size: 1.2rem;
`;

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'traveler' ? '/traveler' : user.role === 'admin' ? '/company' : '/employee'} replace /> : <Login />} 
      />
      <Route 
        path="/traveler" 
        element={
          <ProtectedRoute requiredRole="traveler">
            <TravelerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/company" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CompanyDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
