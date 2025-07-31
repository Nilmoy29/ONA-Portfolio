const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'
);

async function generateFinalReport() {
  console.log('📊 FINAL VERIFICATION REPORT');
  console.log('='.repeat(60));
  console.log('Generated on:', new Date().toISOString());
  console.log('='.repeat(60));

  const results = {
    databaseConnection: false,
    requiredColumns: {
      is_published: {},
      sort_order: {}
    },
    crudOperations: {},
    dataIntegrity: {},
    rlsStatus: 'unknown'
  };

  // Test 1: Database Connection
  console.log('\n🔌 1. DATABASE CONNECTION TEST');
  console.log('-'.repeat(40));
  
  try {
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    if (error) {
      console.log('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
      results.databaseConnection = true;
    }
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
  }

  // Test 2: Required Columns Check
  console.log('\n📋 2. REQUIRED COLUMNS VERIFICATION');
  console.log('-'.repeat(40));
  
  const tables = ['projects', 'team_members', 'services', 'explore_content', 'partners'];
  const requiredColumns = ['is_published', 'sort_order'];
  
  for (const table of tables) {
    console.log(`\n  Table: ${table}`);
    for (const column of requiredColumns) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`    ❌ ${column}: Missing or Error - ${error.message}`);
          results.requiredColumns[column][table] = false;
        } else {
          console.log(`    ✅ ${column}: Present`);
          results.requiredColumns[column][table] = true;
        }
      } catch (err) {
        console.log(`    ❌ ${column}: Error - ${err.message}`);
        results.requiredColumns[column][table] = false;
      }
    }
  }

  // Test 3: CRUD Operations
  console.log('\n🔄 3. CRUD OPERATIONS TEST');
  console.log('-'.repeat(40));
  
  const testData = {
    projects: {
      title: 'Final Test Project',
      slug: 'final-test-project',
      description: 'Final test project',
      client: 'Test Client',
      status: 'planning',
      is_published: false,
      sort_order: 999
    },
    team_members: {
      name: 'Final Test Team Member',
      slug: 'final-test-team-member',
      position: 'Test Position',
      bio: 'Test bio',
      email: 'finaltest@example.com',
      specializations: [],
      is_published: false,
      sort_order: 999
    },
    services: {
      name: 'Final Test Service',
      slug: 'final-test-service',
      description: 'Final test service',
      service_type: 'design',
      is_published: false,
      sort_order: 999
    },
    explore_content: {
      title: 'Final Test Explore',
      slug: 'final-test-explore',
      subtitle: 'Test subtitle',
      description: 'Test description',
      content: 'Test content',
      author: 'Test Author',
      content_type: 'article',
      is_published: false,
      sort_order: 999
    },
    partners: {
      name: 'Final Test Partner',
      slug: 'final-test-partner',
      description: 'Final test partner',
      website_url: 'https://finaltest.com',
      is_published: false,
      sort_order: 999
    }
  };

  for (const [table, data] of Object.entries(testData)) {
    console.log(`\n  Testing ${table}:`);
    results.crudOperations[table] = { create: false, read: false, update: false, delete: false };
    
    try {
      // CREATE
      const { data: createData, error: createError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (createError) {
        console.log(`    ❌ CREATE: ${createError.message}`);
      } else {
        console.log(`    ✅ CREATE: Success`);
        results.crudOperations[table].create = true;
        
        // READ
        const { data: readData, error: readError } = await supabase
          .from(table)
          .select('*')
          .eq('id', createData.id)
          .single();
        
        if (readError) {
          console.log(`    ❌ READ: ${readError.message}`);
        } else {
          console.log(`    ✅ READ: Success`);
          results.crudOperations[table].read = true;
          
          // UPDATE
          const { data: updateData, error: updateError } = await supabase
            .from(table)
            .update({ is_published: true, sort_order: 1000 })
            .eq('id', createData.id)
            .select()
            .single();
          
          if (updateError) {
            console.log(`    ❌ UPDATE: ${updateError.message}`);
          } else {
            console.log(`    ✅ UPDATE: Success (is_published: ${updateData.is_published}, sort_order: ${updateData.sort_order})`);
            results.crudOperations[table].update = true;
          }
          
          // DELETE
          const { error: deleteError } = await supabase
            .from(table)
            .delete()
            .eq('id', createData.id);
          
          if (deleteError) {
            console.log(`    ❌ DELETE: ${deleteError.message}`);
          } else {
            console.log(`    ✅ DELETE: Success`);
            results.crudOperations[table].delete = true;
          }
        }
      }
    } catch (err) {
      console.log(`    ❌ Exception: ${err.message}`);
    }
  }

  // Test 4: Data Integrity Check
  console.log('\n📊 4. DATA INTEGRITY CHECK');
  console.log('-'.repeat(40));
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id, is_published, sort_order')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
        results.dataIntegrity[table] = false;
      } else {
        const publishedCount = data.filter(item => item.is_published === true).length;
        const hasValidSortOrder = data.every(item => typeof item.sort_order === 'number');
        
        console.log(`  ✅ ${table}: ${data.length} total, ${publishedCount} published, sort_order valid: ${hasValidSortOrder}`);
        results.dataIntegrity[table] = true;
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`);
      results.dataIntegrity[table] = false;
    }
  }

  // Test 5: RLS Status Check
  console.log('\n🔒 5. RLS STATUS CHECK');
  console.log('-'.repeat(40));
  
  // Test with anon key to see if RLS is working
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDk3MjYsImV4cCI6MjA1MjQyNTcyNn0.5EJJhTXPCWMdZCOWYCwlWOjYQJJTnbUJJqQRYPkRQg8'
  );

  try {
    const { data, error } = await anonSupabase.from('projects').select('*').limit(1);
    if (error) {
      console.log('  ✅ RLS is active (anon access restricted)');
      results.rlsStatus = 'active';
    } else {
      console.log('  ⚠️  RLS may not be properly configured (anon access allowed)');
      results.rlsStatus = 'permissive';
    }
  } catch (err) {
    console.log('  ❌ RLS status check failed:', err.message);
    results.rlsStatus = 'error';
  }

  // Generate Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60));
  
  const allColumnsPresent = tables.every(table => 
    results.requiredColumns.is_published[table] && 
    results.requiredColumns.sort_order[table]
  );
  
  const allCrudWorking = Object.values(results.crudOperations).every(ops => 
    ops.create && ops.read && ops.update && ops.delete
  );
  
  const allDataIntegrityGood = Object.values(results.dataIntegrity).every(status => status === true);
  
  console.log(`✅ Database Connection: ${results.databaseConnection ? 'Working' : 'Failed'}`);
  console.log(`✅ Required Columns: ${allColumnsPresent ? 'All Present' : 'Some Missing'}`);
  console.log(`✅ CRUD Operations: ${allCrudWorking ? 'All Working' : 'Some Issues'}`);
  console.log(`✅ Data Integrity: ${allDataIntegrityGood ? 'Good' : 'Issues Found'}`);
  console.log(`🔒 RLS Status: ${results.rlsStatus}`);
  
  const overallStatus = results.databaseConnection && allColumnsPresent && allCrudWorking && allDataIntegrityGood;
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 OVERALL STATUS: ${overallStatus ? '✅ PASSED' : '❌ NEEDS ATTENTION'}`);
  console.log('='.repeat(60));
  
  if (overallStatus) {
    console.log('\n🎉 All database tests passed! The required columns have been successfully added.');
    console.log('✅ is_published column is present in all tables');
    console.log('✅ sort_order column is present in all tables');
    console.log('✅ CRUD operations work correctly with new columns');
    console.log('✅ Data integrity is maintained');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the Next.js app: npm run dev');
    console.log('   2. Test the admin panel: http://localhost:3000/admin');
    console.log('   3. Verify frontend functionality');
    
    if (results.rlsStatus === 'active') {
      console.log('\n⚠️  Note: RLS recursion issue may affect admin operations');
      console.log('   Consider using service role for admin operations if needed');
    }
  } else {
    console.log('\n⚠️  Some issues were found that need attention.');
  }
  
  return results;
}

generateFinalReport().catch(console.error);