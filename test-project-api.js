async function testProjectAPI() {
  const testData = {
    title: "Test Project",
    slug: "test-project-" + Date.now(),
    description: "A test project to debug the API issue",
    content: "Test content",
    category_id: null,
    featured_image_url: "",
    project_type: "Test",
    client_name: "Test Client",
    location: "Test Location",
    completion_date: "",
    project_status: "planning",
    is_published: false,
    sort_order: 0,
    gallery_images: [],
    features: [],
    team_member_ids: []
  };

  console.log('🔍 Testing POST /api/admin/projects');
  console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Response body (raw):', responseText);

    if (responseText) {
      try {
        const responseData = JSON.parse(responseText);
        console.log('📥 Response body (parsed):', responseData);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError.message);
      }
    } else {
      console.error('❌ Empty response body');
    }

  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testProjectAPI(); 