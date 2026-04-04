-- OPTIMIZE PROJECTS QUERY PERFORMANCE
-- This script adds indexes and optimizations to prevent query timeouts

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_title ON projects(title);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_projects_published_created ON projects(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_published_title ON projects(is_published, title);

-- Add full-text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Optimize the categories table
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Add foreign key index if not exists
CREATE INDEX IF NOT EXISTS idx_projects_category_fk ON projects(category_id);

-- Analyze tables to update statistics
ANALYZE projects;
ANALYZE categories;

-- Show current indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('projects', 'categories')
ORDER BY tablename, indexname;

SELECT 'Projects query optimization completed!' as status; 