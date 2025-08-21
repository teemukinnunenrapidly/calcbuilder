import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Schema for branding update
const brandingUpdateSchema = z.object({
  logo_url: z.string().url().optional(),
  brand_colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    background: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    foreground: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    muted: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    border: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }).optional(),
});

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
    const validationResult = brandingUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { logo_url, brand_colors } = validationResult.data;

    // Check if company exists
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('id, brand_colors')
      .eq('id', id)
      .single();

    if (fetchError || !existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (logo_url !== undefined) {
      updateData.logo_url = logo_url;
    }

    if (brand_colors) {
      // Merge existing brand colors with new ones
      const currentBrandColors = existingCompany.brand_colors || {};
      updateData.brand_colors = { ...currentBrandColors, ...brand_colors };
    }

    // Update company branding
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company branding:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company branding' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Company branding updated successfully'
    });

  } catch (error) {
    console.error('Error in branding update:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get company branding info
    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, logo_url, brand_colors')
      .eq('id', id)
      .single();

    if (error || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        logo_url: company.logo_url,
        brand_colors: company.brand_colors || {}
      }
    });

  } catch (error) {
    console.error('Error fetching company branding:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
