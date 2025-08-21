import { AuthProvider } from '../../src/lib/auth';
import { ReactNode } from 'react';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TestAuthLayoutProps {
  children: ReactNode;
}

export default function TestAuthLayout({ children }: TestAuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
