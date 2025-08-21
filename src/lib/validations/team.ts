import { z } from 'zod';

// Team Role validation schemas
export const createTeamRoleSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string()).default([]),
  is_system_role: z.boolean().default(false),
});

export const updateTeamRoleSchema = createTeamRoleSchema.partial().omit({ company_id: true });

// Team Member validation schemas
export const createTeamMemberSchema = z.object({
  company_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role_id: z.string().uuid(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).default('pending'),
  permissions: z.array(z.string()).default([]),
  invited_by: z.string().uuid(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial().omit({ company_id: true, user_id: true });

// Team Invitation validation schemas
export const createTeamInvitationSchema = z.object({
  company_id: z.string().uuid(),
  email: z.string().email(),
  role_id: z.string().uuid(),
  invited_by: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'expired', 'cancelled']).default('pending'),
  expires_at: z.string().datetime().optional(), // Will be set to 7 days from now if not provided
});

export const updateTeamInvitationSchema = createTeamInvitationSchema.partial().omit({ company_id: true, email: true });

// Accept invitation schema
export const acceptInvitationSchema = z.object({
  invitation_token: z.string().min(1),
  user_id: z.string().uuid(),
});

// Search and filter schemas
export const teamMemberSearchSchema = z.object({
  company_id: z.string().uuid(),
  q: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).optional(),
  role_id: z.string().uuid().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const teamInvitationSearchSchema = z.object({
  company_id: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'expired', 'cancelled']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Export TypeScript types
export type CreateTeamRole = z.infer<typeof createTeamRoleSchema>;
export type UpdateTeamRole = z.infer<typeof updateTeamRoleSchema>;
export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;
export type CreateTeamInvitation = z.infer<typeof createTeamInvitationSchema>;
export type UpdateTeamInvitation = z.infer<typeof updateTeamInvitationSchema>;
export type AcceptInvitation = z.infer<typeof acceptInvitationSchema>;
export type TeamMemberSearch = z.infer<typeof teamMemberSearchSchema>;
export type TeamInvitationSearch = z.infer<typeof teamInvitationSearchSchema>;
