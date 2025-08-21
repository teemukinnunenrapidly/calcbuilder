'use client';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  isPassword?: boolean;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, isPassword = false, required = false, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasError = !!error;

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

    return (
      <div className='space-y-2'>
        <Label htmlFor={props.id} className={cn('text-sm font-medium', hasError && 'text-red-600')}>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </Label>

        <div className='relative'>
          <Input
            {...props}
            ref={ref}
            type={inputType}
            className={cn(
              'w-full',
              hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              isPassword && 'pr-10',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
          />

          {isPassword && (
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4 text-gray-400 hover:text-gray-600' />
              ) : (
                <Eye className='h-4 w-4 text-gray-400 hover:text-gray-600' />
              )}
            </button>
          )}
        </div>

        {hasError && (
          <div
            id={`${props.id}-error`}
            className='flex items-center gap-1 text-sm text-red-600'
            role='alert'
          >
            <AlertCircle className='h-4 w-4' />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
