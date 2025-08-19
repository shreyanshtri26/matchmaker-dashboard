import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Box, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  showLoading?: boolean;
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
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();

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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verifying your credentials...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
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
  if (!authorized) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        p={3}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" sx={{ maxWidth: 600 }}>
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </Typography>
      </Box>
    );
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
};

export default ProtectedRoute;
