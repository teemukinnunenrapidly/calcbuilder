# Domain Verification Setup for Company White-Labeling

This document explains how to set up domain verification functionality for company white-labeling in the E1saasto platform.

## Overview

The domain verification system allows companies to verify ownership of their custom domains for white-labeling purposes. This includes DNS verification, expiration handling, and comprehensive status tracking.

## Prerequisites

- Supabase project created and configured
- Database schema already set up (companies table exists)
- Domain verification schema created
- Authentication system configured

## Setup Steps

### 1. Create Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Run the complete schema from supabase/domain-verification-schema.sql
```

This creates:
- `domain_verifications` table with proper indexes
- RLS policies for security
- Helper functions for verification
- Additional fields in companies table

### 2. Verify Schema Creation

In your Supabase dashboard:

1. Go to **Table Editor**
2. Verify that `domain_verifications` table exists
3. Check that RLS is enabled
4. Verify policies are applied correctly
5. Check that companies table has new fields:
   - `domain_verification_id`
   - `domain_verification_status`
   - `domain_verified_at`

### 3. Test Domain Verification

Test the complete domain verification flow:

1. Navigate to `/company/domains` page
2. Enter a domain name (e.g., "example.com")
3. Click "Create Verification Request"
4. Verify the request is created in the database
5. Check DNS instructions are displayed
6. Test the verification process

## API Endpoints

### Create Domain Verification
```
POST /api/companies/{id}/domains
Content-Type: application/json
Body: {
  "domain": "example.com",
  "verification_type": "dns",
  "custom_domain_enabled": true,
  "white_label_enabled": true
}
```

### Get Domain Information
```
GET /api/companies/{id}/domains
```

### Update Domain Settings
```
PUT /api/companies/{id}/domains
Content-Type: application/json
Body: {
  "custom_domain_enabled": true,
  "white_label_enabled": true
}
```

### Verify Domain
```
POST /api/companies/{id}/domains/verify
```

## DNS Verification Process

### 1. Verification Request Creation
- Company submits domain for verification
- System generates unique verification token
- DNS records are prepared with token
- Verification request stored with 7-day expiration

### 2. DNS Record Setup
Company must add these DNS records:

**TXT Record:**
- Name: `example.com`
- Type: `TXT`
- Value: `calcbuilder-verification={token}`

**CNAME Record:**
- Name: `www.example.com`
- Type: `CNAME`
- Value: `calcbuilder.com`

### 3. Verification Process
- System checks DNS records for verification token
- Validates CNAME record points to calcbuilder.com
- Updates verification status based on results
- Tracks verification attempts and timestamps

## Security Features

- **Domain Validation**: Regex validation for domain format
- **Availability Check**: Prevents duplicate domain verification
- **Token Security**: Unique verification tokens for each request
- **Expiration Handling**: Automatic expiration after 7 days
- **RLS Policies**: Row-level security for company data isolation
- **Access Control**: Only company admins can manage domains

## Database Schema Details

### domain_verifications Table
```sql
CREATE TABLE domain_verifications (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  domain VARCHAR(255) NOT NULL,
  verification_token VARCHAR(255) UNIQUE NOT NULL,
  verification_type VARCHAR(20) DEFAULT 'dns',
  status VARCHAR(20) DEFAULT 'pending',
  dns_records JSONB,
  verification_attempts INTEGER DEFAULT 0,
  last_verification_attempt TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Companies Table Updates
```sql
-- New fields added to companies table
ALTER TABLE companies ADD COLUMN domain_verification_id UUID REFERENCES domain_verifications(id);
ALTER TABLE companies ADD COLUMN domain_verification_status VARCHAR(20) DEFAULT 'none';
ALTER TABLE companies ADD COLUMN domain_verified_at TIMESTAMP WITH TIME ZONE;
```

## Error Handling

### Common Issues

1. **Domain Already Verified**
   - Error: "Domain is already verified by another company"
   - Solution: Choose a different domain or contact support

2. **Verification Expired**
   - Error: "Domain verification has expired"
   - Solution: Create a new verification request

3. **DNS Records Not Found**
   - Error: "DNS verification failed"
   - Solution: Check DNS records and wait for propagation

4. **Invalid Domain Format**
   - Error: "Invalid request data"
   - Solution: Use valid domain format (e.g., "example.com")

### Debug Steps

1. Check Supabase logs for errors
2. Verify DNS records are correctly configured
3. Test DNS resolution manually
4. Check verification token matches exactly
5. Verify domain format and validation

## Maintenance

### Regular Tasks

- Monitor verification expiration dates
- Clean up expired verifications
- Review and update RLS policies
- Monitor verification success rates
- Update DNS verification logic as needed

### Performance Optimization

- Indexes on frequently queried fields
- Batch cleanup of expired verifications
- Caching of DNS resolution results
- Rate limiting for verification attempts

## Future Enhancements

- **File Verification**: Upload verification file to domain
- **Meta Tag Verification**: HTML meta tag verification
- **Bulk Domain Management**: Multiple domain verification
- **Domain Transfer**: Transfer verified domains between companies
- **Advanced DNS Validation**: Additional DNS record types
- **Automated Verification**: Scheduled verification checks
- **Domain Health Monitoring**: Continuous domain status monitoring

## Testing

### Manual Testing

1. **Create Verification Request**
   - Test with valid domain
   - Test with invalid domain format
   - Test with duplicate domain

2. **DNS Verification**
   - Test with correct DNS records
   - Test with missing DNS records
   - Test with expired verification

3. **Settings Updates**
   - Test domain settings updates
   - Test white-labeling toggle
   - Test subdomain support

### Automated Testing

- Unit tests for API endpoints
- Integration tests for database operations
- E2E tests for complete verification flow
- Performance tests for DNS resolution

## Troubleshooting

### DNS Resolution Issues

- Check network connectivity
- Verify DNS server configuration
- Test with different DNS providers
- Check for firewall restrictions

### Database Issues

- Verify RLS policies are correct
- Check foreign key constraints
- Verify indexes are created
- Check for permission issues

### API Issues

- Verify authentication headers
- Check request validation
- Verify response format
- Check error handling

## Support

For issues with domain verification:

1. Check this documentation
2. Review Supabase logs
3. Test DNS resolution manually
4. Contact development team
5. Check system status page
