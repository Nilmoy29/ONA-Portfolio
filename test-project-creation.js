// Test script to debug project creation issue
const testProjectCreation = async () => {
  const testData = {
    title: "Test Project Debug",
    slug: "test-project-debug",
    description: "Testing project creation with debugging",
    project_status: "planning",
    is_published: false,
    sort_order: 0,
    gallery_images: []
  };

  console.log('🧪 Testing project creation...');
  console.log('📝 Test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3001/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);

    const responseData = await response.json();
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Project created successfully!');
      console.log('🆔 Project ID:', responseData.data.id);
    } else {
      console.error('❌ Failed to create project:', responseData.error);
    }
  } catch (error) {
    console.error('💥 Network/fetch error:', error);
  }
};

// Test with minimal data
const testMinimalProject = async () => {
  const minimalData = {
    title: "Minimal Test",
    slug: "minimal-test",
    description: "Minimal test description"
  };

  console.log('\n🧪 Testing minimal project creation...');
  console.log('📝 Minimal data:', JSON.stringify(minimalData, null, 2));

  try {
    const response = await fetch('http://localhost:3001/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData),
    });

    console.log('📥 Response status:', response.status);
    const responseData = await response.json();
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Minimal project created successfully!');
    } else {
      console.error('❌ Minimal project failed:', responseData.error);
    }
  } catch (error) {
    console.error('💥 Minimal test error:', error);
  }
};

// Test with form data that matches the UI
const testFormDataProject = async () => {
  const formData = {
    title: "Form Data Test Project",
    slug: "form-data-test-project", 
    description: "Test description matching UI form",
    content: "",
    category_id: "",
    featured_image_url: "",
    project_type: "",
    client_name: "",
    location: "",
    completion_date: "",
    project_status: "planning",
    is_published: false,
    sort_order: 0,
    gallery_images: []
  };

  console.log('\n🧪 Testing form data project creation...');
  console.log('📝 Form data:', JSON.stringify(formData, null, 2));

  try {
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3001/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const endTime = Date.now();
    console.log('⏱️ Request took:', endTime - startTime, 'ms');
    console.log('📥 Response status:', response.status);

    const responseData = await response.json();
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Form data project created successfully!');
    } else {
      console.error('❌ Form data project failed:', responseData.error);
    }
  } catch (error) {
    console.error('💥 Form data test error:', error);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🔬 Starting CRUD debugging tests...\n');
  
  await testMinimalProject();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  await testProjectCreation();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  await testFormDataProject();
  
  console.log('\n🏁 All tests completed!');
};

// Export for Node.js if running in Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    testProjectCreation, 
    testMinimalProject, 
    testFormDataProject, 
    runAllTests 
  };
}

// Run if in browser console
if (typeof window !== 'undefined') {
  window.debugProjectCreation = {
    testProjectCreation,
    testMinimalProject, 
    testFormDataProject,
    runAllTests
  };
  
  console.log('🔧 Debug functions available:');
  console.log('  debugProjectCreation.testMinimalProject()');
  console.log('  debugProjectCreation.testProjectCreation()');
  console.log('  debugProjectCreation.testFormDataProject()');
  console.log('  debugProjectCreation.runAllTests()');
} 