export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
      }
      admin_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number | null
          permissions: Json | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          budget_range: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          ip_address: unknown | null
          is_read: boolean
          message: string
          name: string
          phone: string | null
          project_location: string | null
          referrer: string | null
          replied_at: string | null
          status: string | null
          subject: string | null
          timeline: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown | null
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          project_location?: string | null
          referrer?: string | null
          replied_at?: string | null
          status?: string | null
          subject?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          ip_address?: unknown | null
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          project_location?: string | null
          referrer?: string | null
          replied_at?: string | null
          status?: string | null
          subject?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
      }
      explore_content: {
        Row: {
          author: string | null
          author_id: string | null
          category_id: string | null
          content: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          excerpt: string | null
          explore_type_id: string | null
          external_link: string | null
          featured_image_url: string | null
          gallery_images: Json | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          publication_date: string | null
          published_at: string | null
          search_vector: unknown | null
          slug: string
          sort_order: number | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          excerpt?: string | null
          explore_type_id?: string | null
          external_link?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          publication_date?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          slug: string
          sort_order?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          author?: string | null
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          excerpt?: string | null
          explore_type_id?: string | null
          external_link?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          publication_date?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
      }
      job_openings: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          created_at: string | null
          department: string
          description: string
          employment_type: string
          experience_level: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          location: string
          posted_date: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          search_vector: unknown | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          created_at?: string | null
          department: string
          description: string
          employment_type?: string
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location: string
          posted_date?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          search_vector?: unknown | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          created_at?: string | null
          department?: string
          description?: string
          employment_type?: string
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string
          posted_date?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          search_vector?: unknown | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
      }
      partners: {
        Row: {
          created_at: string | null
          description: string | null
          established_year: number | null
          id: string
          is_published: boolean | null
          location: string | null
          logo_url: string | null
          name: string
          partnership_type: string | null
          search_vector: unknown | null
          slug: string
          sort_order: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          name: string
          partnership_type?: string | null
          search_vector?: unknown | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          logo_url?: string | null
          name?: string
          partnership_type?: string | null
          search_vector?: unknown | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
      }
      projects: {
        Row: {
          area: string | null
          category_id: string | null
          client: string | null
          client_name: string | null
          completion_date: string | null
          content: string | null
          created_at: string | null
          description: string | null
          featured_image_url: string | null
          features: string[] | null
          gallery_images: Json | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          location: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          project_status: string | null
          project_type: string | null
          project_type_id: string | null
          published_at: string | null
          search_vector: unknown | null
          slug: string
          sort_order: number | null
          status: string | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
          year: number | null
        }
        Insert: {
          area?: string | null
          category_id?: string | null
          client?: string | null
          client_name?: string | null
          completion_date?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          features?: string[] | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          project_status?: string | null
          project_type?: string | null
          project_type_id?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          slug: string
          sort_order?: number | null
          status?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          year?: number | null
        }
        Update: {
          area?: string | null
          category_id?: string | null
          client?: string | null
          client_name?: string | null
          completion_date?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          features?: string[] | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          project_status?: string | null
          project_type?: string | null
          project_type_id?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          year?: number | null
        }
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          featured_image_url: string | null
          gallery_images: Json | null
          icon: string | null
          id: string
          is_published: boolean | null
          long_description: string | null
          name: string
          search_vector: unknown | null
          service_type: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          long_description?: string | null
          name: string
          search_vector?: unknown | null
          service_type?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          long_description?: string | null
          name?: string
          search_vector?: unknown | null
          service_type?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string | null
          data_type: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: string | null
        }
      }
      team_members: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          education: string | null
          email: string | null
          experience_years: number | null
          gallery_images: Json | null
          id: string
          is_published: boolean | null
          linkedin_url: string | null
          long_bio: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
          position: string | null
          profile_image_url: string | null
          search_vector: unknown | null
          slug: string
          sort_order: number | null
          specializations: string[] | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience_years?: number | null
          gallery_images?: Json | null
          id?: string
          is_published?: boolean | null
          linkedin_url?: string | null
          long_bio?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
          position?: string | null
          profile_image_url?: string | null
          search_vector?: unknown | null
          slug: string
          sort_order?: number | null
          specializations?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience_years?: number | null
          gallery_images?: Json | null
          id?: string
          is_published?: boolean | null
          linkedin_url?: string | null
          long_bio?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          position?: string | null
          profile_image_url?: string | null
          search_vector?: unknown | null
          slug?: string
          sort_order?: number | null
          specializations?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Additional type definitions for the admin system
