'use client';

// Force this page to be dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../../src/components/auth/AuthLayout';
import { FormInput } from '../../../src/components/auth/FormInput';
import { Alert, AlertDescription } from '../../../src/components/ui/alert';
import { Button } from '../../../src/components/ui/button';
import { useAuth } from '../../../src/lib/auth';
import { loginSchema, type LoginFormData } from '../../../src/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const redirectTo = searchParams?.get('next') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { error } = await signIn(data.email, data.password);

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Successful login - redirect to the intended page
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Sign in to your account'
      description='Enter your email and password to access your dashboard'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Auth Error Alert */}
        {authError && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

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

        {/* Password Field */}
        <FormInput
          {...register('password')}
          id='password'
          label='Password'
          isPassword
          placeholder='Enter your password'
          error={errors.password?.message}
          required
          autoComplete='current-password'
          disabled={isLoading}
        />

        {/* Forgot Password Link */}
        <div className='flex items-center justify-between'>
          <div></div>
          <Link
            href='/auth/reset-password'
            className='text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors'
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={isLoading || !isValid}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        {/* Registration Link */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/auth/register'
              className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
            >
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
