// Export authentication context and hooks
export { AuthProvider, useAuth, useIsAuthenticated, useUserRole } from '../../contexts/AuthContext';

// Export user profile hook
export { useUserProfile, type UserProfile } from '../../hooks/use-user-profile';

// Export session management utilities
export { SessionManager, sessionUtils } from './session-manager';

// Export protected route components
export { ProtectedRoute, withAuth, useRoutePermission } from '../../components/auth/ProtectedRoute';

// Export Supabase client functions
export { createClient, createServerSupabaseClient, createServiceRoleClient } from '../supabase';

// Export Resend email functions
export {
  resend,
  sendEmail,
  sendTestEmail,
  authEmailTemplates,
  type EmailTemplate,
} from '../resend';
