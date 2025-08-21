import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Company, ApiResponse } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/companies/search - Search and filter companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build the query
    let supabaseQuery = supabase
      .from('companies')
      .select('*', { count: 'exact' });

    // Add search filter
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,slug.ilike.%${query}%,domain.ilike.%${query}%`
      );
    }

    // Add status filter
    if (status) {
      supabaseQuery = supabaseQuery.eq('subscription_status', status);
    }

    // Add tier filter
    if (tier) {
      supabaseQuery = supabaseQuery.eq('subscription_tier', tier);
    }

    // Add pagination and ordering
    const { data: companies, error, count } = await supabaseQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching companies:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to search companies' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);
    const response: ApiResponse<Company[]> = {
      success: true,
      data: companies || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in GET /api/companies/search:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
