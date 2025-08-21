export type UserRole = 'platform_admin' | 'client_admin' | 'user';

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// Define all available permissions
export const PERMISSIONS = {
  // User Management
  VIEW_USERS: {
    id: 'view_users',
    name: 'View Users',
    description: 'Can view user profiles and lists',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  CREATE_USERS: {
    id: 'create_users',
    name: 'Create Users',
    description: 'Can create new user accounts',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  EDIT_USERS: {
    id: 'edit_users',
    name: 'Edit Users',
    description: 'Can modify user information',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  DELETE_USERS: {
    id: 'delete_users',
    name: 'Delete Users',
    description: 'Can delete user accounts',
    roles: ['platform_admin'] as UserRole[],
  },
  ASSIGN_ROLES: {
    id: 'assign_roles',
    name: 'Assign Roles',
    description: 'Can assign roles to users',
    roles: ['platform_admin'] as UserRole[],
  },

  // Calculator Management
  VIEW_CALCULATORS: {
    id: 'view_calculators',
    name: 'View Calculators',
    description: 'Can view calculator configurations',
    roles: ['platform_admin', 'client_admin', 'user'] as UserRole[],
  },
  CREATE_CALCULATORS: {
    id: 'create_calculators',
    name: 'Create Calculators',
    description: 'Can create new calculator configurations',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  EDIT_CALCULATORS: {
    id: 'edit_calculators',
    name: 'Edit Calculators',
    description: 'Can modify calculator configurations',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  DELETE_CALCULATORS: {
    id: 'delete_calculators',
    name: 'Delete Calculators',
    description: 'Can delete calculator configurations',
    roles: ['platform_admin'] as UserRole[],
  },

  // Lead Management
  VIEW_LEADS: {
    id: 'view_leads',
    name: 'View Leads',
    description: 'Can view lead information',
    roles: ['platform_admin', 'client_admin', 'user'] as UserRole[],
  },
  EXPORT_LEADS: {
    id: 'export_leads',
    name: 'Export Leads',
    description: 'Can export lead data',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  DELETE_LEADS: {
    id: 'delete_leads',
    name: 'Delete Leads',
    description: 'Can delete lead records',
    roles: ['platform_admin'] as UserRole[],
  },

  // System Administration
  VIEW_ANALYTICS: {
    id: 'view_analytics',
    name: 'View Analytics',
    description: 'Can view system analytics and reports',
    roles: ['platform_admin', 'client_admin'] as UserRole[],
  },
  MANAGE_SETTINGS: {
    id: 'manage_settings',
    name: 'Manage Settings',
    description: 'Can modify system settings',
    roles: ['platform_admin'] as UserRole[],
  },
  VIEW_LOGS: {
    id: 'view_logs',
    name: 'View Logs',
    description: 'Can view system logs',
    roles: ['platform_admin'] as UserRole[],
  },
} as const;

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  platform_admin: 3,
  client_admin: 2,
  user: 1,
};

// Permission checking utilities
export function hasPermission(
  userRole: UserRole | null,
  permissionId: keyof typeof PERMISSIONS
): boolean {
  if (!userRole) return false;

  const permission = PERMISSIONS[permissionId];
  return permission.roles.includes(userRole);
}

export function hasRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;

  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];

  return userLevel >= requiredLevel;
}

export function getRolePermissions(role: UserRole): Permission[] {
  return Object.values(PERMISSIONS).filter(permission => permission.roles.includes(role));
}

export function getAllPermissions(): Permission[] {
  return Object.values(PERMISSIONS);
}

// Check if user can perform an action on a resource
export function canPerformAction(
  userRole: UserRole | null,
  action: string,
  resource: string,
  resourceOwnerId?: string,
  userId?: string
): boolean {
  if (!userRole) return false;

  // Platform admins can do everything
  if (userRole === 'platform_admin') return true;

  // Client admins can manage their own resources
  if (userRole === 'client_admin') {
    // Can manage users, calculators, and leads within their scope
    if (['view', 'create', 'edit'].includes(action)) return true;
    // Cannot delete or assign roles
    if (['delete', 'assign_roles'].includes(action)) return false;
  }

  // Regular users have limited permissions
  if (userRole === 'user') {
    // Can only view their own resources
    if (action === 'view' && resourceOwnerId === userId) return true;
    // Cannot perform any other actions
    return false;
  }

  return false;
}

// Get user's effective permissions based on their role
export function getUserEffectivePermissions(userRole: UserRole | null): {
  permissions: Permission[];
  roleLevel: number;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
} {
  if (!userRole) {
    return {
      permissions: [],
      roleLevel: 0,
      canManageUsers: false,
      canManageSystem: false,
      canViewAnalytics: false,
    };
  }

  const permissions = getRolePermissions(userRole);
  const roleLevel = ROLE_HIERARCHY[userRole];

  return {
    permissions,
    roleLevel,
    canManageUsers: hasPermission(userRole, 'CREATE_USERS'),
    canManageSystem: hasPermission(userRole, 'MANAGE_SETTINGS'),
    canViewAnalytics: hasPermission(userRole, 'VIEW_ANALYTICS'),
  };
}
