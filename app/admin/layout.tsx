'use client';

import { cn } from '@/lib/utils';
import {
  BarChart3,
  Building2,
  Calculator,
  FileText,
  Globe,
  LayoutDashboard,
  Mail,
  Server,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'System overview and metrics',
  },
  {
    name: 'Companies',
    href: '/admin/companies',
    icon: Building2,
    description: 'Manage company accounts',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'User management and permissions',
  },
  {
    name: 'Calculators',
    href: '/admin/calculators',
    icon: Calculator,
    description: 'Calculator builder and management',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'System analytics and reports',
  },
  {
    name: 'Domains',
    href: '/admin/domains',
    icon: Globe,
    description: 'Domain verification management',
  },
  {
    name: 'Assets',
    href: '/admin/assets',
    icon: FileText,
    description: 'System asset management',
  },
  {
    name: 'Email Templates',
    href: '/admin/email-templates',
    icon: Mail,
    description: 'Email template management',
  },
  {
    name: 'System',
    href: '/admin/system',
    icon: Server,
    description: 'System configuration and health',
  },
  {
    name: 'Security',
    href: '/admin/security',
    icon: Shield,
    description: 'Security settings and logs',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Navigation Bar */}
      <nav className='bg-white border-b border-gray-200'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>Admin Panel</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge variant='outline' className='text-sm'>
                System Admin
              </Badge>
              <Button variant='ghost' size='sm'>
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className='flex'>
        {/* Sidebar Navigation */}
        <div className='w-64 bg-white border-r border-gray-200 min-h-screen'>
          <div className='p-4'>
            <nav className='space-y-1'>
              {navigation.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-5 w-5'
                      )}
                    />
                    <div>
                      <div className='font-medium'>{item.name}</div>
                      <div className='text-xs text-gray-500'>{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1'>
          <main className='py-6'>{children}</main>
        </div>
      </div>
    </div>
  );
}

// Badge component (if not already imported)
function Badge({
  variant,
  className,
  children,
}: {
  variant: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'outline'
          ? 'bg-gray-100 text-gray-800 border border-gray-300'
          : 'bg-blue-100 text-blue-800',
        className
      )}
    >
      {children}
    </span>
  );
}

// Button component (if not already imported)
function Button({
  variant,
  size,
  className,
  children,
  ...props
}: {
  variant: string;
  size: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors',
        variant === 'ghost'
          ? 'text-gray-700 hover:bg-gray-100'
          : 'text-white bg-blue-600 hover:bg-blue-700',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
