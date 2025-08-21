import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Company, ApiResponse } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/companies - List all companies (with pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get companies with pagination
    const { data: companies, error, count } = await supabase
      .from('companies')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch companies' },
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
    console.error('Unexpected error in GET /api/companies:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, domain, logo_url, brand_colors, settings } = body;

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company with this slug already exists' },
        { status: 409 }
      );
    }

    // Create company
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        name,
        slug,
        domain,
        logo_url,
        brand_colors: brand_colors || {},
        settings: settings || {},
        subscription_tier: 'free',
        subscription_status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create company' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Company> = {
      success: true,
      data: company,
      message: 'Company created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/companies:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
