# Company Dashboard Setup

## Overview

The Company Dashboard provides a comprehensive overview of company performance, metrics, and recent activity. It displays key performance indicators (KPIs) and allows company administrators to monitor their business operations at a glance.

## Features

### Key Metrics Display
- **Total Users**: Count of all team members
- **Active Users**: Count of active team members in the selected time period
- **Total Calculators**: Number of active calculators (placeholder for future implementation)
- **Total Leads**: Number of leads generated (placeholder for future implementation)
- **Conversion Rate**: Lead conversion percentage (placeholder for future implementation)
- **Monthly Growth**: Month-over-month growth percentage (placeholder for future implementation)

### Secondary Metrics
- **Session Duration**: Average time users spend per session
- **Domain Status**: Current domain verification status for white-labeling
- **Storage Usage**: Current storage usage with visual progress bar

### Recent Activity Feed
- **User Activities**: Team member joins, role changes
- **System Activities**: Domain verifications, settings updates
- **Business Activities**: Calculator creation, lead generation (placeholders)

### Time Range Selection
- **7 Days**: Last week metrics
- **30 Days**: Last month metrics (default)
- **90 Days**: Last quarter metrics

## Technical Implementation

### Frontend Components

#### Dashboard Page (`app/company/dashboard/page.tsx`)
- React component with TypeScript
- Responsive grid layout for metrics
- Time range selector with state management
- Activity feed with dynamic icons and badges
- Loading states and error handling

#### Company Layout (`app/company/layout.tsx`)
- Navigation header with company management links
- Responsive design for mobile and desktop
- Active state indicators for current page
- Breadcrumb-style navigation

### API Endpoints

#### Company Metrics (`/api/companies/[id]/metrics`)
- **GET**: Retrieve aggregated company metrics
- **Query Parameters**:
  - `timeRange`: 7d, 30d, or 90d
- **Response**: JSON with metrics data and time period information

#### Company Activity (`/api/companies/[id]/activity`)
- **GET**: Retrieve recent company activities
- **Query Parameters**:
  - `timeRange`: 7d, 30d, or 90d
  - `limit`: Maximum number of activities to return
- **Response**: JSON with activity list and metadata

### Data Sources

#### Real Data (Currently Implemented)
- Team member counts from `team_members` table
- Domain verification status from `companies` table
- Storage usage from Supabase Storage
- Recent team member activities

#### Placeholder Data (Future Implementation)
- Calculator counts and performance metrics
- Lead generation and conversion rates
- User session analytics
- Business growth metrics

## Database Schema

### Companies Table Extensions
```sql
-- Domain verification fields
ALTER TABLE companies ADD COLUMN domain_verification_status VARCHAR(20) DEFAULT 'none';
ALTER TABLE companies ADD COLUMN domain_verification_id UUID REFERENCES domain_verifications(id);
ALTER TABLE companies ADD COLUMN domain_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE companies ADD COLUMN custom_domain_enabled BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN subdomain_enabled BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN white_label_enabled BOOLEAN DEFAULT false;
```

### Storage Integration
- **Bucket**: `company-assets`
- **File Types**: Images (JPEG, PNG, WebP, GIF)
- **Size Limit**: 5MB per file
- **Access**: Public read, authenticated write

## Setup Instructions

### 1. Database Setup
Run the domain verification schema setup:
```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/domain-verification-schema.sql
```

### 2. Storage Setup
Run the storage setup script:
```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/storage-setup.sql
```

### 3. Environment Variables
Ensure these environment variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Navigation Integration
The dashboard is automatically integrated into the company navigation system through the layout component.

## Usage

### Accessing the Dashboard
1. Navigate to `/company/dashboard`
2. The dashboard will automatically load company data
3. Use time range selector to view different periods
4. Monitor key metrics and recent activities

### Interpreting Metrics
- **Green indicators**: Positive trends (growth, verified status)
- **Orange indicators**: Neutral status (pending verification)
- **Red indicators**: Issues (failed verification, errors)
- **Blue indicators**: Information metrics (session duration, storage)

### Activity Feed
- Activities are automatically generated from database events
- Each activity includes timestamp, user, and description
- Icons indicate activity type for quick recognition
- Demo data is shown when no real activities exist

## Future Enhancements

### Analytics Integration
- **Plausible Analytics**: Privacy-friendly web analytics
- **Custom Events**: Track calculator usage and conversions
- **Performance Metrics**: Load times and user experience data

### Real-time Updates
- **WebSocket Integration**: Live metric updates
- **Push Notifications**: Important activity alerts
- **Auto-refresh**: Periodic data updates

### Advanced Metrics
- **Revenue Tracking**: Subscription and usage metrics
- **User Behavior**: Detailed user interaction analytics
- **Business Intelligence**: Predictive analytics and trends

### Customization
- **Widget Configuration**: Customizable dashboard layout
- **Metric Selection**: Choose which metrics to display
- **Brand Integration**: Company-specific styling and branding

## Testing

### Manual Testing
1. **Navigation**: Verify all navigation links work correctly
2. **Responsiveness**: Test on different screen sizes
3. **Data Loading**: Check loading states and error handling
4. **Time Ranges**: Verify different time period selections
5. **Activity Feed**: Confirm activity display and formatting

### API Testing
1. **Metrics Endpoint**: Test with valid company ID
2. **Activity Endpoint**: Verify activity data retrieval
3. **Error Handling**: Test with invalid IDs and edge cases
4. **Performance**: Check response times and data size

### Integration Testing
1. **Company Profile**: Verify logo upload integration
2. **Domain Management**: Check domain status display
3. **Team Management**: Confirm user count accuracy
4. **Storage Integration**: Test storage usage calculation

## Troubleshooting

### Common Issues

#### Metrics Not Loading
- Check company ID validity
- Verify database connection
- Ensure proper permissions

#### Activity Feed Empty
- Check if activities exist in database
- Verify time range selection
- Check API endpoint responses

#### Storage Usage Incorrect
- Verify storage bucket configuration
- Check file metadata access
- Ensure proper file path structure

#### Navigation Issues
- Check layout component imports
- Verify route configuration
- Test navigation state management

### Debug Steps
1. **Console Logs**: Check browser console for errors
2. **Network Tab**: Verify API request/response
3. **Database Queries**: Test direct database access
4. **Component State**: Verify React component state

## Performance Considerations

### Data Loading
- Metrics are loaded on component mount
- Activity feed uses pagination (limit parameter)
- Time range changes trigger data reloads

### Caching Strategy
- No client-side caching implemented
- Consider implementing React Query for better performance
- Add server-side caching for frequently accessed metrics

### Optimization Opportunities
- Implement virtual scrolling for large activity lists
- Add data prefetching for common time ranges
- Use React.memo for expensive components

## Security

### Access Control
- Dashboard access restricted to authenticated users
- Company data isolation through RLS policies
- API endpoints validate company ownership

### Data Privacy
- No sensitive information displayed
- Activity feed shows only necessary details
- Storage usage limited to company assets

### API Security
- Input validation on all endpoints
- SQL injection prevention through Supabase
- Rate limiting considerations for future implementation

## Monitoring

### Health Checks
- API endpoint availability
- Database connection status
- Storage bucket accessibility

### Performance Metrics
- Page load times
- API response times
- Data retrieval efficiency

### Error Tracking
- Client-side error logging
- Server-side error monitoring
- User experience impact assessment

---

This documentation provides a comprehensive guide to the Company Dashboard feature. For additional support or feature requests, refer to the project's issue tracker or development team.
