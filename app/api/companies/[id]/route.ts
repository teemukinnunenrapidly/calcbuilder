import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Company, ApiResponse } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/companies/[id] - Get a specific company
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get company by ID
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching company:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch company' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Company> = {
      success: true,
      data: company,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in GET /api/companies/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[id] - Update a company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check if company exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // If slug is being updated, check for uniqueness
    if (body.slug) {
      const { data: slugConflict } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: 'Company with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update company
    const { data: company, error } = await supabase
      .from('companies')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update company' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Company> = {
      success: true,
      data: company,
      message: 'Company updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in PUT /api/companies/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id] - Delete a company
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check if company exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Delete company (this will cascade to related tables due to foreign key constraints)
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete company' },
        { status: 500 }
      );
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Company deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in DELETE /api/companies/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
