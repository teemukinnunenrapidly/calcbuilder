import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Schema for team invitation creation
const teamInvitationCreateSchema = z.object({
  email: z.string().email(),
  role_id: z.string().uuid(),
  message: z.string().max(500).optional(),
  expires_at: z.string().datetime().optional(),
});

// Schema for team invitation update
const teamInvitationUpdateSchema = z.object({
  role_id: z.string().uuid().optional(),
  message: z.string().max(500).optional(),
  expires_at: z.string().datetime().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    // Get team invitations for the company
    const { data: invitations, error } = await supabase
      .from('team_invitations')
      .select(`
        id,
        company_id,
        email,
        role_id,
        status,
        message,
        invited_by_user_id,
        expires_at,
        created_at,
        updated_at,
        team_roles (
          id,
          name,
          description
        ),
        users!team_invitations_invited_by_user_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('company_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team invitations:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch team invitations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitations || []
    });

  } catch (error) {
    console.error('Error in team invitations GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = teamInvitationCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, role_id, message, expires_at } = validationResult.data;

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if role exists
    const { data: role, error: roleError } = await supabase
      .from('team_roles')
      .select('id, name')
      .eq('id', role_id)
      .eq('company_id', id)
      .single();

    if (roleError || !role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if user is already a team member
    const { data: existingMember, error: memberError } = await supabase
      .from('team_members')
      .select('id')
      .eq('company_id', id)
      .eq('users.email', email)
      .single();

    if (memberError && memberError.code !== 'PGRST116') {
      console.error('Error checking existing team member:', memberError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing team member' },
        { status: 500 }
      );
    }

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'User is already a team member' },
        { status: 409 }
      );
    }

    // Check if invitation already exists
    const { data: existingInvitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select('id, status')
      .eq('company_id', id)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (invitationError && invitationError.code !== 'PGRST116') {
      console.error('Error checking existing invitation:', invitationError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing invitation' },
        { status: 500 }
      );
    }

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation already exists for this email' },
        { status: 409 }
      );
    }

    // Get current user ID (invited by)
    // For now, we'll use a placeholder - in production this would come from auth context
    const invitedByUserId = '00000000-0000-0000-0000-000000000000'; // Placeholder

    // Create team invitation
    const invitationData = {
      company_id: id,
      email,
      role_id,
      status: 'pending',
      message: message || '',
      invited_by_user_id: invitedByUserId,
      expires_at: expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
    };

    const { data: invitation, error: createError } = await supabase
      .from('team_invitations')
      .insert(invitationData)
      .select(`
        id,
        company_id,
        email,
        role_id,
        status,
        message,
        invited_by_user_id,
        expires_at,
        created_at,
        team_roles (
          id,
          name,
          description
        )
      `)
      .single();

    if (createError) {
      console.error('Error creating team invitation:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create team invitation' },
        { status: 500 }
      );
    }

    // TODO: Send invitation email
    // This would integrate with your email service (Resend, etc.)

    return NextResponse.json({
      success: true,
      data: invitation,
      message: 'Team invitation created successfully'
    });

  } catch (error) {
    console.error('Error in team invitations POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = teamInvitationUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { role_id, message, expires_at } = validationResult.data;

    // Get invitation ID from query params
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Check if invitation exists and belongs to the company
    const { data: existingInvitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select('id, company_id, status')
      .eq('id', invitationId)
      .eq('company_id', id)
      .single();

    if (invitationError || !existingInvitation) {
      return NextResponse.json(
        { success: false, error: 'Team invitation not found' },
        { status: 404 }
      );
    }

    // Only allow updates to pending invitations
    if (existingInvitation.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Cannot update non-pending invitation' },
        { status: 400 }
      );
    }

    // Update invitation
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (role_id) updateData.role_id = role_id;
    if (message !== undefined) updateData.message = message;
    if (expires_at) updateData.expires_at = expires_at;

    const { data: updatedInvitation, error: updateError } = await supabase
      .from('team_invitations')
      .update(updateData)
      .eq('id', invitationId)
      .select(`
        id,
        company_id,
        email,
        role_id,
        status,
        message,
        invited_by_user_id,
        expires_at,
        updated_at,
        team_roles (
          id,
          name,
          description
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating team invitation:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update team invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedInvitation,
      message: 'Team invitation updated successfully'
    });

  } catch (error) {
    console.error('Error in team invitations PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    // Get invitation ID from query params
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Check if invitation exists and belongs to the company
    const { data: existingInvitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select('id, company_id, status')
      .eq('id', invitationId)
      .eq('company_id', id)
      .single();

    if (invitationError || !existingInvitation) {
      return NextResponse.json(
        { success: false, error: 'Team invitation not found' },
        { status: 404 }
      );
    }

    // Delete invitation
    const { error: deleteError } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', invitationId);

    if (deleteError) {
      console.error('Error deleting team invitation:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete team invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Team invitation deleted successfully'
    });

  } catch (error) {
    console.error('Error in team invitations DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
