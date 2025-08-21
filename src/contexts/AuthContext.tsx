'use client';

import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth } from '../hooks/use-supabase-auth';

// Authentication context interface
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: any;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  refreshSession: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    supabase,
  } = useSupabaseAuth();

  // Additional state for session management
  const [isInitialized, setIsInitialized] = useState(false);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session: newSession },
        error,
      } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, [supabase.auth]);

  // Set up session refresh interval
  useEffect(() => {
    if (session) {
      // Refresh session every 23 hours (before the 24-hour expiry)
      const refreshInterval = setInterval(refreshSession, 23 * 60 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
    return undefined;
  }, [session, refreshSession]);

  // Mark as initialized after first load
  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  // Context value
  const value: AuthContextType = {
    user,
    session,
    loading: loading || !isInitialized,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking if user is authenticated
export function useIsAuthenticated() {
  const { user, loading } = useAuth();
  return { isAuthenticated: !!user, loading };
}

// Hook for checking user roles
export function useUserRole() {
  const { user } = useAuth();
  return user?.user_metadata?.['role'] || 'user';
}
