'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUserProfile } from '@/lib/auth';
import { getUserEffectivePermissions, hasPermission, PERMISSIONS } from '@/lib/permissions';
import { BarChart3, Edit3, Save, Settings, Shield, User, Users, X } from 'lucide-react';
import { useState } from 'react';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfileContent />
    </ProtectedRoute>
  );
}

function UserProfileContent() {
  const { user } = useAuth();
  const { profile, updateProfile, loading, error } = useUserProfile(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    company: profile?.metadata?.['company'] || '',
    phone: profile?.metadata?.['phone'] || '',
  });

  const userRole = user?.user_metadata?.['role'] || 'user';
  const effectivePermissions = getUserEffectivePermissions(userRole as any);

  const handleEdit = () => {
    setEditForm({
      name: profile?.name || '',
      company: profile?.metadata?.['company'] || '',
      phone: profile?.metadata?.['phone'] || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        metadata: {
          ...profile?.metadata,
          company: editForm.company,
          phone: editForm.phone,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>User Profile</h1>
          <p className='text-gray-600 mt-2'>Manage your account information and permissions</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Information */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Profile Card */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <User className='h-5 w-5' />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Your personal and account information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={handleEdit} variant='outline' size='sm'>
                      <Edit3 className='h-4 w-4 mr-2' />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {error && (
                  <Alert variant='destructive'>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <Input id='email' value={user?.email || ''} disabled className='bg-gray-50' />
                    <p className='text-xs text-gray-500'>Email cannot be changed</p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='role'>User Role</Label>
                    <div className='flex items-center gap-2'>
                      <Badge variant={userRole === 'platform_admin' ? 'default' : 'secondary'}>
                        {userRole.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Shield className='h-4 w-4 text-gray-400' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    {isEditing ? (
                      <Input
                        id='name'
                        value={editForm.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        placeholder='Enter your full name'
                      />
                    ) : (
                      <Input
                        id='name'
                        value={profile?.name || 'Not set'}
                        disabled
                        className='bg-gray-50'
                      />
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='company'>Company</Label>
                    {isEditing ? (
                      <Input
                        id='company'
                        value={editForm.company}
                        onChange={e => handleInputChange('company', e.target.value)}
                        placeholder='Enter company name'
                      />
                    ) : (
                      <Input
                        id='company'
                        value={profile?.metadata?.['company'] || 'Not set'}
                        disabled
                        className='bg-gray-50'
                      />
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id='phone'
                        value={editForm.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        placeholder='Enter phone number'
                      />
                    ) : (
                      <Input
                        id='phone'
                        value={profile?.metadata?.['phone'] || 'Not set'}
                        disabled
                        className='bg-gray-50'
                      />
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label>Account Created</Label>
                    <Input
                      value={
                        profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString()
                          : 'Unknown'
                      }
                      disabled
                      className='bg-gray-50'
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className='flex gap-2 pt-4'>
                    <Button onClick={handleSave} size='sm'>
                      <Save className='h-4 w-4 mr-2' />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant='outline' size='sm'>
                      <X className='h-4 w-4 mr-2' />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Your Permissions
                </CardTitle>
                <CardDescription>
                  Based on your role: {userRole.replace('_', ' ').toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(PERMISSIONS).map(([key, permission]) => {
                    const hasAccess = hasPermission(userRole as any, key as any);
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
                            {hasAccess ? 'Allowed' : 'Denied'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Role Information */}
          <div className='space-y-6'>
            {/* Role Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Role Summary
                </CardTitle>
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

                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-gray-400' />
                    <span className='text-sm'>
                      {effectivePermissions.canManageUsers
                        ? 'Can manage users'
                        : 'Cannot manage users'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4 text-gray-400' />
                    <span className='text-sm'>
                      {effectivePermissions.canManageSystem
                        ? 'Can manage system'
                        : 'Cannot manage system'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BarChart3 className='h-4 w-4 text-gray-400' />
                    <span className='text-sm'>
                      {effectivePermissions.canViewAnalytics
                        ? 'Can view analytics'
                        : 'Cannot view analytics'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button variant='outline' className='w-full justify-start' size='sm'>
                  <User className='h-4 w-4 mr-2' />
                  View Dashboard
                </Button>
                {hasPermission(userRole as any, 'VIEW_CALCULATORS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <Settings className='h-4 w-4 mr-2' />
                    Manage Calculators
                  </Button>
                )}
                {hasPermission(userRole as any, 'VIEW_LEADS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <BarChart3 className='h-4 w-4 mr-2' />
                    View Leads
                  </Button>
                )}
                {hasPermission(userRole as any, 'VIEW_ANALYTICS') && (
                  <Button variant='outline' className='w-full justify-start' size='sm'>
                    <BarChart3 className='h-4 w-4 mr-2' />
                    View Analytics
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
