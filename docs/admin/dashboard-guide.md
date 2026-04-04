# Admin Dashboard Guide

## 🎛️ Overview

The ONA Portfolio Website features a comprehensive admin dashboard for content management, user administration, and site configuration. Built with modern React components and integrated with Supabase for data management.

## 🏗️ Dashboard Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **UI Components**: Custom React components with Tailwind CSS
- **State Management**: React hooks and context
- **Data Layer**: Supabase client with real-time subscriptions
- **Authentication**: Supabase Auth with role-based access

### File Structure
```
app/admin/
├── layout.tsx                 # Main admin layout with navigation
├── dashboard/
│   └── page.tsx              # Dashboard overview with stats
├── projects/
│   ├── page.tsx              # Projects list
│   ├── new/page.tsx          # Create new project
│   └── [id]/edit/page.tsx     # Edit existing project
├── team/
│   ├── page.tsx              # Team members list
│   ├── new/page.tsx          # Add team member
│   └── [id]/edit/page.tsx     # Edit team member
├── services/
│   ├── page.tsx              # Services list
│   ├── new/page.tsx          # Create service
│   └── [id]/edit/page.tsx     # Edit service
├── explore/
│   ├── page.tsx              # Content list
│   ├── new/page.tsx          # Create content
│   └── [id]/edit/page.tsx     # Edit content
├── partners/
│   ├── page.tsx              # Partners list
│   ├── new/page.tsx          # Add partner
│   └── [id]/edit/page.tsx     # Edit partner
├── contact/
│   └── page.tsx              # Contact form submissions
├── users/
│   └── page.tsx              # Admin user management
├── media/
│   └── page.tsx              # Media library
├── settings/
│   └── page.tsx              # Site configuration
└── logs/
    └── page.tsx              # Activity logs
```

## 🔐 Authentication & Access Control

### Login Process
1. Navigate to `/admin/login`
2. Enter email and password
3. Supabase Auth validates credentials
4. Redirect to dashboard on success

### User Roles & Permissions
- **Admin**: Full access to all features and settings
- **Editor**: Content creation and editing capabilities
- **Viewer**: Read-only access to content and analytics

### Session Management
- JWT-based authentication with automatic refresh
- Persistent sessions across browser tabs
- Automatic logout on token expiration
- Secure route protection via middleware

## 📊 Dashboard Overview

### Main Dashboard (`/admin/dashboard`)
**Features:**
- **Statistics Cards**: Total counts for projects, team members, services, etc.
- **Recent Activity**: Latest content updates and user actions
- **Quick Actions**: Shortcuts to common tasks
- **System Status**: Database connectivity and performance metrics

**Key Metrics:**
- Total published projects
- Active team members
- Available services
- Pending contact submissions
- Recent content updates

## 📝 Content Management

### Projects Management (`/admin/projects`)

#### List View
- **Table Display**: Projects with status, category, and actions
- **Filtering**: By status (draft/published), category, date range
- **Sorting**: By title, creation date, last modified
- **Bulk Actions**: Publish/unpublish multiple projects
- **Search**: Full-text search across titles and descriptions

#### Create/Edit Project
**Required Fields:**
- Title (auto-generates slug)
- Description (rich text editor)
- Category selection
- Featured image upload
- Gallery images (multiple file upload)
- Client name and location
- Project status (draft/published)

**Advanced Features:**
- **Team Member Assignment**: Link project to team members
- **Partner Association**: Connect with business partners
- **Sort Order**: Manual ordering for display
- **SEO Fields**: Meta description and keywords

### Team Members (`/admin/team`)

#### Profile Management
- **Basic Information**: Name, position, bio
- **Profile Image**: Avatar upload with cropping
- **Specializations**: Tag-based skill areas
- **Publication Status**: Control visibility on public site

#### Features
- **Slug Generation**: URL-friendly identifiers
- **Rich Text Bio**: Formatted biography content
- **Sort Ordering**: Display priority control

### Services (`/admin/services`)

#### Service Configuration
- **Service Details**: Name, description, type classification
- **Visual Elements**: Icon selection and featured images
- **Content Organization**: Categorization and ordering

#### Service Types
- Architecture Design
- Interior Design
- Urban Planning
- Consulting
- Project Management

### Explore Content (`/admin/explore`)

#### Content Types
- **Articles**: Blog posts and insights
- **Artwork**: Visual portfolio pieces
- **Research**: Case studies and whitepapers

#### Content Creation
- **Rich Text Editor**: Full formatting capabilities
- **Media Integration**: Image and document embedding
- **Author Assignment**: Link to team members
- **Excerpt Generation**: Automatic or manual summaries

### Partners (`/admin/partners`)

#### Partner Profiles
- **Company Information**: Name, description, website
- **Branding**: Logo upload and display
- **Relationship Management**: Partnership status and details

## 👥 User Administration

### Admin Users (`/admin/users`)

#### User Management
- **User Creation**: Add new admin accounts
- **Role Assignment**: Admin, Editor, Viewer permissions
- **Account Status**: Active/inactive user control
- **Profile Management**: Name, avatar, contact information

#### Security Features
- **Password Management**: Secure password policies
- **Login Tracking**: Last login time and IP monitoring
- **Activity Auditing**: Comprehensive action logging

## 📞 Contact Management

### Contact Submissions (`/admin/contact`)

#### Submission Handling
- **Inbox View**: List of all contact form submissions
- **Status Tracking**: Unread, read, responded, archived
- **Priority Management**: Mark important submissions
- **Admin Notes**: Internal communication and follow-up notes

#### Features
- **Filtering**: By status, date, subject
- **Search**: Full-text search across messages
- **Bulk Operations**: Mark multiple as read/responded
- **Export**: CSV export for external processing

## 🖼️ Media Library

