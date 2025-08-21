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
      .select('id, name, domain, domain_verification_status')
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

    // Get team members count
    const { count: totalUsers, error: usersError } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', id)
      .eq('status', 'active');

    if (usersError) {
      console.error('Error fetching team members:', usersError);
    }

    // Get active users (team members who have been active in the time range)
    // For now, we'll use a simple approach - count all active members
    const activeUsers = totalUsers || 0;

    // Get total calculators count (placeholder - will be implemented when calculator system is ready)
    const totalCalculators = 0; // TODO: Implement when calculator system is ready

    // Get total leads count (placeholder - will be implemented when lead system is ready)
    const totalLeads = 0; // TODO: Implement when lead system is ready

    // Calculate conversion rate (placeholder)
    const conversionRate = 0; // TODO: Implement when lead system is ready

    // Calculate average session duration (placeholder)
    const averageSessionDuration = 0; // TODO: Implement when analytics system is ready

    // Calculate monthly growth (placeholder)
    const monthlyGrowth = 0; // TODO: Implement when analytics system is ready

    // Get domain verification status
    const domainVerificationStatus = company.domain_verification_status || 'pending';

    // Get last activity (placeholder - will be implemented when activity tracking is ready)
    const lastActivity = new Date().toISOString();

    // Calculate storage usage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('company-assets')
      .list('', {
        limit: 1000,
        search: id
      });

    let storageUsage = 0;
    if (!storageError && storageData) {
      storageUsage = storageData.reduce((total, file) => total + ((file.metadata as any)?.['size'] || 0), 0);
    }

    // Storage limit (50MB)
    const storageLimit = 52428800;

    // Get recent activity count
    const { count: recentActivityCount, error: activityError } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', id)
      .gte('created_at', startDate.toISOString());

    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
    }

    const metrics = {
      totalUsers: totalUsers || 0,
      activeUsers,
      totalCalculators,
      totalLeads,
      conversionRate,
      averageSessionDuration,
      monthlyGrowth,
      domainVerificationStatus,
      lastActivity,
      storageUsage,
      storageLimit,
      recentActivityCount: recentActivityCount || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        timeRange,
        period: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching company metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
