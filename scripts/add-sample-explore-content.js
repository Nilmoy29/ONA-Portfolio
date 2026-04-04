const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSampleExploreContent() {
  console.log('🔧 Adding sample explore content to the database...\n');

  try {
    // Sample explore content data
    const sampleContent = [
      {
        title: 'Sustainable Architecture Trends',
        slug: 'sustainable-architecture-trends',
        content_type: 'article',
        content: 'Modern architecture is increasingly focused on sustainability and environmental responsibility. This comprehensive guide explores the latest trends in green building practices, renewable energy integration, and eco-friendly materials that are shaping the future of architectural design.',
        excerpt: 'Exploring the latest trends in sustainable architecture and green building practices.',
        description: 'A deep dive into sustainable architecture trends and their impact on modern design.',
        author: 'Sarah Johnson',
        is_published: true,
        featured_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
        sort_order: 1
      },
      {
        title: 'Urban Design Philosophy',
        slug: 'urban-design-philosophy',
        content_type: 'article',
        content: 'Our approach to urban design is rooted in community engagement and environmental stewardship. We believe that successful urban spaces should reflect the cultural heritage of their communities while embracing contemporary innovation and sustainable practices.',
        excerpt: 'Understanding our philosophy and approach to contemporary urban design.',
        description: 'Exploring our core principles and methodology for creating meaningful urban spaces.',
        author: 'Michael Chen',
        is_published: true,
        featured_image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        sort_order: 2
      },
      {
        title: 'Behind the Scenes: Design Process',
        slug: 'behind-the-scenes-design-process',
        content_type: 'photography',
        content: 'A visual journey through our comprehensive design process, from initial concept sketches to final construction. This photographic documentation showcases the iterative nature of architectural design and the collaborative effort required to bring visions to life.',
        excerpt: 'Visual documentation of our comprehensive design process.',
        description: 'A photographic exploration of our design methodology and creative process.',
        author: 'Emily Rodriguez',
        is_published: true,
        featured_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
        sort_order: 3
      },
      {
        title: 'Cultural Heritage in Modern Design',
        slug: 'cultural-heritage-modern-design',
        content_type: 'research',
        content: 'This research explores how traditional cultural elements can be thoughtfully integrated into contemporary architectural design. We examine case studies from around the world and present methodologies for preserving cultural identity while embracing modern innovation.',
        excerpt: 'Research on integrating cultural heritage elements into contemporary architecture.',
        description: 'A comprehensive study of cultural preservation in modern architectural design.',
        author: 'Sarah Johnson',
        is_published: true,
        featured_image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
        sort_order: 4
      },
      {
        title: 'Artistic Expression in Architecture',
        slug: 'artistic-expression-architecture',
        content_type: 'artwork',
        content: 'Architecture as an art form: exploring the intersection of structural engineering and artistic expression. This collection showcases how architectural elements can transcend their functional purpose to become powerful artistic statements.',
        excerpt: 'Exploring the artistic and creative aspects of architectural design.',
        description: 'A visual exploration of architecture as an artistic medium.',
        author: 'Michael Chen',
        is_published: true,
        featured_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        sort_order: 5
      }
    ];

    console.log(`📝 Inserting ${sampleContent.length} sample explore content items...\n`);

    for (let i = 0; i < sampleContent.length; i++) {
      const item = sampleContent[i];
      console.log(`⏳ Inserting: ${item.title}`);
      
      const { data, error } = await supabase
        .from('explore_content')
        .insert(item)
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log(`⚠️  Item already exists: ${item.title}`);
        } else {
          console.error(`❌ Error inserting ${item.title}:`, error.message);
        }
      } else {
        console.log(`✅ Successfully inserted: ${item.title} (ID: ${data.id})`);
      }
    }

    console.log('\n🎉 Sample explore content insertion completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit http://localhost:3000/explore');
    console.log('2. You should now see the sample content displayed');
    console.log('3. Test the filtering by content type');

  } catch (error) {
    console.error('❌ Failed to add sample explore content:', error);
  }
}

// Run the function
addSampleExploreContent();
