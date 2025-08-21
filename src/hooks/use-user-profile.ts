'use client';

import { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { createServiceRoleClient } from '../lib/supabase';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'platform_admin' | 'client_admin' | 'user';
  company_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// Hook for user profile management
export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createServiceRoleClient();

      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found in database, create profile
          await createUserProfile(user);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create user profile in database
  const createUserProfile = async (user: User) => {
    try {
      const supabase = createServiceRoleClient();

      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.['name'] || user.email?.split('@')[0],
        role: 'user', // Default role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: user.user_metadata,
      };

      const { data, error } = await supabase.from('users').insert(newProfile).select().single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error creating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createServiceRoleClient();

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile data
  const refreshProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch profile when user changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
}
