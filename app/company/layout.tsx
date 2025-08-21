'use client';

import { cn } from '@/lib/utils';
import { Building2, Globe, Image, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    name: 'Dashboard',
    href: '/company/dashboard',
    icon: LayoutDashboard,
    description: 'Company overview and metrics',
  },
  {
    name: 'Profile',
    href: '/company/profile',
    icon: Building2,
    description: 'Company branding and profile',
  },
  {
    name: 'Assets',
    href: '/company/assets',
    icon: Image,
    description: 'Company asset management',
  },
  {
    name: 'Domains',
    href: '/company/domains',
    icon: Globe,
    description: 'Domain verification and white-labeling',
  },
  {
    name: 'Team',
    href: '/company/team',
    icon: Users,
    description: 'Team member management',
  },
  {
    name: 'Settings',
    href: '/company/settings',
    icon: Settings,
    description: 'Company configuration',
  },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header */}
      <nav className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <h1 className='text-xl font-semibold text-gray-900'>Company Management</h1>
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                {navigation.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                    >
                      <item.icon className='h-4 w-4 mr-2' />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className='sm:hidden bg-white border-b border-gray-200'>
        <div className='px-2 pt-2 pb-3 space-y-1'>
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
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                )}
              >
                <div className='flex items-center'>
                  <item.icon className='h-4 w-4 mr-3' />
                  <div>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-sm text-gray-500'>{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>{children}</main>
    </div>
  );
}
