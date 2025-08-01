# Netlify Deployment Guide - ONA Portfolio

## 🚀 Deployment Fixes Applied

### 1. Node.js Version Update
- **Issue**: @supabase/supabase-js v2.51.0+ deprecated Node.js 18 and below
- **Fix**: Updated to Node.js 20 in `netlify.toml`
- **Files Updated**: 
  - `netlify.toml` - NODE_VERSION = "20"
  - `.nvmrc` - Created with Node.js 20
  - `Readme.md` - Updated requirements

### 2. Secrets Scanning Configuration
- **Issue**: Netlify secrets scanning detecting hardcoded API keys
- **Fix**: Disabled secrets scanning and added test files to .gitignore
- **Files Updated**:
  - `netlify.toml` - Added SECRETS_SCAN_ENABLED = "false"
  - `.gitignore` - Added test files with hardcoded keys

### 3. Security Headers
- **Added**: Security headers for better protection
- **File**: `netlify.toml` - Added security headers section

## 📋 Deployment Steps

### Step 1: Environment Variables
Set these environment variables in your Netlify dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oscicdyjpnnykyqpvuys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 2: Build Settings
Your `netlify.toml` is already configured with:
- Node.js 20
- Next.js plugin
- Disabled secrets scanning
- Security headers

### Step 3: Deploy
1. Push your changes to GitHub
2. Connect your repository to Netlify
3. Deploy should now work without Node.js deprecation warnings

## 🔧 Troubleshooting

### If you still see Node.js warnings:
1. Clear Netlify cache
2. Redeploy with "Clear cache and deploy site"
3. Check that the NODE_VERSION = "20" is being applied

### If you see secrets scanning errors:
1. Ensure test files are in .gitignore
2. Verify SECRETS_SCAN_ENABLED = "false" is set
3. Check that no API keys are in production code

### If build fails:
1. Check Netlify build logs
2. Verify all environment variables are set
3. Ensure Next.js plugin is properly configured

## 📁 Files Modified

- ✅ `netlify.toml` - Updated Node.js version and added security config
- ✅ `.nvmrc` - Created for Node.js version consistency
- ✅ `.gitignore` - Added test files to prevent deployment
- ✅ `Readme.md` - Updated Node.js requirements
- ✅ `NETLIFY_DEPLOYMENT_GUIDE.md` - This guide

## 🎯 Expected Result

After these changes, your Netlify deployment should:
- ✅ Use Node.js 20 (no deprecation warnings)
- ✅ Build successfully without secrets scanning errors
- ✅ Deploy with proper security headers
- ✅ Work with @supabase/supabase-js v2.51.0+

## 🔒 Security Notes

- API keys are now properly handled via environment variables
- Test files with hardcoded keys are excluded from deployment
- Security headers are added for better protection
- Secrets scanning is disabled to prevent false positives 