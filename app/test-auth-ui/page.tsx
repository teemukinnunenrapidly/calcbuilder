'use client';

// Force this page to be dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { useAuth } from '../../src/lib/auth';
import { ExternalLink, User, LogOut, Shield } from 'lucide-react';

export default function TestAuthUIPage() {
  const { user, signOut, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  const authPages = [
    {
      title: 'Login Page',
      description: 'Test the login form with email and password',
      href: '/auth/login',
      status: 'ready',
    },
    {
      title: 'Registration Page',
      description: 'Test user registration with validation',
      href: '/auth/register',
      status: 'ready',
    },
    {
      title: 'Password Reset Request',
      description: 'Test password reset email request',
      href: '/auth/reset-password',
      status: 'ready',
    },
    {
      title: 'Email Verification',
      description: 'Test email verification flow (requires email link)',
      href: '/auth/verify',
      status: 'needs-token',
    },
    {
      title: 'Password Reset Confirm',
      description: 'Test password reset confirmation (requires email link)',
      href: '/auth/reset-password/confirm',
      status: 'needs-token',
    },
    {
      title: 'Unauthorized Page',
      description: 'Test access denied page for insufficient permissions',
      href: '/auth/unauthorized',
      status: 'ready',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Authentication UI Test Page</h1>
          <p className='text-lg text-gray-600 mt-2'>
            Test all authentication user interface components
          </p>
        </div>

        {/* Current User Status */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Current Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className='text-gray-600'>Loading authentication state...</p>
            ) : user ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-green-700'>✅ Authenticated</p>
                    <p className='text-sm text-gray-600'>
                      Signed in as: <span className='font-medium'>{user.email}</span>
                    </p>
                    <p className='text-sm text-gray-600'>
                      User ID: <span className='font-mono text-xs'>{user.id}</span>
                    </p>
                    <p className='text-sm text-gray-600'>
                      Role:{' '}
                      <span className='font-medium'>{user.user_metadata?.['role'] || 'user'}</span>
                    </p>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant='outline'
                    size='sm'
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      'Signing out...'
                    ) : (
                      <>
                        <LogOut className='mr-1 h-4 w-4' />
                        Sign Out
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className='font-medium text-red-700'>❌ Not Authenticated</p>
                <p className='text-sm text-gray-600'>No user is currently signed in</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Authentication Pages Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {authPages.map(page => (
            <Card key={page.href} className='flex flex-col'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-lg'>{page.title}</CardTitle>
                  <Badge
                    variant={page.status === 'ready' ? 'default' : 'secondary'}
                    className='ml-2'
                  >
                    {page.status === 'ready' ? 'Ready' : 'Needs Token'}
                  </Badge>
                </div>
                <CardDescription className='text-sm'>{page.description}</CardDescription>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col justify-end'>
                <Link href={page.href}>
                  <Button
                    className='w-full'
                    variant={page.status === 'ready' ? 'default' : 'secondary'}
                  >
                    <ExternalLink className='mr-2 h-4 w-4' />
                    Test Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Protected Route Testing */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Protected Route Testing
            </CardTitle>
            <CardDescription>Test role-based access control and protected routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium'>User Access (Default)</h4>
                <p className='text-sm text-gray-600'>
                  Should be accessible to all authenticated users
                </p>
                <Link href='/dashboard'>
                  <Button variant='outline' size='sm' className='w-full'>
                    Test Dashboard Access
                  </Button>
                </Link>
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium'>Admin Access</h4>
                <p className='text-sm text-gray-600'>
                  Should redirect to unauthorized page for non-admins
                </p>
                <Link href='/auth/unauthorized'>
                  <Button variant='outline' size='sm' className='w-full'>
                    Test Admin Access
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='text-sm space-y-2'>
              <h4 className='font-medium'>✅ Completed Features:</h4>
              <ul className='list-disc list-inside space-y-1 text-gray-600'>
                <li>Login form with email/password validation</li>
                <li>Registration form with Zod validation</li>
                <li>Password reset request form</li>
                <li>Password reset confirmation form</li>
                <li>Email verification handling</li>
                <li>Loading states and error handling</li>
                <li>Responsive design with shadcn/ui</li>
                <li>AuthContext integration</li>
                <li>Form validation with React Hook Form</li>
                <li>Accessibility features</li>
              </ul>
            </div>
            <div className='text-sm space-y-2'>
              <h4 className='font-medium'>📝 Testing Notes:</h4>
              <ul className='list-disc list-inside space-y-1 text-gray-600'>
                <li>Email verification and password reset require actual email tokens</li>
                <li>Form validation triggers on input change</li>
                <li>Loading states prevent double submissions</li>
                <li>Error messages display for failed auth attempts</li>
                <li>Success states redirect appropriately</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className='mt-8 text-center'>
          <Link href='/'>
            <Button variant='outline'>← Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
