# API Documentation

## 🌐 Overview

The ONA Portfolio Website provides a comprehensive REST API for admin operations, built with Next.js API routes and integrated with Supabase for data management.

## 🏗️ API Architecture

### Technology Stack
- **Framework**: Next.js 14 API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Validation**: Zod schemas for request validation
- **Response Format**: Consistent JSON API structure

### Base URL
```
https://your-domain.com/api
```

### Authentication
All admin API endpoints require authentication:
```javascript
// Include in request headers
Authorization: Bearer <jwt_token>
```

## 📋 API Endpoints

### Standard CRUD Pattern

All entities follow consistent RESTful patterns:

```
GET    /api/admin/{entity}        # List with pagination/filtering
POST   /api/admin/{entity}        # Create new record
GET    /api/admin/{entity}/{id}   # Get single record
PUT    /api/admin/{entity}/{id}   # Update record
DELETE /api/admin/{entity}/{id}   # Delete record
```

## 📁 Projects API

### List Projects
```http
GET /api/admin/projects?page=1&limit=10&status=published&category=architecture
```

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Items per page (max 100)
- `status` (string): Filter by status (`draft`, `published`)
- `category` (string): Filter by category slug
- `search` (string): Full-text search in title/description

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Project Title",
      "slug": "project-title",
      "description": "Project description...",
      "category": {
        "id": "uuid",
        "name": "Architecture",
        "slug": "architecture"
      },
      "featured_image_url": "https://...",
      "gallery_images": [...],
      "client_name": "Client Name",
      "location": "Location",
      "project_status": "published",
      "is_published": true,
      "sort_order": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Create Project
```http
POST /api/admin/projects
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "category_id": "uuid",
  "featured_image_url": "https://...",
  "gallery_images": [
    {
      "url": "https://...",
      "alt": "Image description",
      "caption": "Image caption"
    }
  ],
  "client_name": "Client Name",
  "location": "Location",
  "project_status": "draft",
  "is_published": false,
  "sort_order": 1
}
```

### Get Single Project
```http
GET /api/admin/projects/{id}
```

### Update Project
```http
PUT /api/admin/projects/{id}
```

**Request Body:** Same as create, only include fields to update

### Delete Project
```http
DELETE /api/admin/projects/{id}
```

## 👥 Team Members API

### Endpoints
```
GET    /api/admin/team
POST   /api/admin/team
GET    /api/admin/team/{id}
PUT    /api/admin/team/{id}
DELETE /api/admin/team/{id}
```

