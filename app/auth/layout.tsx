import { AuthProvider } from '../../src/lib/auth';
import { ReactNode } from 'react';

// Force all auth pages to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthRootLayout({ children }: AuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
