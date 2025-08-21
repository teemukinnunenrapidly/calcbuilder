import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Supported asset types and their configurations
const ASSET_TYPES = {
  logo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'company-logos'
  },
  banner: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'company-banners'
  },
  icon: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/png', 'image/svg+xml'],
    folder: 'company-icons'
  },
  document: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    folder: 'company-documents'
  },
  image: {
    maxSize: 15 * 1024 * 1024, // 15MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'company-images'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    // List assets from Supabase Storage
    let assets = [];
    
    if (type && ASSET_TYPES[type as keyof typeof ASSET_TYPES]) {
      // Get assets of specific type
      const { data: storageData, error: storageError } = await supabase.storage
        .from('company-assets')
        .list(ASSET_TYPES[type as keyof typeof ASSET_TYPES].folder, {
          limit: limit,
          search: id
        });

      if (!storageError && storageData) {
        assets = storageData.map(file => ({
          id: file.id,
          name: file.name,
          type: type,
          size: file.metadata?.size || 0,
          mime_type: file.metadata?.mimetype || '',
          created_at: file.created_at,
          updated_at: file.updated_at,
          url: supabase.storage
            .from('company-assets')
            .getPublicUrl(`${ASSET_TYPES[type as keyof typeof ASSET_TYPES].folder}/${file.name}`).data.publicUrl
        }));
      }
    } else {
      // Get all assets for the company
      const allAssets = [];
      
      for (const [assetType, config] of Object.entries(ASSET_TYPES)) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('company-assets')
          .list(config.folder, {
            limit: limit,
            search: id
          });

        if (!storageError && storageData) {
          const typeAssets = storageData.map(file => ({
            id: file.id,
            name: file.name,
            type: assetType,
            size: file.metadata?.size || 0,
            mime_type: file.metadata?.mimetype || '',
            created_at: file.created_at,
            updated_at: file.updated_at,
            url: supabase.storage
              .from('company-assets')
              .getPublicUrl(`${config.folder}/${file.name}`).data.publicUrl
          }));
          allAssets.push(...typeAssets);
        }
      }
      
      assets = allAssets;
    }

    // Sort by creation date (newest first)
    assets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: {
        assets,
        company: {
          id: company.id,
          name: company.name
        },
        total: assets.length,
        type: type || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching company assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    // Get form data with file and metadata
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assetType = formData.get('type') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!assetType || !ASSET_TYPES[assetType as keyof typeof ASSET_TYPES]) {
      return NextResponse.json(
        { error: 'Invalid asset type' },
        { status: 400 }
      );
    }

    const config = ASSET_TYPES[assetType as keyof typeof ASSET_TYPES];

    // Validate file type
    if (!config.allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > config.maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${Math.round(config.maxSize / (1024 * 1024))}MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${config.folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          company_id: id,
          asset_type: assetType,
          description: description || '',
          original_name: file.name
        }
      });

    if (uploadError) {
      console.error('Error uploading asset:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload asset' },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('company-assets')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Create asset record in database (optional - for better tracking)
    const { data: assetRecord, error: recordError } = await supabase
      .from('company_assets')
      .insert({
        company_id: id,
        file_path: filePath,
        file_name: file.name,
        asset_type: assetType,
        description: description || '',
        file_size: file.size,
        mime_type: file.type,
        url: publicUrl
      })
      .select()
      .single();

    if (recordError) {
      console.warn('Warning: Could not create asset record:', recordError);
      // Continue anyway - the file is uploaded successfully
    }

    return NextResponse.json({
      success: true,
      data: {
        asset: {
          id: assetRecord?.id || uploadData.id,
          name: file.name,
          type: assetType,
          size: file.size,
          mime_type: file.type,
          url: publicUrl,
          description: description || '',
          created_at: new Date().toISOString()
        },
        message: 'Asset uploaded successfully'
      }
    });

  } catch (error) {
    console.error('Error uploading asset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

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

    // Delete file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('company-assets')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting asset:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete asset' },
        { status: 500 }
      );
    }

    // Delete asset record from database if it exists
    const { error: recordDeleteError } = await supabase
      .from('company_assets')
      .delete()
      .eq('company_id', id)
      .eq('file_path', filePath);

    if (recordDeleteError) {
      console.warn('Warning: Could not delete asset record:', recordDeleteError);
      // Continue anyway - the file is deleted successfully
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Asset deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
