import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, isLoading, login, logout, refreshUser } = context;

  // Check if user has required role
  const hasRole = (requiredRole: string) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  // Check if user has any of the required roles
  const hasAnyRole = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Redirect to login if not authenticated
  const requireAuth = (redirectTo = '/login') => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { state: { from: window.location.pathname } });
      return false;
    }
    return isAuthenticated;
  };

  // Redirect to home if already authenticated
  const redirectIfAuthenticated = (redirectTo = '/dashboard') => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo);
      return true;
    }
    return false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
    requireAuth,
    redirectIfAuthenticated,
  };
};

export default useAuth;
