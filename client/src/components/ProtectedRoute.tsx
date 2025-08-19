import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  showLoading?: boolean;
  redirectIfAuthenticated?: boolean;
}

/**
 * A component that renders children only if the user is authenticated and has the required role/permissions.
 * If not authenticated, redirects to login. If unauthorized, shows an unauthorized message.
 */
const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermissions = [],
  redirectTo = '/login',
  showLoading = true,
  redirectIfAuthenticated = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

  // If redirectIfAuthenticated is true and user is authenticated, redirect to dashboard
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    if (Array.isArray(requiredRole)) {
      return hasAnyRole(requiredRole);
    }
    return hasRole(requiredRole);
  };

  // Check if user has all required permissions
  const hasRequiredPermissions = () => {
    if (!requiredPermissions.length) return true;
    if (!user?.permissions) return false;
    return requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );
  };

  // If still loading, show loading indicator
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">
          Verifying your credentials...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated && !redirectIfAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role and permissions
  const authorized = hasRequiredRole() && hasRequiredPermissions();

  // If not authorized, show unauthorized message or redirect
  if (!authorized && isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700 leading-relaxed">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
};

export default ProtectedRoute;