export interface AdminProfile {
  id: string
  user_id: string
  full_name: string | null
  role: string
  avatar_url: string | null
  permissions: Json
  is_active: boolean
  last_login: string | null
  login_count: number
  created_at: string
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  user_id: string | null
  admin_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  table_name: string | null
  record_id: string | null
  old_values: Json | null
  new_values: Json | null
  details: Json | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  subtitle?: string | null
  description?: string | null
  content?: string | null
  location?: string | null
  client?: string | null
  client_name?: string | null
  year?: number | null
  area?: string | null
  status?: string | null
  project_status?: string | null
  project_type?: string | null
  featured_image_url?: string | null
  gallery_images?: Json | null
  video_url?: string | null
  category_id?: string | null
  project_type_id?: string | null
  tags?: string[] | null
  meta_title?: string | null
  meta_description?: string | null
  og_image_url?: string | null
  is_published?: boolean | null
  is_featured?: boolean | null
  published_at?: string | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  position?: string | null
  bio?: string | null
  long_bio?: string | null
  email?: string | null
  phone?: string | null
  linkedin_url?: string | null
  twitter_url?: string | null
  portfolio_url?: string | null
  profile_image_url?: string | null
  gallery_images?: Json | null
  specializations?: string[] | null
  education?: string | null
  experience_years?: number | null
  certifications?: string[] | null
  is_published?: boolean | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string | null
  long_description?: string | null
  service_type?: string | null
  icon?: string | null
  featured_image_url?: string | null
  gallery_images?: Json | null
  is_published?: boolean | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  slug: string
  description?: string | null
  logo_url?: string | null
  website_url?: string | null
  partnership_type?: string | null
  location?: string | null
  established_year?: number | null
  is_published?: boolean | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  subject?: string | null
  message: string
  inquiry_type?: string | null
  budget_range?: string | null
  timeline?: string | null
  project_location?: string | null
  status?: string | null
  admin_notes?: string | null
  replied_at?: string | null
  is_read: boolean
  ip_address?: string | null
  user_agent?: string | null
  referrer?: string | null
  created_at: string
  updated_at: string
}

export interface ExploreContent {
  id: string
  title: string
  slug: string
  subtitle?: string | null
  description?: string | null
  content?: string | null
  content_type?: string | null
  excerpt?: string | null
  featured_image_url?: string | null
  gallery_images?: Json | null
  video_url?: string | null
  explore_type_id?: string | null
  category_id?: string | null
  tags?: string[] | null
  author?: string | null
  author_id?: string | null
  external_link?: string | null
  publication_date?: string | null
  meta_title?: string | null
  meta_description?: string | null
  og_image_url?: string | null
  is_published?: boolean | null
  is_featured?: boolean | null
  published_at?: string | null
  sort_order?: number | null
  created_at: string
  updated_at: string
}

export interface JobOpening {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level?: string | null
  description: string
  requirements?: string[] | null
  responsibilities?: string[] | null
  benefits?: string[] | null
  salary_range?: string | null
  application_deadline?: string | null
  is_published?: boolean | null
  is_featured?: boolean | null
  sort_order?: number | null
  posted_date?: string | null
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value?: string | null
  description?: string | null
  data_type?: string | null
  category?: string | null
  is_public?: boolean | null
  created_at: string
  updated_at: string
}