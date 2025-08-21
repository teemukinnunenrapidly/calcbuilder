'use client';

// Force this page to be dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../src/components/ui/button';
import { Alert, AlertDescription } from '../../../src/components/ui/alert';
import { AuthLayout } from '../../../src/components/auth/AuthLayout';
import { createClient } from '../../../src/lib/supabase';
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type VerificationState = 'loading' | 'success' | 'error' | 'expired';

export default function EmailVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get tokens from URL
  const accessToken = searchParams?.get('access_token');
  const refreshToken = searchParams?.get('refresh_token');
  const tokenHash = searchParams?.get('token_hash');
  const type = searchParams?.get('type');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if this is an email verification
        if (type !== 'email') {
          setVerificationState('error');
          setErrorMessage('Invalid verification link type.');
          return;
        }

        // Check if we have the required tokens
        if (!tokenHash && (!accessToken || !refreshToken)) {
          setVerificationState('error');
          setErrorMessage('Invalid or missing verification tokens.');
          return;
        }

        const supabase = createClient();

        // If we have access and refresh tokens, set the session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setVerificationState('error');
            setErrorMessage('Failed to verify email. The link may have expired.');
            return;
          }
        }
        // If we have a token hash, verify it
        else if (tokenHash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (verifyError) {
            console.error('Verification error:', verifyError);
            if (verifyError.message.includes('expired')) {
              setVerificationState('expired');
            } else {
              setVerificationState('error');
              setErrorMessage(verifyError.message);
            }
            return;
          }
        }

        // Verification successful
        setVerificationState('success');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationState('error');
        setErrorMessage('An unexpected error occurred during verification.');
      }
    };

    verifyEmail();
  }, [accessToken, refreshToken, tokenHash, type, router]);

  // Loading state
  if (verificationState === 'loading') {
    return (
      <AuthLayout
        title='Verifying your email'
        description='Please wait while we verify your email address'
        showBackToHome={false}
      >
        <div className='text-center py-8'>
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-blue-600' />
          <p className='mt-4 text-sm text-gray-600'>Verifying your email address...</p>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (verificationState === 'success') {
    return (
      <AuthLayout
        title='Email verified successfully'
        description='Your email has been verified and your account is now active'
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle2 className='w-6 h-6 text-green-600' />
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>
              Welcome to CalcBuilder Pro! Your email has been successfully verified.
            </p>
            <p className='text-xs text-gray-500'>
              You&apos;ll be redirected to your dashboard in a few seconds...
            </p>
          </div>

          <div className='space-y-3 pt-4'>
            <Button onClick={() => router.push('/dashboard')} className='w-full'>
              Go to Dashboard
            </Button>

            <Link href='/auth/login'>
              <Button variant='outline' className='w-full'>
                Sign In Instead
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Expired state
  if (verificationState === 'expired') {
    return (
      <AuthLayout
        title='Verification link expired'
        description='This email verification link has expired'
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
            <XCircle className='w-6 h-6 text-yellow-600' />
          </div>

          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              This verification link has expired. Please sign in and we&apos;ll send you a new
              verification email.
            </AlertDescription>
          </Alert>

          <div className='space-y-3'>
            <Link href='/auth/login'>
              <Button className='w-full'>Sign In</Button>
            </Link>

            <Link href='/auth/register'>
              <Button variant='outline' className='w-full'>
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Error state
  return (
    <AuthLayout
      title='Verification failed'
      description="We couldn't verify your email address"
      showBackToHome={false}
    >
      <div className='text-center space-y-4'>
        <div className='mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
          <XCircle className='w-6 h-6 text-red-600' />
        </div>

        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            {errorMessage || 'Email verification failed. The link may be invalid or have expired.'}
          </AlertDescription>
        </Alert>

        <div className='space-y-3'>
          <Link href='/auth/login'>
            <Button className='w-full'>Sign In</Button>
          </Link>

          <Link href='/auth/register'>
            <Button variant='outline' className='w-full'>
              Create New Account
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
