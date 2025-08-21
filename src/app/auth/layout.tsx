import { AuthProvider } from '@/lib/auth';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthRootLayout({ children }: AuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
