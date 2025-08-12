# Database Setup Script for ONA Portfolio
# This script helps you set up the complete database schema

Write-Host "🚀 ONA Portfolio Database Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "scripts/safe-database-setup.sql")) {
    Write-Host "❌ Error: safe-database-setup.sql not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Database Setup Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to your Supabase Dashboard:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Select your ONA Portfolio project" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to SQL Editor (left sidebar)" -ForegroundColor White
Write-Host ""
Write-Host "4. Copy the contents of scripts/safe-database-setup.sql" -ForegroundColor White
Write-Host ""
Write-Host "5. Paste and run the SQL script" -ForegroundColor White
Write-Host ""
Write-Host "6. Verify the setup by checking the verification queries at the end" -ForegroundColor White
Write-Host ""

# Show the SQL file location
$sqlPath = (Get-Item "scripts/safe-database-setup.sql").FullName
Write-Host "📁 SQL Script Location:" -ForegroundColor Yellow
Write-Host "   $sqlPath" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛡️ This is the SAFE version that:" -ForegroundColor Green
Write-Host "   - Drops existing policies before creating new ones" -ForegroundColor White
Write-Host "   - Handles existing tables gracefully" -ForegroundColor White
Write-Host "   - Adds missing columns without errors" -ForegroundColor White
Write-Host "   - Won't fail if policies already exist" -ForegroundColor White
Write-Host ""

# Ask if user wants to see the SQL content
$showSQL = Read-Host "Would you like to see the SQL content? (y/n)"
if ($showSQL -eq "y" -or $showSQL -eq "Y") {
    Write-Host "📄 SQL Content:" -ForegroundColor Yellow
    Write-Host "===============" -ForegroundColor Yellow
    Get-Content "scripts/safe-database-setup.sql" | ForEach-Object {
        Write-Host $_ -ForegroundColor White
    }
}

Write-Host ""
Write-Host "✅ Setup complete! After running the SQL script:" -ForegroundColor Green
Write-Host "   - Your database will have all necessary tables" -ForegroundColor White
Write-Host "   - The new consultant fields will be available" -ForegroundColor White
Write-Host "   - RLS policies will be properly configured" -ForegroundColor White
Write-Host "   - Sample data will be inserted" -ForegroundColor White
Write-Host "   - Existing data will be preserved" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Run the safe SQL script in Supabase" -ForegroundColor White
Write-Host "   2. Test the project form again" -ForegroundColor White
Write-Host "   3. The empty error response should be resolved" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
