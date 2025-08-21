'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, LogOut, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AuthLayout
      title='Access denied'
      description="You don't have permission to access this page"
      showBackToHome={false}
    >
      <div className='text-center space-y-4'>
        <div className='mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
          <XCircle className='w-6 h-6 text-red-600' />
        </div>

        <div className='space-y-2'>
          <p className='text-sm text-gray-600'>
            {user ? (
              <>
                You are signed in as <span className='font-medium'>{user.email}</span>, but you
                don&apos;t have the required permissions to access this page.
              </>
            ) : (
              'You need to sign in with an authorized account to access this page.'
            )}
          </p>
        </div>

        <div className='space-y-3 pt-4'>
          {user ? (
            <>
              <Link href='/dashboard'>
                <Button className='w-full'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Go to Dashboard
                </Button>
              </Link>

              <Button onClick={handleSignOut} variant='outline' className='w-full'>
                <LogOut className='mr-2 h-4 w-4' />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href='/auth/login'>
                <Button className='w-full'>Sign In</Button>
              </Link>

              <Link href='/auth/register'>
                <Button variant='outline' className='w-full'>
                  Create Account
                </Button>
              </Link>
            </>
          )}

          <Link href='/'>
            <Button variant='ghost' className='w-full'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
