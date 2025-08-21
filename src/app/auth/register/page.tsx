'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { error } = await signUp(data.email, data.password, {
        name: data.name,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Registration successful
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <AuthLayout
        title='Check your email'
        description="We've sent you a verification link to complete your registration"
        showBackToHome={false}
      >
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle2 className='w-6 h-6 text-green-600' />
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>
              Please check your email and click the verification link to activate your account.
            </p>
            <p className='text-xs text-gray-500'>
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setRegistrationSuccess(false)}
                className='text-blue-600 hover:text-blue-500 underline'
              >
                try registering again
              </button>
            </p>
          </div>

          <div className='pt-4'>
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

  return (
    <AuthLayout
      title='Create your account'
      description='Start building professional calculators today'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Auth Error Alert */}
        {authError && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* Name Field */}
        <FormInput
          {...register('name')}
          id='name'
          label='Full name'
          type='text'
          placeholder='John Doe'
          error={errors.name?.message}
          required
          autoComplete='name'
          disabled={isLoading}
        />

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
          placeholder='Create a strong password'
          error={errors.password?.message}
          required
          autoComplete='new-password'
          disabled={isLoading}
        />

        {/* Confirm Password Field */}
        <FormInput
          {...register('confirmPassword')}
          id='confirmPassword'
          label='Confirm password'
          isPassword
          placeholder='Confirm your password'
          error={errors.confirmPassword?.message}
          required
          autoComplete='new-password'
          disabled={isLoading}
        />

        {/* Terms and Conditions */}
        <div className='space-y-2'>
          <div className='flex items-start space-x-2'>
            <Checkbox
              id='acceptTerms'
              checked={acceptTerms}
              onCheckedChange={checked => setValue('acceptTerms', checked as boolean)}
              disabled={isLoading}
            />
            <Label
              htmlFor='acceptTerms'
              className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              I agree to the{' '}
              <Link
                href='/terms'
                className='text-blue-600 hover:text-blue-500 underline'
                target='_blank'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='text-blue-600 hover:text-blue-500 underline'
                target='_blank'
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className='text-sm text-red-600 flex items-center gap-1'>
              <AlertCircle className='h-4 w-4' />
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={isLoading || !isValid}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        {/* Login Link */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/auth/login'
              className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
