'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Settings,
  Globe,
  Palette,
  FileText,
  Mail,
  Calculator,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SystemMetrics {
  totalCompanies: number;
  totalUsers: number;
  totalCalculators: number;
  totalLeads: number;
  activeCompanies: number;
  pendingVerifications: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastBackup: string;
  storageUsage: number;
  storageLimit: number;
}

interface RecentActivity {
  id: string;
  type: 'company_created' | 'user_registered' | 'calculator_built' | 'lead_generated' | 'system_update';
  description: string;
  timestamp: string;
  company?: string;
  user?: string;
  severity: 'info' | 'warning' | 'error';
}

const defaultMetrics: SystemMetrics = {
  totalCompanies: 0,
  totalUsers: 0,
  totalCalculators: 0,
  totalLeads: 0,
  activeCompanies: 0,
  pendingVerifications: 0,
  systemHealth: 'healthy',
  lastBackup: '',
  storageUsage: 0,
  storageLimit: 107374182400 // 100GB in bytes
};

const defaultRecentActivity: RecentActivity[] = [];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>(defaultMetrics);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(defaultRecentActivity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      // Load system metrics
      await loadSystemMetrics();
      
      // Load recent activity
      await loadRecentActivity();
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      // For now, we'll use demo data since we don't have a system metrics API yet
      // In the future, this should come from a dedicated system metrics endpoint
      setMetrics({
        totalCompanies: 12,
        totalUsers: 47,
        totalCalculators: 8,
        totalLeads: 156,
        activeCompanies: 10,
        pendingVerifications: 3,
        systemHealth: 'healthy',
        lastBackup: new Date().toISOString(),
        storageUsage: 2147483648, // 2GB
        storageLimit: 107374182400 // 100GB
      });
    } catch (error) {
      console.error('Error loading system metrics:', error);
      // Use demo data on error
      setMetrics({
        totalCompanies: 12,
        totalUsers: 47,
        totalCalculators: 8,
        totalLeads: 156,
        activeCompanies: 10,
        pendingVerifications: 3,
        systemHealth: 'healthy',
        lastBackup: new Date().toISOString(),
        storageUsage: 2147483648,
        storageLimit: 107374182400
      });
    }
  };

  const loadRecentActivity = async () => {
    try {
      // For now, we'll use demo data since we don't have a system activity API yet
      // In the future, this should come from a dedicated system activity endpoint
      setRecentActivity([
        {
          id: '1',
          type: 'company_created',
          description: 'New company "TechCorp Solutions" registered',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          company: 'TechCorp Solutions',
          severity: 'info'
        },
        {
          id: '2',
          type: 'user_registered',
          description: 'New user registered for company "InnovateLabs"',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: 'john.doe@innovatelabs.com',
          severity: 'info'
        },
        {
          id: '3',
          type: 'calculator_built',
          description: 'New calculator "Loan Calculator" created',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          company: 'FinancePro',
          severity: 'info'
        },
        {
          id: '4',
          type: 'lead_generated',
          description: 'High-value lead generated from "Investment Calculator"',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          company: 'WealthBuilders',
          severity: 'info'
        },
        {
          id: '5',
          type: 'system_update',
          description: 'System maintenance completed successfully',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          severity: 'info'
        }
      ]);
    } catch (error) {
      console.error('Error loading recent activity:', error);
      // Use demo data on error
      setRecentActivity([
        {
          id: '1',
          type: 'company_created',
          description: 'New company registered',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          severity: 'info'
        }
      ]);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'company_created':
        return <Building2 className="h-4 w-4" />;
      case 'user_registered':
        return <Users className="h-4 w-4" />;
      case 'calculator_built':
        return <Calculator className="h-4 w-4" />;
      case 'lead_generated':
        return <TrendingUp className="h-4 w-4" />;
      case 'system_update':
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: RecentActivity['severity']) => {
    switch (severity) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSystemHealthIcon = (health: SystemMetrics['systemHealth']) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSystemHealthColor = (health: SystemMetrics['systemHealth']) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          System overview and administration panel
        </p>
      </div>

      {/* System Health Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getSystemHealthIcon(metrics.systemHealth)}
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and operational status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge 
                variant={metrics.systemHealth === 'healthy' ? 'default' : 'secondary'}
                className={getSystemHealthColor(metrics.systemHealth)}
              >
                {metrics.systemHealth === 'healthy' ? 'Healthy' : 
                 metrics.systemHealth === 'warning' ? 'Warning' : 'Error'}
              </Badge>
              <span className="text-sm text-gray-600">
                Last backup: {formatDate(metrics.lastBackup)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Storage: {formatStorageSize(metrics.storageUsage)} / {formatStorageSize(metrics.storageLimit)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeCompanies} active
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all companies
            </p>
          </CardContent>
        </Card>

        {/* Total Calculators */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calculators</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCalculators}</div>
            <p className="text-xs text-muted-foreground">
              Active calculators
            </p>
          </CardContent>
        </Card>

        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Generated leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Verifications</CardTitle>
            <CardDescription>Domain and company verifications awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {metrics.pendingVerifications}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Require attention
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Review Verifications
            </Button>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
            <CardDescription>System storage utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatStorageSize(metrics.storageUsage)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(metrics.storageUsage / metrics.storageLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              of {formatStorageSize(metrics.storageLimit)} used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Building2 className="h-6 w-6" />
              <span>Manage Companies</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>User Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calculator className="h-6 w-6" />
              <span>Calculator Builder</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent System Activity</CardTitle>
          <CardDescription>Latest system events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 mt-1">
                  <div className={getSeverityColor(activity.severity)}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {activity.company && (
                      <Badge variant="outline" className="text-xs">
                        {activity.company}
                      </Badge>
                    )}
                    {activity.user && (
                      <Badge variant="outline" className="text-xs">
                        {activity.user}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {recentActivity.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
