const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'
);

async function checkColumnExists(tableName, columnName) {
  try {
    // Use a direct query to check if column exists
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .limit(1);
    
    if (error) {
      return { exists: false, error: error.message };
    }
    return { exists: true, error: null };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function verifyDatabaseConnection() {
  console.log('🔍 Verifying database connection and required columns...\n');
  
  // Tables that should have is_published column
  const tablesWithIsPublished = [
    'projects',
    'team_members', 
    'services',
    'explore_content',
    'partners'
  ];
  
  // Tables that should have sort_order column
  const tablesWithSortOrder = [
    'projects',
    'team_members',
    'services',
    'explore_content',
    'partners'
  ];
  
  let allTestsPassed = true;
  
  // Test basic database connection
  console.log('🔌 Testing basic database connection...');
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    allTestsPassed = false;
  }
  
  console.log('\n📊 Checking is_published column...');
  console.log('='.repeat(50));
  
  // Check is_published column existence
  for (const tableName of tablesWithIsPublished) {
    const result = await checkColumnExists(tableName, 'is_published');
    if (result.exists) {
      console.log(`✅ ${tableName.padEnd(20)} - is_published column exists`);
    } else {
      console.log(`❌ ${tableName.padEnd(20)} - is_published column missing: ${result.error}`);
      allTestsPassed = false;
    }
  }
  
  console.log('\n📊 Checking sort_order column...');
  console.log('='.repeat(50));
  
  // Check sort_order column existence
  for (const tableName of tablesWithSortOrder) {
    const result = await checkColumnExists(tableName, 'sort_order');
    if (result.exists) {
      console.log(`✅ ${tableName.padEnd(20)} - sort_order column exists`);
    } else {
      console.log(`❌ ${tableName.padEnd(20)} - sort_order column missing: ${result.error}`);
      allTestsPassed = false;
    }
  }
  
  console.log('\n🧪 Testing CRUD operations with new columns...');
  console.log('='.repeat(50));
  
  // Test CRUD operations for each table
  const testEntities = [
    {
      name: 'projects',
      createData: {
        title: 'Test Project Column Verification',
        slug: 'test-project-column-verification',
        description: 'Test project for column verification',
        client: 'Test Client',
        status: 'planning',
        is_published: false,
        sort_order: 1
      }
    },
    {
      name: 'team_members',
      createData: {
        name: 'Test Team Member Column Verification',
        slug: 'test-team-member-column-verification',
        position: 'Test Position',
        bio: 'Test bio for team member',
        email: 'test-column-verification@example.com',
        specializations: [],
        is_published: false,
        sort_order: 1
      }
    },
    {
      name: 'services',
      createData: {
        name: 'Test Service Column Verification',
        slug: 'test-service-column-verification',
        description: 'Test service for column verification',
        service_type: 'design',
        is_published: false,
        sort_order: 1
      }
    },
    {
      name: 'explore_content',
      createData: {
        title: 'Test Explore Content Column Verification',
        slug: 'test-explore-content-column-verification',
        subtitle: 'Test subtitle',
        description: 'Test description',
        content: 'Test content for explore section',
        author: 'Test Author',
        is_published: false,
        sort_order: 1
      }
    },
    {
      name: 'partners',
      createData: {
        name: 'Test Partner Column Verification',
        slug: 'test-partner-column-verification',
        description: 'Test partner description',
        website_url: 'https://test-partner.com',
        is_published: false,
        sort_order: 1
      }
    }
  ];
  
  let crudTestsPassed = 0;
  
  for (const entity of testEntities) {
    console.log(`\n  Testing ${entity.name}...`);
    
    try {
      // Test CREATE with new columns
      const { data: createData, error: createError } = await supabase
        .from(entity.name)
        .insert(entity.createData)
        .select()
        .single();
      
      if (createError) {
        console.log(`    ❌ CREATE failed: ${createError.message}`);
        allTestsPassed = false;
        continue;
      }
      
      console.log(`    ✅ CREATE successful with new columns`);
      
      // Test UPDATE with new columns
      const { data: updateData, error: updateError } = await supabase
        .from(entity.name)
        .update({
          is_published: true,
          sort_order: 2
        })
        .eq('id', createData.id)
        .select()
        .single();
      
      if (updateError) {
        console.log(`    ❌ UPDATE failed: ${updateError.message}`);
        allTestsPassed = false;
      } else {
        console.log(`    ✅ UPDATE successful with new columns`);
        console.log(`    📋 is_published: ${updateData.is_published}, sort_order: ${updateData.sort_order}`);
      }
      
      // Clean up - delete test record
      await supabase
        .from(entity.name)
        .delete()
        .eq('id', createData.id);
      
      crudTestsPassed++;
      
    } catch (error) {
      console.log(`    ❌ Exception in ${entity.name}: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  console.log('\n🔗 Testing API endpoints...');
  console.log('='.repeat(50));
  
  // Test API endpoints (we'll make HTTP requests to localhost)
  const apiEndpoints = [
    '/api/admin/projects',
    '/api/admin/team',
    '/api/admin/services',
    '/api/admin/explore',
    '/api/admin/partners'
  ];
  
  // Note: This would require the Next.js app to be running
  console.log('📝 Note: API endpoint testing requires the Next.js app to be running');
  console.log('   Run: npm run dev or yarn dev to start the application');
  console.log('   Then test endpoints manually at:');
  
  apiEndpoints.forEach(endpoint => {
    console.log(`   - http://localhost:3000${endpoint}`);
  });
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('✅ Database connection is working');
    console.log('✅ All required columns (is_published, sort_order) exist');
    console.log('✅ CRUD operations work with new columns');
    console.log(`✅ ${crudTestsPassed}/${testEntities.length} entities tested successfully`);
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('⚠️  Please review the errors above');
  }
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Start the Next.js application: npm run dev');
  console.log('   2. Test the admin panel at: http://localhost:3000/admin');
  console.log('   3. Verify CRUD operations in the admin interface');
  
  return allTestsPassed;
}

// Run the verification
verifyDatabaseConnection().catch(console.error);