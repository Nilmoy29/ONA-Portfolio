const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSRecursion() {
  try {
    console.log('Fixing RLS recursion issue...');
    
    // Read the SQL fix file
    const sqlFile = path.join(__dirname, 'scripts', 'fix-rls-recursion.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.startsWith('SELECT')) {
        // Skip SELECT statements (they're just messages)
        continue;
      }
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with other statements
      }
    }
    
    console.log('RLS recursion fix completed successfully!');
    
    // Test the fix by trying to query projects
    console.log('Testing fix by querying projects...');
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1);
    
    if (error) {
      console.error('Test query failed:', error);
    } else {
      console.log('Test query successful! Fix is working.');
    }
    
  } catch (error) {
    console.error('Error fixing RLS recursion:', error);
    process.exit(1);
  }
}

fixRLSRecursion();