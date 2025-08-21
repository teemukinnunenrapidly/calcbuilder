'use client';

// Force this page to be dynamic and disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { resetPasswordConfirmSchema, type ResetPasswordConfirmData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function ResetPasswordConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Get token from URL
  const accessToken = searchParams?.get('access_token');
  const refreshToken = searchParams?.get('refresh_token');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordConfirmData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    // Validate tokens are present
    if (!accessToken || !refreshToken) {
      setIsValidToken(false);
      setAuthError('Invalid or missing reset token. Please request a new password reset link.');
    } else {
      setIsValidToken(true);
    }
  }, [accessToken, refreshToken]);

  const onSubmit = async (data: ResetPasswordConfirmData) => {
    if (!accessToken || !refreshToken) {
      setAuthError('Invalid reset token. Please request a new password reset link.');
      return;
    }

    try {
      setIsLoading(true);
      setAuthError(null);

      // Update password using the tokens from the URL
      const { error } = await updatePassword(data.password);

      if (error) {
        setAuthError(error.message);
        return;
      }

      setResetSuccess(true);
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show error state for invalid token
  if (isValidToken === false) {
    return (
      <AuthLayout
        title='Invalid reset link'
        description='This password reset link is invalid or has expired'
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              This password reset link is invalid, expired, or has already been used.
            </AlertDescription>
          </Alert>

          <div className='space-y-3'>
            <Link href='/auth/reset-password'>
              <Button className='w-full'>Request new reset link</Button>
            </Link>

            <Link href='/auth/login'>
              <Button variant='outline' className='w-full'>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show success state
  if (resetSuccess) {
    return (
      <AuthLayout
        title='Password reset successful'
        description='Your password has been updated successfully'
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle2 className='w-6 h-6 text-green-600' />
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
          </div>

          <Link href='/auth/login'>
            <Button className='w-full'>Continue to Sign In</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Show loading state while validating token
  if (isValidToken === null) {
    return (
      <AuthLayout
        title='Validating reset link'
        description='Please wait while we validate your reset link'
        showBackToHome={false}
      >
        <div className='text-center py-8'>
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-gray-400' />
          <p className='mt-2 text-sm text-gray-600'>Validating...</p>
        </div>
      </AuthLayout>
    );
  }

  // Show password reset form
  return (
    <AuthLayout title='Set new password' description='Enter your new password below'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Auth Error Alert */}
        {authError && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <p className='text-sm text-blue-800'>
            Choose a strong password that you haven&apos;t used before.
          </p>
        </div>

        {/* New Password Field */}
        <FormInput
          {...register('password')}
          id='password'
          label='New password'
          isPassword
          placeholder='Enter your new password'
          error={errors.password?.message}
          required
          autoComplete='new-password'
          disabled={isLoading}
        />

        {/* Confirm New Password Field */}
        <FormInput
          {...register('confirmPassword')}
          id='confirmPassword'
          label='Confirm new password'
          isPassword
          placeholder='Confirm your new password'
          error={errors.confirmPassword?.message}
          required
          autoComplete='new-password'
          disabled={isLoading}
        />

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={isLoading || !isValid}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </Button>

        {/* Back to Login */}
        <div className='text-center'>
          <Link
            href='/auth/login'
            className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title='Validating reset link'
          description='Please wait while we validate your reset link'
          showBackToHome={false}
        >
          <div className='text-center py-8'>
            <Loader2 className='mx-auto h-8 w-8 animate-spin text-gray-400' />
            <p className='mt-2 text-sm text-gray-600'>Validating...</p>
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordConfirmContent />
    </Suspense>
  );
}
