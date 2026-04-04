-- Fix explore_content foreign key constraint
-- The current constraint points to the "users" table but should point to "team_members" table

-- Step 1: Drop the existing incorrect foreign key constraint
ALTER TABLE explore_content DROP CONSTRAINT IF EXISTS explore_content_author_id_fkey;

-- Step 2: Add the correct foreign key constraint pointing to team_members table
ALTER TABLE explore_content ADD CONSTRAINT explore_content_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES team_members(id) ON DELETE SET NULL;

-- Step 3: Verify the constraint was created correctly
-- You can check this in the Supabase dashboard under Database > Tables > explore_content > Foreign Keys 