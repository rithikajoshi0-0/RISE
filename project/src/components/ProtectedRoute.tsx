import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Handle admin roles
    if (requiredRole === 'Admin' && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }

    // Specific admin role checks
    if (requiredRole.includes('Admin')) {
      if (user.role !== requiredRole) {
        // Redirect to the correct admin dashboard based on role
        if (user.isAdmin) {
          switch (user.role) {
            case 'ProjectAdmin':
              return <Navigate to="/admin/projects" replace />;
            case 'PortfolioAdmin':
              return <Navigate to="/admin/portfolios" replace />;
            case 'PhDAdmin':
              return <Navigate to="/admin/phd" replace />;
            default:
              return <Navigate to="/" replace />;
          }
        }
        return <Navigate to="/" replace />;
      }
    }
    
    // Regular role check
    else if (user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
