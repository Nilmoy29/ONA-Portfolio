# Team Member Database Schema & Form Documentation

## Overview
The team member management system at `http://localhost:3000/admin/team/new` provides comprehensive functionality for creating and managing team member profiles in the ONA Portfolio application.

## Database Schema: `team_members` Table

### Core Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier (auto-generated) |
| `name` | string | Yes | Full name of team member |
| `slug` | string | Yes | URL-friendly identifier (unique) |
| `created_at` | timestamp | Auto | Record creation time |
| `updated_at` | timestamp | Auto | Last modification time |

### Professional Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `position` | string | No | Job title or role |
| `bio` | text | No | Short professional summary (2-3 lines) |
| `long_bio` | text | No | Detailed professional background |
| `education` | text | No | Educational background and degrees |
| `experience_years` | number | No | Years of professional experience |
| `specializations` | string[] | No | Array of skill specializations |
| `certifications` | string[] | No | Array of professional certifications |

### Contact Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | No | Professional email address |
| `phone` | string | No | Contact phone number |
| `linkedin_url` | string | No | LinkedIn profile URL |
| `twitter_url` | string | No | Twitter profile URL |
| `portfolio_url` | string | No | Personal portfolio website |

### Media & Assets
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `profile_image_url` | string | No | Main profile photo URL |
| `gallery_images` | JSON | No | Array of additional image URLs |

### Publishing Controls
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `is_published` | boolean | No | Visibility on public website (default: false) |
| `sort_order` | number | No | Display order in listings (default: 0) |
| `search_vector` | tsvector | Auto | Full-text search indexing |

## Updated Form Structure

### Tab Organization
The enhanced team member form is now organized into four logical tabs:

#### 1. Basic Info Tab
- **Name** (required) - Auto-generates slug for new members
- **Slug** (required) - URL identifier, manually editable
- **Position** - Job title or role
- **Short Biography** - Brief professional summary (3 rows)
- **Detailed Biography** - Comprehensive background (8 rows)
- **Profile Image URL** - Main photo

#### 2. Professional Tab
- **Education** - Educational background and degrees (4 rows)
- **Years of Experience** - Numeric field (0-50 range)
- **Specializations** - Dynamic array with add/remove functionality
- **Certifications** - Dynamic array with add/remove functionality

#### 3. Contact & Social Tab
- **Email** - Professional email (validated)
- **Phone** - Contact number
- **LinkedIn URL** - Professional networking profile
- **Twitter URL** - Social media profile
- **Portfolio URL** - Personal website/portfolio

#### 4. Media & Gallery Tab
- **Gallery Images** - Dynamic array of image URLs with previews
- **Publishing Settings** - Visibility and sort order controls

### Form Features

#### Dynamic Arrays
- **Specializations**: Add/remove skills with badge display
- **Certifications**: Add/remove certifications with outline badges
- **Gallery Images**: Add/remove images with thumbnail previews

#### Validation
- Required fields: `name`, `slug`
- Email format validation
- Numeric validation for experience years
- Duplicate prevention for arrays

#### User Experience
- Auto-slug generation from name (new members only)
- Enter key support for adding array items
- Image error handling with placeholder fallback
- Clear visual distinction between field types
- Responsive layout with proper spacing

## API Integration

### Create Team Member
```typescript
POST /api/admin/team
Content-Type: application/json

{
  "name": "John Doe",
  "slug": "john-doe",
  "position": "Senior Architect",
  "bio": "Experienced architect specializing in sustainable design.",
  "long_bio": "John has over 15 years of experience...",
  "email": "john@ona.com",
  "phone": "+1-555-0123",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "education": "Master of Architecture, MIT",
  "experience_years": 15,
  "specializations": ["Sustainable Design", "Urban Planning"],
  "certifications": ["LEED AP", "AIA"],
  "profile_image_url": "https://example.com/john.jpg",
  "gallery_images": ["https://example.com/work1.jpg"],
  "is_published": true,
  "sort_order": 1
}
```

### Response Format
```typescript
{
  "data": {
    "id": "uuid-string",
    "name": "John Doe",
    "slug": "john-doe",
    // ... all other fields
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

## Database Relationships

### Project Assignments
Team members can be assigned to projects through the `project_team_members` junction table:
```sql
project_team_members (
  project_id UUID REFERENCES projects(id),
  team_member_id UUID REFERENCES team_members(id),
  role TEXT -- Optional role in specific project
)
```

### Content Authorship
Team members can author explore content (articles, research):
```sql
explore_content (
  author_id UUID REFERENCES team_members(id),
  -- other fields
)
```

## Publishing Strategy

### Public Visibility
- Only team members with `is_published = true` appear on the public website
- `sort_order` determines display sequence (lower numbers first)
- Profile images and gallery provide visual appeal

### Search Optimization
- `search_vector` field enables full-text search across all text fields
- Automatic indexing of name, position, bio, and specializations
- Search functionality available in both admin and public interfaces

## Best Practices

### Content Guidelines
1. **Short Bio**: 2-3 sentences highlighting key expertise
2. **Long Bio**: 2-3 paragraphs with career highlights and achievements
3. **Specializations**: 3-7 key skill areas
4. **Certifications**: Professional credentials and licenses
5. **Images**: High-quality professional photos, consistent aspect ratios

### SEO Considerations
1. **Slug Format**: Use lowercase, hyphen-separated format
2. **Unique Slugs**: Ensure no duplicates for proper URL routing
3. **Rich Content**: Complete profiles rank better in search
4. **Social Links**: Improve online presence and networking

### Administrative Workflow
1. Create comprehensive profile with all available information
2. Set appropriate sort order for team hierarchy
3. Keep `is_published = false` until content review complete
4. Test profile display on public website before publishing
5. Regular updates to maintain current information

## Migration Notes

### From Previous Version
The updated form now captures all database fields that were previously missing:
- `long_bio` for detailed biographies
- `education` for academic background
- `experience_years` for quantifying expertise
- `certifications` for professional credentials
- Social media links (`linkedin_url`, `twitter_url`, `portfolio_url`)
- `gallery_images` for showcasing additional work

### Backward Compatibility
All existing team member records remain compatible. New fields are optional, so existing records continue to function normally with enhanced capability for future updates. 