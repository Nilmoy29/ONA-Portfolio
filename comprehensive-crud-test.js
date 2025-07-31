const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oscicdyjpnnykyqpvuys.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'
);

async function testCRUDOperations() {
  console.log('🧪 Starting comprehensive CRUD tests...\n');
  
  // Test entities to verify
  const entities = [
    {
      name: 'projects',
      createData: {
        title: 'Test Project CRUD',
        slug: 'test-project-crud',
        description: 'Test project for CRUD operations',
        client: 'Test Client',
        status: 'planning',
        is_published: false
      },
      updateData: {
        title: 'Updated Test Project CRUD',
        description: 'Updated test description',
        is_published: true
      }
    },
    {
      name: 'team_members',
      createData: {
        name: 'Test Team Member CRUD',
        slug: 'test-team-member-crud',
        position: 'Test Position',
        bio: 'Test bio for team member',
        email: 'test-crud@example.com',
        specializations: [],
        is_published: false
      },
      updateData: {
        name: 'Updated Test Team Member CRUD',
        position: 'Updated Position',
        is_published: true
      }
    },
    {
      name: 'services',
      createData: {
        name: 'Test Service CRUD',
        slug: 'test-service-crud',
        description: 'Test service for CRUD operations',
        service_type: 'design',
        is_published: false
      },
      updateData: {
        name: 'Updated Test Service CRUD',
        description: 'Updated service description',
        is_published: true
      }
    },
    {
      name: 'explore_content',
      createData: {
        title: 'Test Explore Content CRUD',
        slug: 'test-explore-content-crud',
        subtitle: 'Test subtitle',
        description: 'Test description',
        content: 'Test content for explore section',
        author: 'Test Author',
        is_published: false
      },
      updateData: {
        title: 'Updated Test Explore Content CRUD',
        content: 'Updated test content',
        is_published: true
      }
    },
    {
      name: 'partners',
      createData: {
        name: 'Test Partner',
        slug: 'test-partner',
        description: 'Test partner description',
        website_url: 'https://test-partner.com',
        is_published: false
      },
      updateData: {
        name: 'Updated Test Partner',
        description: 'Updated partner description',
        is_published: true
      }
    },
    {
      name: 'contact_submissions',
      createData: {
        name: 'Test Contact CRUD',
        email: 'test-crud@contact.com',
        message: 'Test contact message for CRUD',
        subject: 'Test Subject',
        inquiry_type: 'general',
        status: 'new'
      },
      updateData: {
        status: 'read',
        admin_notes: 'Test admin notes'
      }
    }
  ];

  let testResults = [];

  for (const entity of entities) {
    console.log(`\n📋 Testing ${entity.name}...`);
    
    try {
      // CREATE test
      console.log(`  Creating ${entity.name}...`);
      const { data: createData, error: createError } = await supabase
        .from(entity.name)
        .insert(entity.createData)
        .select()
        .single();
      
      if (createError) {
        console.log(`  ❌ CREATE failed: ${createError.message}`);
        testResults.push({ entity: entity.name, create: false, read: false, update: false, delete: false });
        continue;
      }
      
      console.log(`  ✅ CREATE successful: ${createData.id}`);
      
      // READ test
      console.log(`  Reading ${entity.name}...`);
      const { data: readData, error: readError } = await supabase
        .from(entity.name)
        .select('*')
        .eq('id', createData.id)
        .single();
      
      if (readError) {
        console.log(`  ❌ READ failed: ${readError.message}`);
        testResults.push({ entity: entity.name, create: true, read: false, update: false, delete: false });
        continue;
      }
      
      console.log(`  ✅ READ successful`);
      
      // UPDATE test
      console.log(`  Updating ${entity.name}...`);
      const { data: updateData, error: updateError } = await supabase
        .from(entity.name)
        .update(entity.updateData)
        .eq('id', createData.id)
        .select()
        .single();
      
      if (updateError) {
        console.log(`  ❌ UPDATE failed: ${updateError.message}`);
        testResults.push({ entity: entity.name, create: true, read: true, update: false, delete: false });
        continue;
      }
      
      console.log(`  ✅ UPDATE successful`);
      
      // DELETE test
      console.log(`  Deleting ${entity.name}...`);
      const { error: deleteError } = await supabase
        .from(entity.name)
        .delete()
        .eq('id', createData.id);
      
      if (deleteError) {
        console.log(`  ❌ DELETE failed: ${deleteError.message}`);
        testResults.push({ entity: entity.name, create: true, read: true, update: true, delete: false });
        continue;
      }
      
      console.log(`  ✅ DELETE successful`);
      
      testResults.push({ entity: entity.name, create: true, read: true, update: true, delete: true });
      
    } catch (error) {
      console.log(`  ❌ Exception in ${entity.name}: ${error.message}`);
      testResults.push({ entity: entity.name, create: false, read: false, update: false, delete: false });
    }
  }

  // Summary
  console.log('\n\n📊 CRUD Test Summary:');
  console.log('='.repeat(60));
  
  testResults.forEach(result => {
    const createStatus = result.create ? '✅' : '❌';
    const readStatus = result.read ? '✅' : '❌';
    const updateStatus = result.update ? '✅' : '❌';
    const deleteStatus = result.delete ? '✅' : '❌';
    
    console.log(`${result.entity.padEnd(20)} | C:${createStatus} R:${readStatus} U:${updateStatus} D:${deleteStatus}`);
  });

  // Overall status
  const allPassed = testResults.every(r => r.create && r.read && r.update && r.delete);
  const totalEntities = testResults.length;
  const passedEntities = testResults.filter(r => r.create && r.read && r.update && r.delete).length;
  
  console.log('='.repeat(60));
  console.log(`Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
  console.log(`Passed: ${passedEntities}/${totalEntities} entities`);
  
  if (allPassed) {
    console.log('\n🎉 All CRUD operations are working correctly!');
  } else {
    console.log('\n⚠️ Some CRUD operations need attention.');
  }
}

testCRUDOperations().catch(console.error);