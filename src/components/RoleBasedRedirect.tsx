import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export function RoleBasedRedirect() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !roleLoading && user) {
      // Only redirect from auth pages
      if (location.pathname === '/auth' || location.pathname === '/admin/login') {
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate, location.pathname]);

  return null;
}
