# Company Assets Management Setup

## Overview

The Company Assets Management system provides a comprehensive solution for storing, organizing, and managing various types of digital assets for companies. It supports multiple asset types including logos, banners, icons, documents, and general images, with proper categorization and access control.

## Features

### Asset Types Supported
- **Company Logo**: Company branding logos (max 5MB)
- **Banner Image**: Marketing and promotional banners (max 10MB)
- **Favicon/Icon**: Website icons and favicons (max 2MB)
- **Document**: PDFs, Word documents (max 25MB)
- **General Image**: Various image types for general use (max 15MB)

### Core Functionality
- **Asset Upload**: Drag-and-drop or file picker upload with validation
- **Asset Management**: View, download, and delete assets
- **Type Filtering**: Filter assets by type for better organization
- **Preview System**: Image previews and document type indicators
- **Storage Monitoring**: Track storage usage and asset counts
- **Metadata Management**: Add descriptions and categorize assets

### Security Features
- **Access Control**: Company-specific asset isolation
- **File Validation**: Type and size validation for all uploads
- **Secure Storage**: Supabase Storage with RLS policies
- **Audit Trail**: Track asset creation and modifications

## Technical Implementation

### Frontend Components

#### Assets Management Page (`app/company/assets/page.tsx`)
- React component with TypeScript
- Responsive grid layout for asset display
- Upload form with file type selection
- Asset preview and management interface
- Type-based filtering and search

#### Company Layout Integration
- Added Assets navigation item
- Consistent navigation experience
- Mobile-responsive design

### API Endpoints

#### Company Assets (`/api/companies/[id]/assets`)
- **GET**: Retrieve company assets with optional type filtering
- **POST**: Upload new assets with metadata
- **DELETE**: Remove assets from storage
- **Query Parameters**:
  - `type`: Filter by asset type
  - `limit`: Maximum number of assets to return
- **Response**: JSON with assets data and metadata

### Storage Configuration

#### Supabase Storage Bucket
- **Bucket Name**: `company-assets`
- **Access**: Public read, authenticated write
- **Organization**: Folder-based structure by asset type
- **File Limits**: Configurable per asset type
- **Metadata**: Company ID, asset type, descriptions

#### Folder Structure
```
company-assets/
├── company-logos/          # Company logos
├── company-banners/        # Banner images
├── company-icons/          # Favicons and icons
├── company-documents/      # PDFs and documents
└── company-images/         # General images
```

## Database Schema

### Company Assets Table (Optional)
```sql
-- Optional table for better asset tracking
CREATE TABLE IF NOT EXISTS company_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  description TEXT,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_company_assets_company_id ON company_assets(company_id);
CREATE INDEX idx_company_assets_type ON company_assets(asset_type);
CREATE INDEX idx_company_assets_created_at ON company_assets(created_at);

-- RLS policies
ALTER TABLE company_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company assets" ON company_assets
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create company assets" ON company_assets
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update company assets" ON company_assets
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete company assets" ON company_assets
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
```

## Setup Instructions

### 1. Storage Bucket Setup
Ensure the `company-assets` bucket is created in Supabase Storage:

```sql
-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-assets',
  'company-assets',
  true,
  26214400, -- 25MB limit (largest asset type)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;
```

### 2. Storage Policies
Set up RLS policies for the storage bucket:

```sql
-- Allow authenticated users to upload assets
CREATE POLICY "Users can upload company assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'company-assets' AND
    auth.role() = 'authenticated'
  );

-- Allow anyone to view company assets
CREATE POLICY "Anyone can view company assets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'company-assets'
  );

-- Allow authenticated users to delete their company's assets
CREATE POLICY "Users can delete company assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'company-assets' AND
    auth.role() = 'authenticated'
  );
```

### 3. Environment Variables
Ensure these environment variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Navigation Integration
The assets page is automatically integrated into the company navigation system through the layout component.

## Usage

### Accessing Asset Management
1. Navigate to `/company/assets`
2. View existing assets in a grid layout
3. Use type filters to organize assets
4. Upload new assets using the upload form

### Uploading Assets
1. Click "Upload Asset" button
2. Select asset type from dropdown
3. Choose file (validation will occur automatically)
4. Add optional description
5. Click "Upload Asset"

### Managing Assets
- **View**: Click the eye icon to view asset in new tab
- **Download**: Click the download icon to download asset
- **Delete**: Click the trash icon to remove asset
- **Filter**: Use type dropdown to filter assets by category

### Asset Organization
- Assets are automatically organized by type
- Each asset type has its own folder in storage
- File naming includes company ID and timestamp for uniqueness
- Metadata is stored for better organization and search

## File Management

