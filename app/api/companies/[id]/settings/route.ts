import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Schema for company settings
const companySettingsSchema = z.object({
  timezone: z.string().min(1).max(50),
  locale: z.enum(['en', 'fi', 'sv', 'de', 'fr', 'es']).default('en'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK']).default('USD'),
  date_format: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY']).default('MM/DD/YYYY'),
  number_format: z.enum(['1,234.56', '1 234,56', '1.234,56']).default('1,234.56'),
  features: z.object({
    advanced_analytics: z.boolean().default(false),
    white_labeling: z.boolean().default(false),
    api_access: z.boolean().default(false),
    custom_integrations: z.boolean().default(false),
    multi_language: z.boolean().default(false),
    custom_branding: z.boolean().default(false),
  }).default({}),
  notification_settings: z.object({
    email_notifications: z.boolean().default(true),
    push_notifications: z.boolean().default(false),
    marketing_emails: z.boolean().default(false),
    security_alerts: z.boolean().default(true),
    weekly_reports: z.boolean().default(false),
    monthly_summaries: z.boolean().default(true),
  }).default({}),
  business_settings: z.object({
    company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
    industry: z.string().max(100).optional(),
    tax_id: z.string().max(50).optional(),
    billing_address: z.object({
      street: z.string().max(200).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
      postal_code: z.string().max(20).optional(),
      country: z.string().max(100).optional(),
    }).optional(),
  }).optional(),
});

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

    // Get company settings
    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, settings, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Parse settings or return defaults
    let settings = {};
    try {
      if (company.settings) {
        settings = typeof company.settings === 'string' 
          ? JSON.parse(company.settings) 
          : company.settings;
      }
    } catch (parseError) {
      console.error('Error parsing company settings:', parseError);
      settings = {};
    }

    return NextResponse.json({
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          created_at: company.created_at,
          updated_at: company.updated_at,
        },
        settings: settings
      }
    });

  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const validationResult = companySettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const validatedSettings = validationResult.data;

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

    // Update company settings
    const updateData = {
      settings: validatedSettings,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company settings:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name,
          updated_at: updatedCompany.updated_at,
        },
        settings: validatedSettings
      },
      message: 'Company settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    
    // Get current settings
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('id, name, settings')
      .eq('id', id)
      .single();

    if (fetchError || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Parse current settings
    let currentSettings = {};
    try {
      if (company.settings) {
        currentSettings = typeof company.settings === 'string' 
          ? JSON.parse(company.settings) 
          : company.settings;
      }
    } catch (parseError) {
      console.error('Error parsing current company settings:', parseError);
      currentSettings = {};
    }

    // Merge with new settings
    const mergedSettings = { ...currentSettings, ...body };

    // Validate merged settings
    const validationResult = companySettingsSchema.safeParse(mergedSettings);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data after merge', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const validatedSettings = validationResult.data;

    // Update company settings
    const updateData = {
      settings: validatedSettings,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company settings:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name,
          updated_at: updatedCompany.updated_at,
        },
        settings: validatedSettings
      },
      message: 'Company settings partially updated successfully'
    });

  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
