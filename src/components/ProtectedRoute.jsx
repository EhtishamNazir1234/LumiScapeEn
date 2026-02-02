import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/hooks';
import { getRoleBasedRoute, hasRoleAccess } from '../utils/roleRouting';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && !hasRoleAccess(user?.role, allowedRoles)) {
    // Redirect to role-appropriate dashboard instead of just "/"
    const roleRoute = getRoleBasedRoute(user?.role);
    return <Navigate to={roleRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