### Upload Process
1. **Validation**: File type and size validation
2. **Processing**: Generate unique filename with company ID
3. **Storage**: Upload to appropriate Supabase Storage folder
4. **Metadata**: Store asset information and descriptions
5. **Response**: Return asset details and public URL

### File Naming Convention
```
{company-id}-{timestamp}-{random-string}.{extension}
Example: 123e4567-e89b-12d3-a456-426614174000-1640995200000-abc123.png
```

### Storage Optimization
- **Compression**: Automatic image compression (future enhancement)
- **Caching**: Browser caching for frequently accessed assets
- **CDN**: Supabase Storage provides global CDN access
- **Backup**: Automatic backup through Supabase infrastructure

## Security Considerations

### Access Control
- **Company Isolation**: Assets are isolated by company ID
- **User Permissions**: Only active team members can manage assets
- **File Validation**: Strict file type and size validation
- **Secure URLs**: Public URLs with company-specific access

### Data Protection
- **No Sensitive Data**: Assets should not contain sensitive information
- **Audit Logging**: Track all asset operations (future enhancement)
- **Backup Strategy**: Regular backups of asset metadata
- **Compliance**: GDPR and data protection compliance considerations

## Performance Optimization

### Loading Strategies
- **Lazy Loading**: Assets load as needed
- **Pagination**: Limit asset loading for large collections
- **Caching**: Browser and CDN caching for static assets
- **Compression**: Optimize file sizes for faster loading

### Storage Efficiency
- **File Deduplication**: Prevent duplicate file uploads (future enhancement)
- **Compression**: Automatic image compression (future enhancement)
- **Cleanup**: Regular cleanup of unused assets
- **Monitoring**: Track storage usage and optimize accordingly

## Monitoring and Maintenance

### Health Checks
- **API Endpoint**: Verify assets API availability
- **Storage Access**: Check storage bucket accessibility
- **Upload Limits**: Monitor file size and type restrictions
- **Performance**: Track upload and download speeds

### Maintenance Tasks
- **Storage Cleanup**: Remove orphaned assets
- **Metadata Sync**: Ensure database and storage consistency
- **Performance Review**: Monitor and optimize slow operations
- **Security Audit**: Regular security policy review

## Future Enhancements

### Advanced Features
- **Asset Versioning**: Track asset versions and changes
- **Bulk Operations**: Upload and manage multiple assets
- **Asset Templates**: Pre-defined asset configurations
- **Integration APIs**: Connect with external asset management systems

### Analytics and Reporting
- **Usage Analytics**: Track asset usage patterns
- **Storage Reports**: Detailed storage usage reports
- **Performance Metrics**: Upload/download performance tracking
- **Cost Analysis**: Storage cost optimization insights

### Automation
- **Auto-Compression**: Automatic image optimization
- **Smart Tagging**: AI-powered asset categorization
- **Workflow Automation**: Automated asset approval processes
- **Backup Automation**: Scheduled backup and recovery

## Troubleshooting

### Common Issues

#### Upload Failures
- **File Size**: Check file size limits for asset type
- **File Type**: Verify file type is supported
- **Permissions**: Ensure user has company access
- **Storage**: Check storage bucket configuration

#### Asset Not Displaying
- **URL Access**: Verify public URL accessibility
- **File Exists**: Check if file exists in storage
- **Permissions**: Ensure proper RLS policies
- **Cache**: Clear browser cache if needed

#### Performance Issues
- **File Size**: Optimize large files before upload
- **Network**: Check network connectivity
- **Storage**: Monitor storage bucket performance
- **CDN**: Verify CDN configuration

### Debug Steps
1. **Console Logs**: Check browser console for errors
2. **Network Tab**: Verify API request/response
3. **Storage Console**: Check Supabase Storage dashboard
4. **Database Queries**: Verify asset records in database

## Testing

### Manual Testing
1. **Upload Functionality**: Test all asset types and sizes
2. **Asset Management**: Verify view, download, and delete operations
3. **Type Filtering**: Test asset type filtering
4. **Responsive Design**: Test on different screen sizes
5. **Error Handling**: Test with invalid files and edge cases

### API Testing
1. **Endpoints**: Test all API endpoints with valid data
2. **Validation**: Verify file type and size validation
3. **Error Cases**: Test with invalid company IDs and files
4. **Performance**: Test upload and download speeds

### Integration Testing
1. **Storage Integration**: Verify Supabase Storage operations
2. **Database Integration**: Test asset record creation
3. **Navigation Integration**: Verify navigation functionality
4. **Company Isolation**: Test company data separation

---

This documentation provides a comprehensive guide to the Company Assets Management feature. For additional support or feature requests, refer to the project's issue tracker or development team.
