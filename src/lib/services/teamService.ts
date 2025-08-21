import { createClient } from '@supabase/supabase-js';
import {
  TeamRole,
  TeamMember,
  TeamInvitation,
  TeamPermission
} from '../../types';
import {
  TeamMemberSearch,
  TeamInvitationSearch,
  CreateTeamRole,
  UpdateTeamRole,
  CreateTeamMember,
  UpdateTeamMember,
  CreateTeamInvitation,
  UpdateTeamInvitation,
  AcceptInvitation,
  createTeamRoleSchema,
  updateTeamRoleSchema,
  createTeamMemberSchema,
  updateTeamMemberSchema,
  createTeamInvitationSchema,
  updateTeamInvitationSchema,
  acceptInvitationSchema
} from '../validations/team';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

export class TeamService {
  // Team Roles
  static async getTeamRoles(companyId: string): Promise<TeamRole[]> {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team roles:', error);
      throw error;
    }
  }

  static async getTeamRoleById(id: string): Promise<TeamRole | null> {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team role:', error);
      throw error;
    }
  }

  static async createTeamRole(roleData: CreateTeamRole): Promise<TeamRole> {
    try {
      const validatedData = createTeamRoleSchema.parse(roleData);

      const { data, error } = await supabase
        .from('team_roles')
        .insert(validatedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating team role:', error);
      throw error;
    }
  }

  static async updateTeamRole(id: string, roleData: UpdateTeamRole): Promise<TeamRole> {
    try {
      const validatedData = updateTeamRoleSchema.parse(roleData);

      const { data, error } = await supabase
        .from('team_roles')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating team role:', error);
      throw error;
    }
  }

  static async deleteTeamRole(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting team role:', error);
      throw error;
    }
  }

  // Team Members
  static async getTeamMembers(searchParams: TeamMemberSearch): Promise<{ data: TeamMember[], total: number }> {
    try {
      let query = supabase
        .from('team_members')
        .select(`
          *,
          user:users(id, email, first_name, last_name, avatar_url),
          role:team_roles(id, name, description, permissions),
          invited_by_user:users!team_members_invited_by_fkey(id, email, first_name, last_name)
        `, { count: 'exact' })
        .eq('company_id', searchParams.company_id);

      // Apply filters
      if (searchParams.status) {
        query = query.eq('status', searchParams.status);
      }
      if (searchParams.role_id) {
        query = query.eq('role_id', searchParams.role_id);
      }
      if (searchParams.q) {
        query = query.or(`user.email.ilike.%${searchParams.q}%,user.first_name.ilike.%${searchParams.q}%,user.last_name.ilike.%${searchParams.q}%`);
      }

      // Apply pagination
      const offset = (searchParams.page - 1) * searchParams.limit;
      query = query.range(offset, offset + searchParams.limit - 1);

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  static async getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:users(id, email, first_name, last_name, avatar_url),
          role:team_roles(id, name, description, permissions),
          invited_by_user:users!team_members_invited_by_fkey(id, email, first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  }

  static async createTeamMember(memberData: CreateTeamMember): Promise<TeamMember> {
    try {
      const validatedData = createTeamMemberSchema.parse(memberData);

      const { data, error } = await supabase
        .from('team_members')
        .insert(validatedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  static async updateTeamMember(id: string, memberData: UpdateTeamMember): Promise<TeamMember> {
    try {
      const validatedData = updateTeamMemberSchema.parse(memberData);

      const { data, error } = await supabase
        .from('team_members')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  static async deleteTeamMember(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  // Team Invitations
  static async getTeamInvitations(searchParams: TeamInvitationSearch): Promise<{ data: TeamInvitation[], total: number }> {
    try {
      let query = supabase
        .from('team_invitations')
        .select(`
          *,
          role:team_roles(id, name, description),
          invited_by_user:users!team_invitations_invited_by_fkey(id, email, first_name, last_name)
        `, { count: 'exact' })
        .eq('company_id', searchParams.company_id);

      // Apply filters
      if (searchParams.status) {
        query = query.eq('status', searchParams.status);
      }

      // Apply pagination
      const offset = (searchParams.page - 1) * searchParams.limit;
      query = query.range(offset, offset + searchParams.limit - 1);

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching team invitations:', error);
      throw error;
    }
  }

  static async createTeamInvitation(invitationData: CreateTeamInvitation): Promise<TeamInvitation> {
    try {
      const validatedData = createTeamInvitationSchema.parse(invitationData);

      // Generate invitation token
      const invitationToken = crypto.randomUUID();

      // Set expiration to 7 days from now if not provided
      const expiresAt = validatedData.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          ...validatedData,
          invitation_token: invitationToken,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating team invitation:', error);
      throw error;
    }
  }

  static async updateTeamInvitation(id: string, invitationData: UpdateTeamInvitation): Promise<TeamInvitation> {
    try {
      const validatedData = updateTeamInvitationSchema.parse(invitationData);

      const { data, error } = await supabase
        .from('team_invitations')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating team invitation:', error);
      throw error;
    }
  }

  static async acceptInvitation(acceptData: AcceptInvitation): Promise<TeamMember> {
    try {
      const validatedData = acceptInvitationSchema.parse(acceptData);

      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invitation_token', validatedData.invitation_token)
        .eq('status', 'pending')
        .single();

      if (invitationError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Check if invitation has expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Create team member
      const teamMember = await this.createTeamMember({
        company_id: invitation.company_id,
        user_id: validatedData.user_id,
        role_id: invitation.role_id,
        status: 'active',
        invited_by: invitation.invited_by,
      });

      // Update invitation status
      await this.updateTeamInvitation(invitation.id, {
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      });

      return teamMember;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  // Team Permissions
  static async getTeamPermissions(): Promise<TeamPermission[]> {
    try {
      const { data, error } = await supabase
        .from('team_permissions')
        .select('*')
        .order('category, resource, action');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team permissions:', error);
      throw error;
    }
  }

  // Utility methods
  static async getUserPermissions(userId: string, companyId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          permissions,
          role:team_roles(permissions)
        `)
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('status', 'active')
        .single();

      if (error || !data) return [];

      const userPermissions = data.permissions || [];
      const rolePermissions = data.role?.permissions || [];

      return [...new Set([...userPermissions, ...rolePermissions])];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  static async hasPermission(userId: string, companyId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, companyId);
    return permissions.includes(permission) || permissions.includes('*');
  }
}
