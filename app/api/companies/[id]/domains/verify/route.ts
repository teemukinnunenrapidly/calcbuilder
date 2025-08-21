import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const supabase = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['SUPABASE_SERVICE_ROLE_KEY']!
);

const resolveDns = promisify(dns.resolve);

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

    // Get company and verification details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, domain, domain_verification_id')
      .eq('id', id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    if (!company.domain_verification_id) {
      return NextResponse.json(
        { success: false, error: 'No domain verification request found' },
        { status: 400 }
      );
    }

    // Get verification details
    const { data: verification, error: verificationError } = await supabase
      .from('domain_verifications')
      .select('*')
      .eq('id', company.domain_verification_id)
      .single();

    if (verificationError || !verification) {
      return NextResponse.json(
        { success: false, error: 'Domain verification not found' },
        { status: 404 }
      );
    }

    // Check if verification has expired
    if (new Date(verification.expires_at) < new Date()) {
      // Update verification status to expired
      await supabase
        .from('domain_verifications')
        .update({ 
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('id', verification.id);

      // Update company verification status
      await supabase
        .from('companies')
        .update({ 
          domain_verification_status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return NextResponse.json(
        { success: false, error: 'Domain verification has expired. Please create a new verification request.' },
        { status: 400 }
      );
    }

    // Verify DNS records
    const verificationResult = await verifyDomainDns(verification.domain, verification.verification_token);
    
    // Update verification status
    const updateData: any = {
      status: verificationResult.status,
      verification_attempts: verification.verification_attempts + 1,
      last_verification_attempt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (verificationResult.status === 'verified') {
      updateData.verified_at = new Date().toISOString();
      updateData.dns_records = verificationResult.dns_records;
    } else if (verificationResult.status === 'failed') {
      updateData.error_message = verificationResult.error_message;
      updateData.dns_records = verificationResult.dns_records;
    }

    const { error: updateError } = await supabase
      .from('domain_verifications')
      .update(updateData)
      .eq('id', verification.id);

    if (updateError) {
      console.error('Error updating verification status:', updateError);
    }

    // Update company verification status
    const companyUpdateData: any = {
      domain_verification_status: verificationResult.status,
      updated_at: new Date().toISOString(),
    };

    if (verificationResult.status === 'verified') {
      companyUpdateData.domain_verified_at = new Date().toISOString();
    }

    const { error: companyUpdateError } = await supabase
      .from('companies')
      .update(companyUpdateData)
      .eq('id', id);

    if (companyUpdateError) {
      console.error('Error updating company verification status:', companyUpdateError);
    }

    return NextResponse.json({
      success: true,
      data: {
        verification: verificationResult,
        company: {
          domain_verification_status: verificationResult.status,
          domain_verified_at: verificationResult.status === 'verified' ? new Date().toISOString() : null,
        }
      },
      message: verificationResult.status === 'verified' 
        ? 'Domain verification successful!' 
        : 'Domain verification failed. Please check your DNS records.'
    });

  } catch (error) {
    console.error('Error in domain verification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to verify domain DNS records
async function verifyDomainDns(domain: string, expectedToken: string) {
  try {
    // Check TXT record
    let txtRecords: string[] = [];
    try {
      const txtResult = await resolveDns(domain, 'TXT');
      txtRecords = txtResult.flat();
    } catch (error) {
      // TXT records might not exist
    }

    const verificationRecord = txtRecords.find(record => 
      record.includes(`calcbuilder-verification=${expectedToken}`)
    );

    // Check CNAME record
    let cnameRecords: string[] = [];
    try {
      const cnameResult = await resolveDns(`www.${domain}`, 'CNAME');
      cnameRecords = cnameResult;
    } catch (error) {
      // CNAME might not exist
    }

    const cnameRecord = cnameRecords.find(record => 
      record === 'calcbuilder.com'
    );

    // Determine verification status
    const isVerified = verificationRecord && cnameRecord;
    const status = isVerified ? 'verified' : 'failed';

    // Prepare DNS records with status
    const dnsRecords = [
      {
        type: 'TXT',
        name: domain,
        value: verificationRecord || 'Not found',
        status: verificationRecord ? 'found' : 'missing',
      },
      {
        type: 'CNAME',
        name: `www.${domain}`,
        value: cnameRecord || 'Not found',
        status: cnameRecord ? 'found' : 'missing',
      }
    ];

    return {
      domain,
      status,
      verification_type: 'dns',
      verified_at: isVerified ? new Date().toISOString() : null,
      error_message: isVerified ? null : 'DNS records not found or incorrect',
      dns_records: dnsRecords,
    };

  } catch (error) {
    console.error('DNS verification error:', error);
    return {
      domain,
      status: 'failed' as const,
      verification_type: 'dns',
      verified_at: null,
      error_message: 'Failed to resolve DNS records',
      dns_records: [
        {
          type: 'TXT',
          name: domain,
          value: 'Error resolving DNS',
          status: 'missing',
        },
        {
          type: 'CNAME',
          name: `www.${domain}`,
          value: 'Error resolving DNS',
          status: 'missing',
        }
      ],
    };
  }
}