### Team Member Schema
```json
{
  "id": "uuid",
  "name": "John Doe",
  "slug": "john-doe",
  "position": "Senior Architect",
  "bio": "Professional biography...",
  "profile_image_url": "https://...",
  "specializations": ["architecture", "interior-design"],
  "is_published": true,
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🔧 Services API

### Endpoints
```
GET    /api/admin/services
POST   /api/admin/services
GET    /api/admin/services/{id}
PUT    /api/admin/services/{id}
DELETE /api/admin/services/{id}
```

### Service Schema
```json
{
  "id": "uuid",
  "name": "Architecture Design",
  "slug": "architecture-design",
  "description": "Service description...",
  "service_type": "architecture",
  "icon": "building",
  "featured_image_url": "https://...",
  "is_published": true,
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 📖 Explore Content API

### Endpoints
```
GET    /api/admin/explore
POST   /api/admin/explore
GET    /api/admin/explore/{id}
PUT    /api/admin/explore/{id}
DELETE /api/admin/explore/{id}
```

### Content Types
- `article` - Blog posts and insights
- `artwork` - Visual portfolio pieces
- `research` - Case studies and whitepapers

### Content Schema
```json
{
  "id": "uuid",
  "title": "Content Title",
  "slug": "content-title",
  "content_type": "article",
  "content": "Full content...",
  "excerpt": "Brief excerpt...",
  "featured_image_url": "https://...",
  "author_id": "uuid",
  "author": {
    "name": "Author Name",
    "position": "Author Position"
  },
  "is_published": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🤝 Partners API

### Endpoints
```
GET    /api/admin/partners
POST   /api/admin/partners
GET    /api/admin/partners/{id}
PUT    /api/admin/partners/{id}
DELETE /api/admin/partners/{id}
```

### Partner Schema
```json
{
  "id": "uuid",
  "name": "Partner Company",
  "slug": "partner-company",
  "description": "Company description...",
  "logo_url": "https://...",
  "website_url": "https://partner.com",
  "is_published": true,
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 📞 Contact Submissions API

### Endpoints
```
GET    /api/admin/contact
POST   /api/admin/contact          # Public endpoint for form submissions
GET    /api/admin/contact/{id}
PUT    /api/admin/contact/{id}     # Update status/notes
DELETE /api/admin/contact/{id}
```

### Submission Schema
```json
{
  "id": "uuid",
  "name": "Contact Name",
  "email": "contact@example.com",
  "subject": "Inquiry Subject",
  "message": "Contact message...",
  "status": "unread", // "unread", "read", "responded", "archived"
  "is_read": false,
  "admin_notes": "Internal notes...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 👤 Admin Users API

### Endpoints
```
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

### User Schema
```json
{
  "id": "uuid",
  "user_id": "uuid", // Supabase Auth user ID
  "full_name": "Admin User",
  "role": "admin", // "admin", "editor", "viewer"
  "permissions": {
    "can_manage_users": true,
    "can_manage_content": true,
    "can_manage_settings": true,
    "can_view_analytics": true
  },
  "is_active": true,
  "last_login": "2024-01-01T00:00:00Z",
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🖼️ Media Library API

### Endpoints
```
GET    /api/admin/media
POST   /api/admin/media            # File upload
GET    /api/admin/media/{id}
DELETE /api/admin/media/{id}
```

### Upload Schema
```http
POST /api/admin/media
Content-Type: multipart/form-data

Form Data:
- file: [file] (required)
- alt_text: "Alt description"
- caption: "Image caption"
- folder: "projects" (optional categorization)
```

## ⚙️ Categories API

### Endpoints
```
GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/{id}
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

### Category Schema
```json
{
  "id": "uuid",
  "name": "Architecture",
  "slug": "architecture",
  "description": "Architecture projects and services",
  "color": "#3B82F6", // Hex color for UI
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 📋 Activity Logs API

### Endpoints
```
GET    /api/admin/logs
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `user_id` - Filter by user
- `action` - Filter by action type
- `entity_type` - Filter by entity type
- `date_from`, `date_to` - Date range filtering

### Log Schema
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user": {
    "full_name": "Admin User"
  },
  "action": "create", // "create", "update", "delete", "login", etc.
  "entity_type": "project", // "project", "team_member", etc.
  "entity_id": "uuid",
  "details": {
    "field": "title",
    "old_value": "Old Title",
    "new_value": "New Title"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 🔍 Filtering & Search

### Common Query Parameters

#### Pagination
- `page=1` - Page number (default: 1)
- `limit=10` - Items per page (default: 10, max: 100)

#### Filtering
- `is_published=true` - Publication status
- `status=draft` - Status filtering
- `category=architecture` - Category filtering
- `author_id=uuid` - Author filtering

#### Search
- `search=query` - Full-text search across relevant fields

#### Sorting
- `sort=title` - Sort field
- `order=asc` - Sort order (asc/desc)

### Advanced Filtering Examples

```javascript
// Get published projects in architecture category
GET /api/admin/projects?is_published=true&category=architecture

// Search for team members with specific skills
GET /api/admin/team?search=architect

// Get recent activity logs for a user
GET /api/admin/logs?user_id=uuid&date_from=2024-01-01
```

## 📊 Response Format

### Success Response
```json
{
  "data": [...], // Array of records or single record
  "pagination": { // Only included for list endpoints
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "success": true
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { // Optional additional error information
    "field": "title",
    "message": "Title is required"
  },
  "success": false
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (duplicate, etc.)
- `INTERNAL_ERROR` - Server error

## 🔒 Authentication & Security

### JWT Authentication
```javascript
// Include JWT token in Authorization header
const headers = {
  'Authorization': `Bearer ${jwt_token}`,
  'Content-Type': 'application/json'
};
```

### Permission Requirements
- **Read Operations**: Editor role or higher
- **Write Operations**: Editor role or higher
- **User Management**: Admin role only
- **System Settings**: Admin role only

### Rate Limiting
- **Authenticated Requests**: 1000 requests per hour
- **Public Endpoints**: 100 requests per hour
- **File Uploads**: 50 uploads per hour

## 🧪 Testing

### API Testing Tools
- **Postman**: Comprehensive API testing
- **Insomnia**: Modern API client
- **curl**: Command-line testing
- **Thunder Client**: VSCode extension

### Test Data
Use the sample data script to populate test data:
```bash
# Run sample data script
node scripts/sample-data.sql
```

## 📚 API Best Practices

### Request Optimization
- Use appropriate HTTP methods
- Include only necessary fields in requests
- Use pagination for large datasets
- Implement proper error handling

### Response Handling
- Check `success` field first
- Handle pagination metadata
- Parse error messages appropriately
- Implement retry logic for network errors

### Security Considerations
- Never expose API keys in client code
- Validate all input data
- Use HTTPS for all requests
- Implement proper CORS policies

## 🔄 Real-time Updates

### Supabase Real-time
The API supports real-time subscriptions for live updates:

```javascript
import { supabase } from '@/lib/supabase';

const subscription = supabase
  .channel('projects')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects'
  }, (payload) => {
    console.log('Project updated:', payload);
  })
  .subscribe();
```

## 📈 Performance

### Response Times
- **List Operations**: < 200ms
- **Single Record**: < 100ms
- **Create/Update/Delete**: < 300ms
- **File Upload**: < 5000ms (depends on file size)

### Optimization Features
- Database query optimization
- Redis caching (planned)
- CDN integration for media
- Automatic image compression

## 🚀 Future Enhancements

### Planned Features
- **GraphQL API**: More flexible queries
- **Bulk Operations**: Batch create/update/delete
- **Advanced Filtering**: Complex query building
- **API Versioning**: Versioned endpoints
- **Webhook Support**: Real-time notifications

### Technical Improvements
- **OpenAPI Specification**: Automated API documentation
- **Rate Limiting**: Advanced rate limiting with tiers
- **Caching**: Response caching and invalidation
- **Monitoring**: API performance and error tracking

---

**API Version**: v1.0
**Last Updated**: January 2026