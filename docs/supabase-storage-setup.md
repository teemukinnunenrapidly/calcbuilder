# Supabase Storage Setup for Company Assets

This document explains how to set up Supabase Storage for company logos and other assets in the E1saasto platform.

## Overview

The platform uses Supabase Storage to store company logos and other branding assets. Each company can upload and manage their own assets securely.

## Prerequisites

- Supabase project created and configured
- Database schema already set up (companies table exists)
- Authentication system configured

## Setup Steps

### 1. Create Storage Bucket

Run the following SQL in your Supabase SQL editor:

```sql
-- Create storage bucket for company assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-assets',
  'company-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

### 2. Set Up RLS Policies

Run the complete SQL script from `supabase/storage-setup.sql` in your Supabase SQL editor. This script:

- Creates the storage bucket
- Sets up Row Level Security (RLS) policies
- Creates helper functions for company access control
- Grants necessary permissions

### 3. Verify Storage Configuration

In your Supabase dashboard:

1. Go to **Storage** section
2. Verify that `company-assets` bucket exists
3. Check that RLS is enabled
4. Verify policies are applied correctly

### 4. Test File Upload

Test the logo upload functionality:

1. Navigate to `/company/profile` page
2. Select an image file
3. Click "Upload Logo"
4. Verify the file appears in Supabase Storage
5. Check that the company record is updated with the new logo URL

## File Structure

Files are stored with the following structure:

```
company-assets/
├── company-logos/
│   ├── {company-id}-{timestamp}.jpg
│   ├── {company-id}-{timestamp}.png
│   └── ...
└── other-assets/
    └── ...
```

## Security Features

- **File Size Limit**: 5MB maximum per file
- **File Type Validation**: Only image files (JPEG, PNG, WebP, GIF) allowed
- **Access Control**: Users can only access assets from their own company
- **RLS Policies**: Row-level security ensures data isolation

## API Endpoints

### Upload Logo
```
POST /api/companies/{id}/logo
Content-Type: multipart/form-data
Body: { logo: File }
```

### Delete Logo
```
DELETE /api/companies/{id}/logo
```

### Update Branding
```
PUT /api/companies/{id}/branding
Content-Type: application/json
Body: { brand_colors: object }
```

## Troubleshooting

### Common Issues

1. **Storage bucket not found**
   - Verify the SQL script was run successfully
   - Check bucket name matches exactly: `company-assets`

2. **Upload fails with permission error**
   - Verify RLS policies are set up correctly
   - Check that the user is authenticated
   - Ensure user belongs to the company they're trying to upload for

3. **File not displaying**
   - Check that the bucket is set to public
   - Verify the file URL is correctly stored in the database
   - Check browser console for CORS errors

### Debug Steps

1. Check Supabase logs for errors
2. Verify RLS policies are working
3. Test with a simple file upload
4. Check network tab for API responses

## Maintenance

### Regular Tasks

- Monitor storage usage
- Clean up orphaned files
- Review and update RLS policies as needed
- Backup important assets

### Performance Optimization

- Consider implementing image optimization
- Add CDN for faster asset delivery
- Implement asset caching strategies

## Future Enhancements

- Image resizing and optimization
- Multiple logo sizes (thumbnail, medium, large)
- Asset versioning
- Bulk asset management
- Asset analytics and usage tracking
