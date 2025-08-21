import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate company ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // For now, we'll generate activity based on existing data
    // In the future, this should come from a dedicated activity/audit log table
    const activities: any[] = [];

    // Get recent team member additions
    const { data: recentMembers, error: membersError } = await supabase
      .from('team_members')
      .select(`
        id,
        created_at,
        status,
        team_roles!inner(name)
      `)
      .eq('company_id', id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!membersError && recentMembers) {
      recentMembers.forEach((member) => {
        activities.push({
          id: `member_${member.id}`,
          type: 'user_joined',
          description: `New team member joined with role: ${(member as any).team_roles?.name || 'Member'}`,
          timestamp: member.created_at,
          user: 'System',
          metadata: {
            memberId: member.id,
            role: (member as any).team_roles?.name
          }
        });
      });
    }

    // Get recent domain verification attempts
    const { data: recentDomains, error: domainsError } = await supabase
      .from('domain_verifications')
      .select('id, created_at, status, domain')
      .eq('company_id', id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!domainsError && recentDomains) {
      recentDomains.forEach((domain) => {
        if (domain.status === 'verified') {
          activities.push({
            id: `domain_${domain.id}`,
            type: 'domain_verified',
            description: `Domain ${domain.domain} verified successfully`,
            timestamp: domain.created_at,
            user: 'System',
            metadata: {
              domainId: domain.id,
              domain: domain.domain
            }
          });
        }
      });
    }

    // Get recent team invitations
    const { data: recentInvitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select('id, created_at, email, role_id, team_roles!inner(name)')
      .eq('company_id', id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!invitationsError && recentInvitations) {
      recentInvitations.forEach((invitation) => {
        activities.push({
          id: `invitation_${invitation.id}`,
          type: 'user_joined',
          description: `Team invitation sent to ${invitation.email} for role: ${invitation.team_roles?.name || 'Member'}`,
          timestamp: invitation.created_at,
          user: 'Admin',
          metadata: {
            invitationId: invitation.id,
            email: invitation.email,
            role: invitation.team_roles?.name
          }
        });
      });
    }

    // Sort activities by timestamp (newest first) and limit results
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    // If no real activities found, return demo data
    if (sortedActivities.length === 0) {
      const demoActivities = [
        {
          id: 'demo_1',
          type: 'user_joined',
          description: 'New team member joined',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'John Doe',
          metadata: {}
        },
        {
          id: 'demo_2',
          type: 'calculator_created',
          description: 'New calculator "Loan Calculator" created',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: 'Admin',
          metadata: {}
        },
        {
          id: 'demo_3',
          type: 'lead_generated',
          description: 'New lead from Loan Calculator',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: 'Anonymous',
          metadata: {}
        },
        {
          id: 'demo_4',
          type: 'settings_updated',
          description: 'Company branding updated',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin',
          metadata: {}
        }
      ];

      return NextResponse.json({
        success: true,
        data: {
          activity: demoActivities,
          timeRange,
          period: {
            start: startDate.toISOString(),
            end: now.toISOString()
          },
          note: 'Using demo data - real activity tracking will be implemented with dedicated activity table'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        activity: sortedActivities,
        timeRange,
        period: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching company activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
