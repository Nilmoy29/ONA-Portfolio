-- Insert sample projects
INSERT INTO projects (title, slug, description, location, client_name, project_type, project_status, is_published, sort_order, featured_image_url)
VALUES 
  ('Modern Office Complex', 'modern-office-complex', 'A state-of-the-art office building with sustainable design features', 'New York, NY', 'TechCorp Inc', 'Commercial', 'completed', true, 1, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'),
  ('Luxury Residential Tower', 'luxury-residential-tower', 'High-end residential complex with panoramic city views', 'Los Angeles, CA', 'Premium Living LLC', 'Residential', 'construction', true, 2, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'),
  ('Cultural Heritage Center', 'cultural-heritage-center', 'Community center celebrating local cultural heritage', 'Santa Fe, NM', 'City of Santa Fe', 'Cultural', 'design', true, 3, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (name, slug, position, bio, is_published, sort_order, profile_image_url)
VALUES 
  ('Sarah Johnson', 'sarah-johnson', 'Principal Architect', 'Lead architect with 15+ years experience in sustainable design and urban planning.', true, 1, 'https://images.unsplash.com/photo-1494790108755-2616b69b78f8?w=400&h=400&fit=crop'),
  ('Michael Chen', 'michael-chen', 'Senior Designer', 'Creative designer specializing in modern residential and commercial spaces.', true, 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
  ('Emily Rodriguez', 'emily-rodriguez', 'Project Manager', 'Experienced project manager ensuring timely delivery and quality execution.', true, 3, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample services
INSERT INTO services (name, slug, description, service_type, is_published, sort_order, featured_image_url)
VALUES 
  ('Architectural Design', 'architectural-design', 'Complete architectural design services from concept to construction documents.', 'design', true, 1, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'),
  ('Urban Planning', 'urban-planning', 'Strategic urban planning and development consulting services.', 'planning', true, 2, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'),
  ('Project Management', 'project-management', 'Full project management from initial planning through final construction.', 'management', true, 3, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop'),
  ('Sustainability Consulting', 'sustainability-consulting', 'Green building design and sustainability consulting services.', 'consultation', true, 4, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample partners
INSERT INTO partners (name, slug, description, is_published, sort_order, logo_url, website_url)
VALUES 
  ('GreenBuild Construction', 'greenbuild-construction', 'Sustainable construction partner specializing in eco-friendly building practices.', true, 1, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop', 'https://example.com'),
  ('Urban Engineering Co', 'urban-engineering-co', 'Structural and civil engineering services for urban development projects.', true, 2, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop', 'https://example.com'),
  ('Sustainable Materials Inc', 'sustainable-materials-inc', 'Supplier of eco-friendly and sustainable building materials.', true, 3, 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&fit=crop', 'https://example.com')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample explore content (after adding missing columns)
INSERT INTO explore_content (title, slug, content_type, content, excerpt, is_published, featured_image_url)
VALUES 
  ('Sustainable Architecture Trends', 'sustainable-architecture-trends', 'article', 'Modern architecture is increasingly focused on sustainability and environmental responsibility. This comprehensive guide explores the latest trends...', 'Exploring the latest trends in sustainable architecture and green building practices.', true, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'),
  ('Urban Design Philosophy', 'urban-design-philosophy', 'article', 'Our approach to urban design is rooted in community engagement and environmental stewardship...', 'Understanding our philosophy and approach to contemporary urban design.', true, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'),
  ('Behind the Scenes: Design Process', 'behind-the-scenes-design-process', 'photography', 'A visual journey through our design process, from initial sketches to final construction...', 'Visual documentation of our comprehensive design process.', true, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop')
ON CONFLICT (slug) DO NOTHING;