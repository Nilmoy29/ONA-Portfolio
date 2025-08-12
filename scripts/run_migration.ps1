$ErrorActionPreference = "Stop"

# Supabase project reference and access token (from MCP config)
$ref = "oscicdyjpnnykyqpvuys"
$token = "sbp_627527950f6dc5eb1ccc41c0cc7944a83bd51b85"

# Read SQL from the migration file
$sql = Get-Content -Raw -Path "scripts/add-project-consultants.sql"

# Prepare JSON payload
$body = @{ query = $sql } | ConvertTo-Json -Compress

# Call Supabase SQL API
$response = Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.supabase.com/v1/projects/$ref/sql" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body

$response | ConvertTo-Json -Depth 5



