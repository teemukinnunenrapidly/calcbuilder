'use client';

import { createClient } from '../lib/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Sign up with email verification
  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          ...(metadata && { data: metadata }),
        },
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      // Note: Supabase handles email verification automatically
      // We don't need to manually send emails for auth flows
      // Resend integration is for custom transactional emails (not auth)

      setAuthState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (error) {
      console.error('Error in signUp:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error as AuthError };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (error) {
      console.error('Error in signIn:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      console.error('Error in signOut:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error as AuthError };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      // Note: Supabase handles password reset emails automatically
      // We don't need to manually send emails for auth flows

      setAuthState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error as AuthError };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error as AuthError };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    supabase,
  };
}
