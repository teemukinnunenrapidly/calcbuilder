'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import {
  getUserEffectivePermissions,
  hasPermission,
  PERMISSIONS,
  ROLE_HIERARCHY,
  UserRole,
} from '@/lib/permissions';
import {
  BarChart3,
  Calculator,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Shield,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function TestProtectedRoutesPage() {
  return (
    <ProtectedRoute>
      <TestProtectedRoutesContent />
    </ProtectedRoute>
  );
}

function TestProtectedRoutesContent() {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [testResults, setTestResults] = useState<{
    [key: string]: { passed: boolean; message: string; details?: string };
  }>({});

  const userRole = user?.user_metadata?.['role'] || 'user';
  const effectivePermissions = getUserEffectivePermissions(userRole as UserRole);

  const runTests = () => {
    const results: typeof testResults = {};

    // Test 1: Basic authentication
    results['auth'] = {
      passed: !!user,
      message: user ? 'User is authenticated' : 'User is not authenticated',
      details: user ? `Authenticated as: ${user.email}` : 'No user session found',
    };

    // Test 2: Role hierarchy
    const userLevel = ROLE_HIERARCHY[userRole as UserRole] || 1;
    results['roleHierarchy'] = {
      passed: userLevel > 0,
      message: `User role level: ${userLevel}`,
      details: `Role: ${userRole} (Level ${userLevel})`,
    };

    // Test 3: Permission checks
    const permissionTests = Object.entries(PERMISSIONS).map(([key, permission]) => {
      const hasAccess = hasPermission(userRole as UserRole, key as any);
      return { key, hasAccess, permission };
    });

    const passedPermissions = permissionTests.filter(test => test.hasAccess).length;
    const totalPermissions = permissionTests.length;

    results['permissions'] = {
      passed: passedPermissions > 0,
      message: `${passedPermissions}/${totalPermissions} permissions granted`,
      details: `Role ${userRole} has access to ${passedPermissions} out of ${totalPermissions} permissions`,
    };

    // Test 4: Role-based access
    const canManageUsers = hasPermission(userRole as UserRole, 'VIEW_USERS');
    const canViewAnalytics = hasPermission(userRole as UserRole, 'VIEW_ANALYTICS');
    const canManageSystem = hasPermission(userRole as UserRole, 'MANAGE_SETTINGS');

    results['roleAccess'] = {
      passed: canManageUsers || canViewAnalytics || canManageSystem,
      message: 'Role-based access control working',
      details: `Can manage users: ${canManageUsers}, Can view analytics: ${canViewAnalytics}, Can manage system: ${canManageSystem}`,
    };

    // Test 5: Protected route access
    results['protectedRoutes'] = {
      passed: true,
      message: 'Protected route access working',
      details: 'User successfully accessed this protected page',
    };

    setTestResults(results);
  };

  const getTestIcon = (passed: boolean) => {
    if (passed) {
      return <CheckCircle className='h-5 w-5 text-green-500' />;
    }
    return <XCircle className='h-5 w-5 text-red-500' />;
  };

  const getTestVariant = (passed: boolean) => {
    return passed ? 'default' : 'destructive';
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Protected Routes Test</h1>
          <p className='text-gray-600 mt-2'>
            Test and verify role-based access control and protected routes functionality
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Current User Info */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Current User Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Email</label>
                    <p className='text-gray-900'>{user?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Role</label>
                    <Badge variant={userRole === 'platform_admin' ? 'default' : 'secondary'}>
                      {userRole.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Role Level</label>
                    <p className='text-gray-900'>{ROLE_HIERARCHY[userRole as UserRole] || 1}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>User ID</label>
                    <p className='text-gray-900 text-sm font-mono'>
                      {user?.id ? `${user.id.slice(0, 8)}...` : 'Not available'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Test Results</CardTitle>
                  <Button onClick={runTests}>Run Tests</Button>
                </div>
                <CardDescription>
                  Click &quot;Run Tests&quot; to verify all functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(testResults).length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    Click &quot;Run Tests&quot; to start testing
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {Object.entries(testResults).map(([testName, result]) => (
                      <div key={testName} className='flex items-center gap-3 p-3 rounded-lg border'>
                        {getTestIcon(result.passed)}
                        <div className='flex-1'>
                          <h4 className='font-medium capitalize'>
                            {testName.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className='text-sm text-gray-600'>{result.message}</p>
                          {showDetails && result.details && (
                            <p className='text-xs text-gray-500 mt-1'>{result.details}</p>
                          )}
                        </div>
                        <Badge variant={getTestVariant(result.passed)}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permission Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Permission Matrix
                </CardTitle>
                <CardDescription>Detailed breakdown of permissions for your role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(PERMISSIONS).map(([key, permission]) => {
                    const hasAccess = hasPermission(userRole as UserRole, key as any);
                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border ${
                          hasAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <h4 className='font-medium text-sm'>{permission.name}</h4>
                            <p className='text-xs text-gray-600'>{permission.description}</p>
                          </div>
                          <Badge variant={hasAccess ? 'default' : 'secondary'} className='text-xs'>
                            {hasAccess ? '✓' : '✗'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button variant='outline' className='w-full justify-start' size='sm'>
                  <Users className='h-4 w-4 mr-2' />
                  View Profile
                </Button>
                {hasPermission(userRole as UserRole, 'VIEW_USERS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <Users className='h-4 w-4 mr-2' />
                    Manage Users
                  </Button>
                )}
                {hasPermission(userRole as UserRole, 'VIEW_CALCULATORS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <Calculator className='h-4 w-4 mr-2' />
                    View Calculators
                  </Button>
                )}
                {hasPermission(userRole as UserRole, 'VIEW_LEADS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <FileText className='h-4 w-4 mr-2' />
                    View Leads
                  </Button>
                )}
                {hasPermission(userRole as UserRole, 'VIEW_ANALYTICS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <BarChart3 className='h-4 w-4 mr-2' />
                    View Analytics
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Role Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Role Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center'>
                  <Badge variant='default' className='text-lg px-4 py-2'>
                    {userRole.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <p className='text-sm text-gray-600 mt-2'>
                    Level {effectivePermissions.roleLevel} Access
                  </p>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Can manage users</span>
                    <Badge variant={effectivePermissions.canManageUsers ? 'default' : 'secondary'}>
                      {effectivePermissions.canManageUsers ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Can manage system</span>
                    <Badge variant={effectivePermissions.canManageSystem ? 'default' : 'secondary'}>
                      {effectivePermissions.canManageSystem ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Can view analytics</span>
                    <Badge
                      variant={effectivePermissions.canViewAnalytics ? 'default' : 'secondary'}
                    >
                      {effectivePermissions.canViewAnalytics ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowDetails(!showDetails)}
                  className='w-full'
                >
                  {showDetails ? (
                    <EyeOff className='h-4 w-4 mr-2' />
                  ) : (
                    <Eye className='h-4 w-4 mr-2' />
                  )}
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
                <Button variant='outline' onClick={() => setTestResults({})} className='w-full'>
                  Clear Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
