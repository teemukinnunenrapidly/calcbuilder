import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

// Schema for domain verification request
const domainVerificationSchema = z.object({
  domain: z.string().min(1).max(255).regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/),
  verification_type: z.enum(['dns', 'file', 'meta']).default('dns'),
  custom_domain_enabled: z.boolean().optional(),
  subdomain_enabled: z.boolean().optional(),
  white_label_enabled: z.boolean().optional(),
});

// Schema for domain verification status
const domainVerificationStatusSchema = z.object({
  domain: z.string(),
  status: z.enum(['pending', 'verified', 'failed', 'expired']),
  verification_type: z.enum(['dns', 'file', 'meta']),
  verified_at: z.string().optional(),
  error_message: z.string().optional(),
  dns_records: z.array(z.object({
    type: z.string(),
    name: z.string(),
    value: z.string(),
    status: z.enum(['found', 'missing', 'incorrect']),
  })).optional(),
});

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

    const body = await request.json();
    
    // Validate request body
    const validationResult = domainVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { domain, verification_type, custom_domain_enabled, subdomain_enabled, white_label_enabled } = validationResult.data;

    // Check if company exists
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('id, domain, custom_domain_enabled, subdomain_enabled, white_label_enabled')
      .eq('id', id)
      .single();

    if (fetchError || !existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if domain is already verified for this company
    if (existingCompany.domain === domain && existingCompany.custom_domain_enabled) {
      return NextResponse.json(
        { success: false, error: 'Domain is already verified for this company' },
        { status: 409 }
      );
    }

    // Check if domain is available (not verified by another company)
    const { data: domainAvailability, error: availabilityError } = await supabase
      .rpc('is_domain_available', { domain_name: domain, company_id: id });

    if (availabilityError || !domainAvailability) {
      return NextResponse.json(
        { success: false, error: 'Domain is already verified by another company' },
        { status: 409 }
      );
    }

    // Generate verification token using database function
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_verification_token');

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate verification token' },
        { status: 500 }
      );
    }

    const verificationToken = tokenData;
    
    // Prepare DNS verification records
    const dnsRecords = [
      {
        type: 'TXT',
        name: domain,
        value: `calcbuilder-verification=${verificationToken}`,
        expected: `calcbuilder-verification=${verificationToken}`,
      },
      {
        type: 'CNAME',
        name: `www.${domain}`,
        value: 'calcbuilder.com',
        expected: 'calcbuilder.com',
      }
    ];

    // Create domain verification record
    const verificationData = {
      company_id: id,
      domain: domain,
      verification_token: verificationToken,
      verification_type: verification_type,
      status: 'pending',
      dns_records: dnsRecords,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const { data: newVerification, error: verificationError } = await supabase
      .from('domain_verifications')
      .insert(verificationData)
      .select()
      .single();

    if (verificationError) {
      console.error('Error creating domain verification:', verificationError);
      return NextResponse.json(
        { success: false, error: 'Failed to create domain verification' },
        { status: 500 }
      );
    }

    // Update company with domain settings and verification reference
    const updateData: any = {
      domain: domain,
      custom_domain_enabled: custom_domain_enabled ?? false,
      subdomain_enabled: subdomain_enabled ?? false,
      white_label_enabled: white_label_enabled ?? false,
      domain_verification_id: newVerification.id,
      domain_verification_status: 'pending',
      updated_at: new Date().toISOString(),
    };

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company domain:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company domain' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        company: updatedCompany,
        verification: {
          id: newVerification.id,
          token: verificationToken,
          dns_records: dnsRecords,
          instructions: generateDnsInstructions(domain, verificationToken),
          expires_at: newVerification.expires_at,
        }
      },
      message: 'Domain verification request created successfully'
    });

  } catch (error) {
    console.error('Error in domain verification:', error);
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

    // Get company domain information
    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, domain, custom_domain_enabled, subdomain_enabled, white_label_enabled, domain_verification_id, domain_verification_status, domain_verified_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get domain verification details if verification exists
    let verificationStatus = null;
    if (company.domain_verification_id) {
      const { data: verification, error: verificationError } = await supabase
        .from('domain_verifications')
        .select('*')
        .eq('id', company.domain_verification_id)
        .single();

      if (!verificationError && verification) {
        verificationStatus = {
          domain: verification.domain,
          status: verification.status,
          verification_type: verification.verification_type,
          verified_at: verification.verified_at,
          error_message: verification.error_message,
          dns_records: verification.dns_records,
          expires_at: verification.expires_at,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        company: company,
        verification: verificationStatus
      }
    });

  } catch (error) {
    console.error('Error fetching company domain:', error);
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
    const validationResult = domainVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { domain, verification_type, custom_domain_enabled, subdomain_enabled, white_label_enabled } = validationResult.data;

    // Check if company exists
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('id, domain, domain_verification_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // If domain is different, create new verification
    if (domain !== existingCompany.domain) {
      // Check if domain is available
      const { data: domainAvailability, error: availabilityError } = await supabase
        .rpc('is_domain_available', { domain_name: domain, company_id: id });

      if (availabilityError || !domainAvailability) {
        return NextResponse.json(
          { success: false, error: 'Domain is already verified by another company' },
          { status: 409 }
        );
      }

      // Create new verification request
      const response = await POST(request, { params });
      if (!response.ok) {
        return response;
      }
    }

    // Update company domain settings
    const updateData: any = {
      custom_domain_enabled: custom_domain_enabled ?? false,
      subdomain_enabled: subdomain_enabled ?? false,
      white_label_enabled: white_label_enabled ?? false,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company domain settings:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update company domain settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Company domain settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating company domain settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate DNS instructions
function generateDnsInstructions(domain: string, token: string): string[] {
  return [
    `Add the following TXT record to your domain ${domain}:`,
    `Name: ${domain}`,
    `Type: TXT`,
    `Value: calcbuilder-verification=${token}`,
    '',
    `Add the following CNAME record:`,
    `Name: www.${domain}`,
    `Type: CNAME`,
    `Value: calcbuilder.com`,
    '',
    `After adding these records, wait a few minutes for DNS propagation and then verify your domain.`,
    `Note: Verification expires in 7 days.`
  ];
}
