'use client';

import { useAuth } from '../../lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'platform_admin' | 'client_admin' | 'user';
  redirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole = 'user',
  redirectTo = '/auth/login',
  fallback = null,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        const encodedPath = encodeURIComponent(pathname || '');
        router.push(`${redirectTo}?next=${encodedPath}`);
        return;
      }

      // If role is required and user doesn't have sufficient permissions
      if (requiredRole !== 'user') {
        const userRole = user.user_metadata?.['role'] || 'user';
        const roleHierarchy = {
          platform_admin: 3,
          client_admin: 2,
          user: 1,
        };

        const requiredLevel = roleHierarchy[requiredRole];
        const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1;

        if (userLevel < requiredLevel) {
          router.push('/auth/unauthorized');
          return;
        }
      }
    }
  }, [user, loading, requiredRole, redirectTo, router, pathname]);

  // Show fallback while loading or redirecting
  if (loading || !user) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Check role permissions
  if (requiredRole !== 'user') {
    const userRole = user.user_metadata?.['role'] || 'user';
    const roleHierarchy = {
      platform_admin: 3,
      client_admin: 2,
      user: 1,
    };

    const requiredLevel = roleHierarchy[requiredRole];
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1;

    if (userLevel < requiredLevel) {
      return (
        fallback || (
          <div className='min-h-screen flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-red-600 text-lg font-semibold'>Access Denied</div>
              <p className='text-gray-600 mt-2'>
                You don&apos;t have permission to access this page.
              </p>
              <button
                onClick={() => router.push('/auth/unauthorized')}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Go to Unauthorized Page
              </button>
            </div>
          </div>
        )
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'platform_admin' | 'client_admin' | 'user',
  redirectTo?: string
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute
        requiredRole={requiredRole || 'user'}
        redirectTo={redirectTo || '/auth/login'}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking route permissions
export function useRoutePermission(requiredRole?: 'platform_admin' | 'client_admin' | 'user') {
  const { user } = useAuth();

  if (!user) {
    return { hasAccess: false, userRole: null, requiredRole };
  }

  const userRole = user.user_metadata?.['role'] || 'user';

  if (!requiredRole || requiredRole === 'user') {
    return { hasAccess: true, userRole, requiredRole };
  }

  const roleHierarchy = {
    platform_admin: 3,
    client_admin: 2,
    user: 1,
  };

  const requiredLevel = roleHierarchy[requiredRole];
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1;

  return {
    hasAccess: userLevel >= requiredLevel,
    userRole,
    requiredRole,
    userLevel,
    requiredLevel,
  };
}
