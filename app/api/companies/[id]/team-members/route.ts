import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Schema for team member creation
const teamMemberCreateSchema = z.object({
  email: z.string().email(),
  role_id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  permissions: z.array(z.string()).optional(),
});

// Schema for team member update
const teamMemberUpdateSchema = z.object({
  role_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  permissions: z.array(z.string()).optional(),
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

    // Get team members for the company
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select(`
        id,
        company_id,
        user_id,
        role_id,
        status,
        permissions,
        joined_at,
        updated_at,
        users (
          id,
          email,
          first_name,
          last_name,
          avatar_url
        ),
        team_roles (
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('company_id', id)
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Error fetching team members:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMembers || []
    });

  } catch (error) {
    console.error('Error in team members GET:', error);
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
    const validationResult = teamMemberCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, role_id, first_name, last_name, permissions } = validationResult.data;

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

    // Check if user already exists
    let user = null;
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error('Error checking existing user:', userError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing user' },
        { status: 500 }
      );
    }

    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email,
          first_name,
          last_name,
          email_verified: false,
        })
        .select()
        .single();

      if (createUserError) {
        console.error('Error creating user:', createUserError);
        return NextResponse.json(
          { success: false, error: 'Failed to create user' },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // Check if user is already a team member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('team_members')
      .select('id')
      .eq('company_id', id)
      .eq('user_id', user.id)
      .single();

    if (memberCheckError && memberCheckError.code !== 'PGRST116') {
      console.error('Error checking existing team member:', memberCheckError);
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

    // Create team member
    const { data: teamMember, error: createMemberError } = await supabase
      .from('team_members')
      .insert({
        company_id: id,
        user_id: user.id,
        role_id,
        status: 'active',
        permissions: permissions || [],
        joined_at: new Date().toISOString(),
      })
      .select(`
        id,
        company_id,
        user_id,
        role_id,
        status,
        permissions,
        joined_at,
        users (
          id,
          email,
          first_name,
          last_name
        ),
        team_roles (
          id,
          name,
          description
        )
      `)
      .single();

    if (createMemberError) {
      console.error('Error creating team member:', createMemberError);
      return NextResponse.json(
        { success: false, error: 'Failed to create team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: 'Team member added successfully'
    });

  } catch (error) {
    console.error('Error in team members POST:', error);
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
    const validationResult = teamMemberUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { role_id, status, permissions } = validationResult.data;

    // Get team member ID from query params
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id');

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if team member exists and belongs to the company
    const { data: existingMember, error: memberError } = await supabase
      .from('team_members')
      .select('id, company_id, user_id')
      .eq('id', memberId)
      .eq('company_id', id)
      .single();

    if (memberError || !existingMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Update team member
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (role_id) updateData.role_id = role_id;
    if (status) updateData.status = status;
    if (permissions) updateData.permissions = permissions;

    const { data: updatedMember, error: updateError } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', memberId)
      .select(`
        id,
        company_id,
        user_id,
        role_id,
        status,
        permissions,
        updated_at,
        users (
          id,
          email,
          first_name,
          last_name
        ),
        team_roles (
          id,
          name,
          description
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating team member:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully'
    });

  } catch (error) {
    console.error('Error in team members PUT:', error);
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

    // Get team member ID from query params
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id');

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if team member exists and belongs to the company
    const { data: existingMember, error: memberError } = await supabase
      .from('team_members')
      .select('id, company_id, user_id')
      .eq('id', memberId)
      .eq('company_id', id)
      .single();

    if (memberError || !existingMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete team member
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      console.error('Error deleting team member:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Error in team members DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
