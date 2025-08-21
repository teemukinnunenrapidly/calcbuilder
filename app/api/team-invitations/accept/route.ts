import { NextRequest, NextResponse } from 'next/server';
import { TeamService } from '../../../../src/lib/services/teamService';
import { acceptInvitationSchema } from '../../../../src/lib/validations/team';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = acceptInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const teamMember = await TeamService.acceptInvitation(validationResult.data);

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: 'Team invitation accepted successfully'
    });

  } catch (error) {
    console.error('Error accepting team invitation:', error);

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
