const { createClient } = require('@supabase/supabase-js');

// Mock environment variables for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

console.log('🧪 Testing Partner CRUD Operations...');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Service Key:', supabaseServiceKey ? 'Present' : 'Missing');

if (!supabaseUrl.includes('supabase.co') || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
  console.log('Please set:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPartnersCRUD() {
  try {
    console.log('\n1️⃣ Testing READ - Fetching existing partners...');
    const { data: existingPartners, error: readError } = await supabase
      .from('partners')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('❌ Read Error:', readError);
      return;
    }
    
    console.log('✅ Read Success - Found', existingPartners?.length || 0, 'partners');
    if (existingPartners?.length > 0) {
      console.log('📋 Sample partner:', {
        id: existingPartners[0].id,
        name: existingPartners[0].name,
        slug: existingPartners[0].slug
      });
    }

    console.log('\n2️⃣ Testing CREATE - Adding new partner...');
    const testPartner = {
      name: 'Test Partner ' + Date.now(),
      slug: 'test-partner-' + Date.now(),
      description: 'Test partner for CRUD verification',
      partnership_type: 'client',
      location: 'Test City',
      website_url: 'https://test.com',
      is_published: true,
      sort_order: 999
    };

    const { data: newPartner, error: createError } = await supabase
      .from('partners')
      .insert(testPartner)
      .select()
      .single();

    if (createError) {
      console.error('❌ Create Error:', createError);
      return;
    }

    console.log('✅ Create Success - Partner ID:', newPartner.id);

    console.log('\n3️⃣ Testing UPDATE - Modifying partner...');
    const { data: updatedPartner, error: updateError } = await supabase
      .from('partners')
      .update({
        description: 'Updated test description',
        location: 'Updated City'
      })
      .eq('id', newPartner.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update Error:', updateError);
      return;
    }

    console.log('✅ Update Success - Updated description:', updatedPartner.description);

    console.log('\n4️⃣ Testing DELETE - Removing test partner...');
    const { error: deleteError } = await supabase
      .from('partners')
      .delete()
      .eq('id', newPartner.id);

    if (deleteError) {
      console.error('❌ Delete Error:', deleteError);
      return;
    }

    console.log('✅ Delete Success - Test partner removed');

    console.log('\n🎉 All Partner CRUD operations working correctly!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function testTableStructure() {
  try {
    console.log('\n🔍 Testing Partners Table Structure...');
    
    // Test if we can query the table structure
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Table access error:', error);
      return;
    }
    
    console.log('✅ Partners table is accessible');
    
    if (data && data.length > 0) {
      console.log('📋 Available columns:', Object.keys(data[0]));
    }
    
  } catch (error) {
    console.error('❌ Structure test error:', error);
  }
}

async function main() {
  await testTableStructure();
  await testPartnersCRUD();
}

main().catch(console.error); 