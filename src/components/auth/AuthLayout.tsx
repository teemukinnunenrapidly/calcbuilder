'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showBackToHome?: boolean;
}

export function AuthLayout({
  children,
  title,
  description,
  showBackToHome = true,
}: AuthLayoutProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Logo/Brand */}
        <div className='text-center'>
          <Link href='/' className='inline-block'>
            <h1 className='text-3xl font-bold text-gray-900'>CalcBuilder Pro</h1>
            <p className='text-sm text-gray-600 mt-1'>Professional Calculator Builder</p>
          </Link>
        </div>

        {/* Auth Card */}
        <Card className='w-full'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-semibold tracking-tight'>{title}</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>{children}</CardContent>
        </Card>

        {/* Back to Home */}
        {showBackToHome && (
          <div className='text-center'>
            <Link href='/' className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
