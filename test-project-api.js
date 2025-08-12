// Simple test script to debug the project API
async function testProjectAPI() {
  try {
    console.log('🧪 Testing Project API...')
    
    const testData = {
      title: 'Test Project',
      slug: 'test-project-' + Date.now(),
      description: 'This is a test project',
      content: 'Detailed test project content',
      project_status: 'planning',
      is_published: false,
      sort_order: 0
    }
    
    console.log('📤 Sending test data:', testData)
    
    const response = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response ok:', response.ok)
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('📥 Raw response text:', responseText)
    
    if (responseText.trim()) {
      try {
        const responseData = JSON.parse(responseText)
        console.log('📥 Parsed response data:', responseData)
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError)
      }
    } else {
      console.log('📥 Empty response body')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testProjectAPI = testProjectAPI
  console.log('🧪 Test function available as window.testProjectAPI()')
} else {
  // Node.js environment
  testProjectAPI()
} 