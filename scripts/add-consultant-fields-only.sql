-- Add Consultant Fields to Projects Table
-- This script only adds the missing consultant fields without affecting existing data

-- Check if projects table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        RAISE EXCEPTION 'Projects table does not exist. Please run the complete database setup first.';
    END IF;
END $$;

-- Add architecture_consultant field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'architecture_consultant') THEN
        ALTER TABLE projects ADD COLUMN architecture_consultant TEXT;
        RAISE NOTICE 'Added architecture_consultant column to projects table';
    ELSE
        RAISE NOTICE 'architecture_consultant column already exists';
    END IF;
END $$;

-- Add engineering_consultant field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'engineering_consultant') THEN
        ALTER TABLE projects ADD COLUMN engineering_consultant TEXT;
        RAISE NOTICE 'Added engineering_consultant column to projects table';
    ELSE
        RAISE NOTICE 'engineering_consultant column already exists';
    END IF;
END $$;

-- Verify the fields were added
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('architecture_consultant', 'engineering_consultant')
ORDER BY column_name;

-- Show success message
SELECT 'Consultant fields added successfully!' as status;
