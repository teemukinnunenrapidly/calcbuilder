'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/types';
import { Activity, BarChart3, Globe, Settings, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CompanyMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCalculators: number;
  totalLeads: number;
  conversionRate: number;
  averageSessionDuration: number;
  monthlyGrowth: number;
  domainVerificationStatus: 'verified' | 'pending' | 'failed';
  lastActivity: string;
  storageUsage: number;
  storageLimit: number;
}

interface RecentActivity {
  id: string;
  type:
    | 'user_joined'
    | 'calculator_created'
    | 'lead_generated'
    | 'domain_verified'
    | 'settings_updated';
  description: string;
  timestamp: string;
  user?: string;
}

const defaultMetrics: CompanyMetrics = {
  totalUsers: 0,
  activeUsers: 0,
  totalCalculators: 0,
  totalLeads: 0,
  conversionRate: 0,
  averageSessionDuration: 0,
  monthlyGrowth: 0,
  domainVerificationStatus: 'pending',
  lastActivity: '',
  storageUsage: 0,
  storageLimit: 52428800, // 50MB in bytes
};

const defaultRecentActivity: RecentActivity[] = [];

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [metrics, setMetrics] = useState<CompanyMetrics>(defaultMetrics);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(defaultRecentActivity);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadCompanyData();
  }, [timeRange]);

  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      // Load company profile
      const companyResponse = await fetch('/api/companies');
      const companyData = await companyResponse.json();

      if (companyData.success && companyData.data && companyData.data.length > 0) {
        const companyInfo = companyData.data[0];
        setCompany(companyInfo);

        // Load company metrics
        await loadCompanyMetrics(companyInfo.id);

        // Load recent activity
        await loadRecentActivity(companyInfo.id);
      }
    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyMetrics = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/metrics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics || defaultMetrics);
      } else {
        // If metrics API doesn't exist yet, use demo data
        setMetrics({
          ...defaultMetrics,
          totalUsers: 12,
          activeUsers: 8,
          totalCalculators: 3,
          totalLeads: 47,
          conversionRate: 23.5,
          averageSessionDuration: 4.2,
          monthlyGrowth: 15.3,
          domainVerificationStatus: (company?.domain_verification_status === 'none' || company?.domain_verification_status === 'expired' ? 'pending' : company?.domain_verification_status) || 'pending',
          lastActivity: new Date().toISOString(),
          storageUsage: 2048576, // 2MB
          storageLimit: 52428800, // 50MB
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      // Use demo data on error
      setMetrics({
        ...defaultMetrics,
        totalUsers: 12,
        activeUsers: 8,
        totalCalculators: 3,
        totalLeads: 47,
        conversionRate: 23.5,
        averageSessionDuration: 4.2,
        monthlyGrowth: 15.3,
        domainVerificationStatus: company?.domain_verification_status || 'pending',
        lastActivity: new Date().toISOString(),
        storageUsage: 2048576,
        storageLimit: 52428800,
      });
    }
  };

  const loadRecentActivity = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/activity?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activity || defaultRecentActivity);
      } else {
        // Demo activity data
        setRecentActivity([
          {
            id: '1',
            type: 'user_joined',
            description: 'New team member joined',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: 'John Doe',
          },
          {
            id: '2',
            type: 'calculator_created',
            description: 'New calculator "Loan Calculator" created',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            user: 'Admin',
          },
          {
            id: '3',
            type: 'lead_generated',
            description: 'New lead from Loan Calculator',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            user: 'Anonymous',
          },
          {
            id: '4',
            type: 'settings_updated',
            description: 'Company branding updated',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            user: 'Admin',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
      // Use demo data on error
      setRecentActivity([
        {
          id: '1',
          type: 'user_joined',
          description: 'New team member joined',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'John Doe',
        },
        {
          id: '2',
          type: 'calculator_created',
          description: 'New calculator "Loan Calculator" created',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: 'Admin',
        },
      ]);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_joined':
        return <Users className='h-4 w-4 text-green-500' />;
      case 'calculator_created':
        return <BarChart3 className='h-4 w-4 text-blue-500' />;
      case 'lead_generated':
        return <TrendingUp className='h-4 w-4 text-purple-500' />;
      case 'domain_verified':
        return <Globe className='h-4 w-4 text-green-500' />;
      case 'settings_updated':
        return <Settings className='h-4 w-4 text-orange-500' />;
      default:
        return <Activity className='h-4 w-4 text-gray-500' />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_joined':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'calculator_created':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'lead_generated':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'domain_verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'settings_updated':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Company Dashboard</h1>
        <p className='text-gray-600 mt-2'>Overview of your company&apos;s performance and activity</p>
      </div>

      {/* Time Range Selector */}
      <div className='mb-6'>
        <div className='flex space-x-2'>
          {(['7d', '30d', '90d'] as const).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Total Users */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              {metrics.activeUsers} active this period
            </p>
          </CardContent>
        </Card>

        {/* Total Calculators */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Calculators</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalCalculators}</div>
            <p className='text-xs text-muted-foreground'>Active calculators</p>
          </CardContent>
        </Card>

        {/* Total Leads */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Leads</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.totalLeads}</div>
            <p className='text-xs text-muted-foreground'>
              {metrics.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Monthly Growth</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>+{metrics.monthlyGrowth}%</div>
            <p className='text-xs text-muted-foreground'>vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        {/* Session Duration */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Session Duration</CardTitle>
            <CardDescription>Average time users spend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-600'>
              {metrics.averageSessionDuration}m
            </div>
            <p className='text-sm text-muted-foreground mt-2'>Per user session</p>
          </CardContent>
        </Card>

        {/* Domain Status */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Domain Status</CardTitle>
            <CardDescription>White-label verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2'>
              <Badge
                variant={
                  metrics.domainVerificationStatus === 'verified'
                    ? 'default'
                    : metrics.domainVerificationStatus === 'pending'
                      ? 'secondary'
                      : 'destructive'
                }
                className='text-sm'
              >
                {metrics.domainVerificationStatus === 'verified'
                  ? 'Verified'
                  : metrics.domainVerificationStatus === 'pending'
                    ? 'Pending'
                    : 'Failed'}
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground mt-2'>
              {company?.domain || 'No domain set'}
            </p>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Storage Usage</CardTitle>
            <CardDescription>Company assets storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-purple-600'>
              {formatStorageSize(metrics.storageUsage)}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
              <div
                className='bg-purple-600 h-2 rounded-full'
                style={{ width: `${(metrics.storageUsage / metrics.storageLimit) * 100}%` }}
              ></div>
            </div>
            <p className='text-sm text-muted-foreground mt-2'>
              of {formatStorageSize(metrics.storageLimit)} used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Recent Activity</CardTitle>
          <CardDescription>Latest company activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentActivity.map(activity => (
              <div key={activity.id} className='flex items-start space-x-3 p-3 rounded-lg border'>
                <div className='flex-shrink-0 mt-1'>{getActivityIcon(activity.type)}</div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900'>{activity.description}</p>
                  <div className='flex items-center space-x-2 mt-1'>
                    {activity.user && (
                      <Badge variant='outline' className='text-xs'>
                        {activity.user}
                      </Badge>
                    )}
                    <span className='text-xs text-gray-500'>{formatDate(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              <Activity className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
