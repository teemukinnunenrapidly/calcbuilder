'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { hasPermission, ROLE_HIERARCHY, UserRole } from '@/lib/permissions';
import {
  Building,
  Calendar,
  Edit3,
  Mail,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserManagementPage() {
  return (
    <ProtectedRoute requiredRole='client_admin'>
      <UserManagementContent />
    </ProtectedRoute>
  );
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    role?: UserRole;
    name?: string;
    company?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
}

function UserManagementContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const currentUserRole = currentUser?.user_metadata?.['role'] || 'user';
  const canManageUsers = hasPermission(currentUserRole as UserRole, 'VIEW_USERS');
  const canDeleteUsers = hasPermission(currentUserRole as UserRole, 'DELETE_USERS');

  // Mock data for demonstration - in real app, this would come from API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@company.com',
        user_metadata: {
          role: 'client_admin',
          name: 'John Admin',
          company: 'Tech Corp',
        },
        created_at: '2024-01-15T10:00:00Z',
        last_sign_in_at: '2024-01-20T14:30:00Z',
      },
      {
        id: '2',
        email: 'user1@company.com',
        user_metadata: {
          role: 'user',
          name: 'Alice User',
          company: 'Tech Corp',
        },
        created_at: '2024-01-16T11:00:00Z',
        last_sign_in_at: '2024-01-19T09:15:00Z',
      },
      {
        id: '3',
        email: 'user2@company.com',
        user_metadata: {
          role: 'user',
          name: 'Bob Manager',
          company: 'Tech Corp',
        },
        created_at: '2024-01-17T12:00:00Z',
        last_sign_in_at: '2024-01-20T16:45:00Z',
      },
    ];

    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.user_metadata.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // In real app, this would be an API call
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, user_metadata: { ...user.user_metadata, role: newRole } }
            : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!canDeleteUsers) {
      setError('You do not have permission to delete users');
      return;
    }

    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // In real app, this would be an API call
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const canEditUser = (targetUser: User) => {
    const targetRole = targetUser.user_metadata.role || 'user';
    const currentLevel = ROLE_HIERARCHY[currentUserRole as UserRole] || 1;
    const targetLevel = ROLE_HIERARCHY[targetRole] || 1;

    // Can only edit users with lower or equal role level
    return currentLevel >= targetLevel;
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <Shield className='h-12 w-12 text-red-500 mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2'>Access Denied</h2>
              <p className='text-gray-600 mb-4'>You don&apos;t have permission to manage users.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>User Management</h1>
              <p className='text-gray-600 mt-2'>
                Manage users, roles, and permissions for your organization
              </p>
            </div>
            <Button onClick={() => setShowAddUser(true)}>
              <UserPlus className='h-4 w-4 mr-2' />
              Add User
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters and Search */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='search'>Search Users</Label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='search'
                    placeholder='Search by email or name...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='role-filter'>Filter by Role</Label>
                <Select
                  value={roleFilter}
                  onValueChange={value => setRoleFilter(value as UserRole | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Roles</SelectItem>
                    <SelectItem value='client_admin'>Client Admin</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Total Users</Label>
                <div className='text-2xl font-bold text-blue-600'>{filteredUsers.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className='grid gap-6'>
          {filteredUsers.map(user => (
            <Card key={user.id}>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <Users className='h-6 w-6 text-blue-600' />
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold'>
                          {user.user_metadata.name || 'No name set'}
                        </h3>
                        <Badge
                          variant={
                            user.user_metadata.role === 'client_admin' ? 'default' : 'secondary'
                          }
                        >
                          {user.user_metadata.role?.replace('_', ' ').toUpperCase() || 'USER'}
                        </Badge>
                      </div>

                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Mail className='h-4 w-4' />
                          {user.email}
                        </div>
                        {user.user_metadata.company && (
                          <div className='flex items-center gap-1'>
                            <Building className='h-4 w-4' />
                            {user.user_metadata.company}
                          </div>
                        )}
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-4 w-4' />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {canEditUser(user) && (
                      <Button variant='outline' size='sm' onClick={() => setEditingUser(user)}>
                        <Edit3 className='h-4 w-4 mr-2' />
                        Edit Role
                      </Button>
                    )}

                    {canDeleteUsers && canEditUser(user) && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteUser(user.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Role Editing Modal */}
                {editingUser?.id === user.id && (
                  <div className='mt-4 p-4 bg-gray-50 rounded-lg border'>
                    <div className='flex items-center gap-4'>
                      <Label htmlFor={`role-${user.id}`}>Change Role:</Label>
                      <Select
                        value={user.user_metadata.role || 'user'}
                        onValueChange={value => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className='w-48'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='user'>User</SelectItem>
                          <SelectItem value='client_admin'>Client Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant='outline' size='sm' onClick={() => setEditingUser(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center py-8'>
                <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No users found</h3>
                <p className='text-gray-500'>
                  {searchTerm || roleFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No users have been added yet'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
