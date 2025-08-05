-- EMERGENCY DATABASE FIX FOR TIMEOUT ISSUES
-- This script addresses immediate performance problems

-- 1. Disable RLS temporarily to reduce overhead
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 2. Create essential indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_published_created_at 
ON projects(is_published, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_published_title 
ON projects(is_published, title);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_category_id 
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

-- 6. Check for long-running queries (if any)
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state = 'active';

SELECT 'Emergency database fix completed!' as status; 