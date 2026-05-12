import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../entities/user/model/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/" state={{ authRequired: true, from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
