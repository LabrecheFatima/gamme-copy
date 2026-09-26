import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Si pas de token, on redirige vers la page de login admin
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Sinon, on affiche les pages enfants (Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;