### Media Management (`/admin/media`)

#### File Upload
- **Multiple Formats**: Images, documents, videos
- **Drag & Drop**: Intuitive file upload interface
- **Batch Upload**: Multiple file selection and upload
- **Progress Tracking**: Real-time upload status

#### Organization
- **Categorization**: Folder-based organization
- **Metadata**: Alt text, captions, descriptions
- **Usage Tracking**: Where media files are referenced
- **Storage Optimization**: Automatic image compression

## ⚙️ Site Settings

### Configuration Management (`/admin/settings`)

#### Setting Categories
- **General**: Site title, description, contact information
- **SEO**: Meta tags, social media integration
- **Analytics**: Google Analytics, tracking codes
- **Email**: SMTP configuration for notifications
- **Security**: Password policies, session timeouts

#### Dynamic Configuration
- **Key-Value Storage**: Flexible configuration system
- **Data Type Support**: String, number, boolean, JSON
- **Category Organization**: Logical grouping for UI
- **Public/Private**: Control client-side access

## 📋 Activity Logs

### Audit Trail (`/admin/logs`)

#### Logging Features
- **Comprehensive Tracking**: All admin actions logged
- **User Attribution**: Link actions to specific users
- **Entity Tracking**: Which content items were affected
- **Timestamp Recording**: Exact timing of all activities

#### Log Analysis
- **Filtering**: By user, action type, date range, entity
- **Search**: Full-text search across log details
- **Export**: Generate reports for compliance
- **Real-time Updates**: Live activity monitoring

## 🎨 User Interface

### Design System
- **Tailwind CSS**: Utility-first styling framework
- **Component Library**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme support

### Navigation
- **Sidebar Navigation**: Collapsible menu with icons
- **Breadcrumb Navigation**: Clear page hierarchy
- **Quick Actions**: Floating action buttons for common tasks
- **Keyboard Shortcuts**: Efficiency enhancements

### Data Tables
- **Sorting**: Click column headers to sort
- **Filtering**: Advanced filter options
- **Pagination**: Efficient large dataset handling
- **Bulk Selection**: Multi-item operations

## 🔧 API Integration

### CRUD Operations
All admin functions use consistent API patterns:

```
GET    /api/admin/{entity}        # List with pagination
POST   /api/admin/{entity}        # Create new record
GET    /api/admin/{entity}/{id}   # Get single record
PUT    /api/admin/{entity}/{id}   # Update record
DELETE /api/admin/{entity}/{id}   # Delete record
```

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Handling
- **Validation Errors**: Field-specific error messages
- **Permission Errors**: Clear access denied messaging
- **System Errors**: User-friendly error displays
- **Network Errors**: Retry mechanisms and offline handling

## 📊 Analytics & Reporting

### Built-in Analytics
- **Content Metrics**: Publication status and engagement
- **User Activity**: Admin user productivity tracking
- **System Performance**: Response times and error rates
- **Storage Usage**: Media library and database metrics

### External Integration
- **Google Analytics**: Website traffic and user behavior
- **Custom Dashboards**: Configurable reporting views
- **Export Capabilities**: Data export for external analysis

## 🚀 Performance Optimization

### Frontend Optimizations
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Splitting**: Route-based code splitting
- **Caching**: Browser and application-level caching

### Database Optimizations
- **Efficient Queries**: Optimized SQL with proper indexing
- **Pagination**: Cursor-based pagination for large datasets
- **Real-time Updates**: Supabase subscriptions for live data
- **Connection Pooling**: Efficient database connection management

## 🔒 Security Features

### Access Control
- **Role-Based Permissions**: Granular access control
- **Route Protection**: Middleware-based authentication
- **API Security**: Request validation and sanitization
- **Session Security**: Secure JWT token management

### Data Protection
- **Row Level Security**: Database-level access control
- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: React's built-in security features

## 🐛 Troubleshooting

### Common Issues

#### Login Problems
- **Check Credentials**: Verify email and password
- **Account Status**: Ensure account is active
- **Network Issues**: Check internet connectivity
- **Browser Cache**: Clear browser cache and cookies

#### Content Upload Issues
- **File Size Limits**: Check file size restrictions
- **Format Support**: Verify supported file types
- **Permissions**: Ensure upload permissions
- **Storage Quota**: Check available storage space

#### Performance Issues
- **Network Latency**: Check connection speed
- **Browser Resources**: Monitor memory and CPU usage
- **Cache Clearing**: Clear application and browser cache
- **Database Connectivity**: Verify Supabase connection

## 📚 Best Practices

### Content Management
- **Consistent Naming**: Use clear, descriptive titles
- **SEO Optimization**: Include relevant keywords
- **Image Optimization**: Use appropriate image sizes
- **Regular Updates**: Keep content current and relevant

### User Management
- **Role Assignment**: Assign minimum necessary permissions
- **Regular Audits**: Review user access periodically
- **Password Policies**: Enforce strong password requirements
- **Activity Monitoring**: Track user actions for security

### System Maintenance
- **Regular Backups**: Ensure data is regularly backed up
- **Performance Monitoring**: Monitor system performance
- **Security Updates**: Keep dependencies updated
- **Log Review**: Regularly review activity logs

## 🎯 Future Enhancements

### Planned Features
- **Bulk Import/Export**: CSV and Excel integration
- **Workflow Automation**: Approval processes and notifications
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-language Support**: Internationalization features
- **API Integrations**: Third-party service connections

### Technical Improvements
- **Real-time Collaboration**: Multi-user editing capabilities
- **Version Control**: Content versioning and rollback
- **Advanced Search**: Full-text search with filters
- **Mobile App**: Native mobile admin application

---

**Admin Dashboard Version**: Complete (July 2025)
**Last Updated**: January 2026