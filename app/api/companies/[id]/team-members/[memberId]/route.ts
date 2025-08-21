import { NextRequest, NextResponse } from 'next/server';
import { TeamService } from '../../../../../../src/lib/services/teamService';
import { updateTeamMemberSchema } from '../../../../../../src/lib/validations/team';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id, memberId } = params;

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid team member ID format' },
        { status: 400 }
      );
    }

    const teamMember = await TeamService.getTeamMemberById(memberId);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Verify the team member belongs to the specified company
    if (teamMember.company_id !== id) {
      return NextResponse.json(
        { success: false, error: 'Team member does not belong to this company' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: 'Team member fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id, memberId } = params;

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid team member ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = updateTeamMemberSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Verify the team member exists and belongs to the company
    const existingMember = await TeamService.getTeamMemberById(memberId);
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    if (existingMember.company_id !== id) {
      return NextResponse.json(
        { success: false, error: 'Team member does not belong to this company' },
        { status: 403 }
      );
    }

    const updatedMember = await TeamService.updateTeamMember(memberId, validationResult.data);

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully'
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { id, memberId } = params;

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid company ID format' },
        { status: 400 }
      );
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid team member ID format' },
        { status: 400 }
      );
    }

    // Verify the team member exists and belongs to the company
    const existingMember = await TeamService.getTeamMemberById(memberId);
    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    if (existingMember.company_id !== id) {
      return NextResponse.json(
        { success: false, error: 'Team member does not belong to this company' },
        { status: 403 }
      );
    }

    await TeamService.deleteTeamMember(memberId);

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
