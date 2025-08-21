'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { resetPasswordRequestSchema, type ResetPasswordRequestData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ResetPasswordRequestData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordRequestData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { error } = await resetPassword(data.email);

      if (error) {
        setAuthError(error.message);
        return;
      }

      setResetSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <AuthLayout
        title='Check your email'
        description="We've sent you a password reset link"
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle2 className='w-6 h-6 text-green-600' />
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>
              We&apos;ve sent a password reset link to{' '}
              <span className='font-medium'>{getValues('email')}</span>
            </p>
            <p className='text-xs text-gray-500'>
              Please check your email and click the link to reset your password. The link will
              expire in 1 hour.
            </p>
          </div>

          <div className='space-y-3 pt-4'>
            <Button onClick={() => setResetSuccess(false)} variant='outline' className='w-full'>
              Send another email
            </Button>

            <Link href='/auth/login'>
              <Button variant='ghost' className='w-full'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title='Reset your password'
      description="Enter your email address and we'll send you a link to reset your password"
    >
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
            Enter the email address associated with your account and we&apos;ll send you a link to
            reset your password.
          </p>
        </div>

        {/* Email Field */}
        <FormInput
          {...register('email')}
          id='email'
          label='Email address'
          type='email'
          placeholder='you@example.com'
          error={errors.email?.message}
          required
          autoComplete='email'
          disabled={isLoading}
        />

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={isLoading || !isValid}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>

        {/* Back to Login */}
        <div className='text-center'>
          <Link
            href='/auth/login'
            className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center'
          >
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
