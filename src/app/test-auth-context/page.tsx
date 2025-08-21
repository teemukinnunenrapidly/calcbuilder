'use client';

import { useAuth, useRoutePermission, useUserProfile } from '@/lib/auth';
import { useState } from 'react';

export default function TestAuthContextPage() {
  const { user, session, loading, error, signIn, signOut } = useAuth();
  const { profile, updateProfile, refreshProfile } = useUserProfile(user);
  const { hasAccess: hasAdminAccess } = useRoutePermission('platform_admin');
  const { hasAccess: hasClientAdminAccess } = useRoutePermission('client_admin');

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [testResult, setTestResult] = useState<string>('');

  const handleSignIn = async () => {
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setTestResult(`Sign in error: ${result.error.message}`);
      } else {
        setTestResult('Sign in successful!');
      }
    } catch (err) {
      setTestResult(`Sign in error: ${err}`);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.error) {
        setTestResult(`Sign out error: ${result.error.message}`);
      } else {
        setTestResult('Sign out successful!');
      }
    } catch (err) {
      setTestResult(`Sign out error: ${err}`);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const result = await updateProfile({ name: 'Updated Test User' });
      if (result?.success) {
        setTestResult('Profile updated successfully!');
      } else {
        setTestResult(`Profile update error: ${result?.error}`);
      }
    } catch (err) {
      setTestResult(`Profile update error: ${err}`);
    }
  };

  const handleRefreshProfile = () => {
    refreshProfile();
    setTestResult('Profile refresh triggered!');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Authentication Context Test</h1>
          <p className='text-gray-600'>
            Test the authentication context, state management, and user profile functionality
          </p>
        </div>

        {/* Authentication Status */}
        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Authentication Status</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>User</p>
              <p className='text-sm text-gray-900'>{user ? user.email : 'Not authenticated'}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Session</p>
              <p className='text-sm text-gray-900'>{session ? 'Active' : 'No session'}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Loading</p>
              <p className='text-sm text-gray-900'>{loading ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Error</p>
              <p className='text-sm text-gray-900'>{error ? error.message : 'None'}</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>User Profile</h2>

          {profile ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Name</p>
                <p className='text-sm text-gray-900'>{profile.name || 'Not set'}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-gray-500'>Role</p>
                <p className='text-sm text-gray-900'>{profile.role}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-gray-500'>Company ID</p>
                <p className='text-sm text-gray-900'>{profile.company_id || 'Not set'}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-gray-500'>Created</p>
                <p className='text-sm text-gray-900'>
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className='text-gray-500'>No profile data available</p>
          )}

          <div className='flex gap-2'>
            <button
              onClick={handleUpdateProfile}
              disabled={!profile}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Update Profile
            </button>

            <button
              onClick={handleRefreshProfile}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Refresh Profile
            </button>
          </div>
        </div>

        {/* Route Permissions */}
        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Route Permissions</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>User Access</p>
              <p className='text-sm text-gray-900'>✅ Always available</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Client Admin Access</p>
              <p className='text-sm text-gray-900'>
                {hasClientAdminAccess ? '✅ Available' : '❌ Not available'}
              </p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Platform Admin Access</p>
              <p className='text-sm text-gray-900'>
                {hasAdminAccess ? '✅ Available' : '❌ Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Actions */}
        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Authentication Actions</h2>

          {!user ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Email'
                  className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <input
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Password'
                  className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <button
                onClick={handleSignIn}
                className='w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className='w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Test Results</h2>

            <div className='p-4 bg-gray-100 rounded-md'>
              <p className='text-sm text-gray-900'>{testResult}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
