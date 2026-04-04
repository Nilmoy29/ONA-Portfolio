-- EMERGENCY DATABASE FIX FOR TIMEOUT ISSUES (SUPABASE COMPATIBLE)
-- This script addresses immediate performance problems
-- Modified to work with Supabase SQL editor

-- 1. Disable RLS temporarily to reduce overhead
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 2. Create essential indexes for performance (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_projects_published_created_at 
ON projects(is_published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_published_title 
ON projects(is_published, title);

CREATE INDEX IF NOT EXISTS idx_projects_category_id 
ON projects(category_id);

-- 3. Update table statistics
ANALYZE projects;
ANALYZE categories;

-- 4. Check current table sizes and performance
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename IN ('projects', 'categories')
ORDER BY tablename, attname;

-- 5. Show current indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('projects', 'categories')
ORDER BY tablename, indexname;

SELECT 'Emergency database fix completed!' as status; 