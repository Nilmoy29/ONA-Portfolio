# Database Verification Script for ONA Portfolio
# This script helps verify that the database setup is working correctly

Write-Host "🔍 ONA Portfolio Database Verification" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if development server is running
Write-Host "📡 Checking development server..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/db-health-check" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Development server is running on port 3002" -ForegroundColor Green
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "📊 Database Health Status: $($healthData.status)" -ForegroundColor White
        
        if ($healthData.status -eq "success") {
            Write-Host "✅ Database connection is working!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Database has some issues:" -ForegroundColor Yellow
            $healthData.recommendations.issues | ForEach-Object {
                Write-Host "   - $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "⚠️ Development server responded with status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Could not connect to development server" -ForegroundColor Red
    Write-Host "   Make sure to run 'npm run dev' first" -ForegroundColor White
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Testing Project API..." -ForegroundColor Yellow

try {
    $testData = @{
        title = "Test Project $(Get-Date -Format 'yyyyMMdd-HHmmss')"
        slug = "test-project-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        description = "This is a test project to verify the database setup"
        content = "Detailed test project content"
        project_status = "planning"
        is_published = $false
        sort_order = 0
        architecture_consultant = "Test Architecture Consultant"
        engineering_consultant = "Test Engineering Consultant"
    }
    
    Write-Host "📤 Sending test data to project API..." -ForegroundColor White
    
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/admin/projects" -Method POST -Body ($testData | ConvertTo-Json -Depth 10) -ContentType "application/json" -TimeoutSec 30
    
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ Project API test successful!" -ForegroundColor Green
        $responseData = $response.Content | ConvertFrom-Json
        Write-Host "📥 Created project ID: $($responseData.data.id)" -ForegroundColor White
        
        # Test if we can retrieve the project
        Write-Host "🔄 Testing project retrieval..." -ForegroundColor White
        $getResponse = Invoke-WebRequest -Uri "http://localhost:3002/api/admin/projects" -Method GET -TimeoutSec 10
        
        if ($getResponse.StatusCode -eq 200) {
            Write-Host "✅ Project retrieval successful!" -ForegroundColor Green
            $projectsData = $getResponse.Content | ConvertFrom-Json
            Write-Host "📊 Total projects in database: $($projectsData.pagination.total)" -ForegroundColor White
        } else {
            Write-Host "⚠️ Project retrieval failed with status: $($getResponse.StatusCode)" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Project API test failed with status: $($response.StatusCode)" -ForegroundColor Red
        Write-Host "📥 Response: $($response.Content)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Project API test failed:" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "📥 Error Response: $errorContent" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "📋 Verification Summary:" -ForegroundColor Yellow
Write-Host "=======================" -ForegroundColor Yellow
Write-Host "✅ If all tests passed: Database is properly set up!" -ForegroundColor Green
Write-Host "❌ If tests failed: Check the error messages above" -ForegroundColor Red
Write-Host ""
Write-Host "🔄 To fix issues:" -ForegroundColor Yellow
Write-Host "   1. Run the database setup script in Supabase" -ForegroundColor White
Write-Host "   2. Check your environment variables" -ForegroundColor White
Write-Host "   3. Verify Supabase connection settings" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
