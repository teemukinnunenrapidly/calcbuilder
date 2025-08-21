import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

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

    // Check if company exists
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', id)
      .single();

    if (fetchError || !existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get form data with file
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No logo file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload logo' },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('company-assets')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update company with new logo URL
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        logo_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, logo_url')
      .single();

    if (updateError) {
      console.error('Error updating company logo:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company logo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        logo_url: publicUrl,
        message: 'Logo uploaded successfully'
      }
    });

  } catch (error) {
    console.error('Error in logo upload:', error);
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

    // Get current logo URL
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('logo_url')
      .eq('id', id)
      .single();

    if (fetchError || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    if (!company.logo_url) {
      return NextResponse.json(
        { success: false, error: 'No logo to delete' },
        { status: 400 }
      );
    }

    // Extract file path from URL
    const urlParts = company.logo_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `company-logos/${fileName}`;

    // Delete file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('company-assets')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting logo file:', deleteError);
      // Continue with database update even if file deletion fails
    }

    // Update company to remove logo URL
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        logo_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, logo_url')
      .single();

    if (updateError) {
      console.error('Error updating company logo:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company logo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        logo_url: null,
        message: 'Logo deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error in logo deletion:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
