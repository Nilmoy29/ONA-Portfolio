const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 Testing Projects Access...');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('🔑 Service Key:', supabaseServiceKey ? 'Present' : 'Missing');

if (!supabaseUrl) {
  console.log('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

async function testWithAnonKey() {
  if (!supabaseAnonKey) {
    console.log('⚠️ Anon key missing, skipping anon client test');
    return;
  }

  console.log('\n1️⃣ Testing with anonymous client (public access)...');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabaseAnon
      .from('projects')
      .select('id, title, slug, is_published')
      .eq('is_published', true)
      .limit(3);
    
    if (error) {
      console.error('❌ Anon client error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('✅ Anon client success - Found', data?.length || 0, 'published projects');
      if (data && data.length > 0) {
        console.log('📋 Sample project:', data[0]);
      }
    }
  } catch (error) {
    console.error('❌ Anon client unexpected error:', error);
  }
}

async function testWithServiceKey() {
  if (!supabaseServiceKey) {
    console.log('⚠️ Service key missing, skipping service client test');
    return;
  }

  console.log('\n2️⃣ Testing with service role client...');
  const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabaseService
      .from('projects')
      .select('id, title, slug, is_published')
      .limit(3);
    
    if (error) {
      console.error('❌ Service client error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('✅ Service client success - Found', data?.length || 0, 'total projects');
      const published = data?.filter(p => p.is_published).length || 0;
      const unpublished = data?.filter(p => !p.is_published).length || 0;
      console.log(`📊 Published: ${published}, Unpublished: ${unpublished}`);
    }
  } catch (error) {
    console.error('❌ Service client unexpected error:', error);
  }
}

async function testWithCategories() {
  if (!supabaseAnonKey) {
    console.log('⚠️ Anon key missing, skipping categories test');
    return;
  }

  console.log('\n3️⃣ Testing categories access...');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabaseAnon
      .from('categories')
      .select('id, name, slug')
      .limit(5);
    
    if (error) {
      console.error('❌ Categories error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('✅ Categories access success - Found', data?.length || 0, 'categories');
      if (data && data.length > 0) {
        data.forEach(cat => console.log(`📂 ${cat.name} (${cat.slug})`));
      }
    }
  } catch (error) {
    console.error('❌ Categories unexpected error:', error);
  }
}

async function testJoinQuery() {
  if (!supabaseAnonKey) {
    console.log('⚠️ Anon key missing, skipping join query test');
    return;
  }

  console.log('\n4️⃣ Testing projects with categories join...');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabaseAnon
      .from('projects')
      .select(`
        id,
        title,
        slug,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('is_published', true)
      .limit(2);
    
    if (error) {
      console.error('❌ Join query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('✅ Join query success - Found', data?.length || 0, 'projects with categories');
      if (data && data.length > 0) {
        data.forEach(project => {
          console.log(`📋 ${project.title} -> Category: ${project.categories?.name || 'None'}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Join query unexpected error:', error);
  }
}

async function main() {
  await testWithAnonKey();
  await testWithServiceKey();
  await testWithCategories();
  await testJoinQuery();
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 If you see RLS errors, you may need to:');
  console.log('1. Check RLS policies for public access');
  console.log('2. Ensure projects.is_published = true for public visibility');
  console.log('3. Check if environment variables are properly set');
}

main().catch(console.error); 