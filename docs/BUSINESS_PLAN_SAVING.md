# Business Plan Saving Troubleshooting Guide

This document provides guidance on troubleshooting and fixing issues with saving business plans to the database.

## Common Issues and Solutions

### 1. Database Schema Issues

If business plans aren't saving correctly, the first thing to check is the database schema.

Run the following script to check and fix the database schema:

```bash
node scripts/fix-business-plan-save.js
```

This script will:
- Check if the `business_plans` table exists and create it if it doesn't
- Verify all required columns are present
- Check and create Row Level Security (RLS) policies
- Test business plan creation with a service role

### 2. Authentication Issues

Business plans can only be saved by authenticated users. Common authentication issues include:

- User not signed in
- Authentication token expired
- User ID not correctly passed to the save function

To debug authentication issues:

1. Check browser console for authentication errors
2. Verify the user is authenticated before attempting to save
3. Ensure the user ID is correctly set in the business plan data

### 3. Data Format Issues

The business plan data must be in the correct format for saving to Supabase. Common data format issues include:

- Missing required fields (title, business_idea, location, category)
- Incorrect data types
- Malformed sections array

To fix data format issues, we've created an enhanced business plan service with better validation and type safety:

```typescript
import { useEnhancedBusinessPlanService } from '@/lib/services/enhancedBusinessPlanService';

// In your component
const businessPlanService = useEnhancedBusinessPlanService();

// When saving
await businessPlanService.saveBusinessPlan(businessPlan);
```

### 4. Row Level Security (RLS) Issues

Supabase uses Row Level Security to control access to data. If RLS policies are not set up correctly, users may not be able to save business plans.

To check and fix RLS policies:

1. Run the fix script: `node scripts/fix-business-plan-save.js`
2. Verify the following policies exist for the `business_plans` table:
   - Users can view their own business plans
   - Users can create their own business plans
   - Users can update their own business plans
   - Users can delete their own business plans

### 5. Error Handling Issues

Poor error handling can make it difficult to diagnose saving issues. The enhanced business plan service includes:

- Detailed error logging
- Retry logic for transient errors
- Fallback to local storage when Supabase saving fails
- User-friendly error messages

## Implementing the Enhanced Business Plan Service

To use the enhanced business plan service:

1. Update imports in your components:

```typescript
// Replace this:
import { useBusinessPlanService } from '@/lib/services/businessPlanService';

// With this:
import { useEnhancedBusinessPlanService } from '@/lib/services/enhancedBusinessPlanService';
```

2. Update the hook usage:

```typescript
// Replace this:
const businessPlanService = useBusinessPlanService();

// With this:
const businessPlanService = useEnhancedBusinessPlanService();
```

3. Take advantage of the additional features:

```typescript
const { 
  saveBusinessPlan, 
  getBusinessPlans, 
  getBusinessPlanById,
  isSaving,  // Loading state
  saveError  // Error state
} = useEnhancedBusinessPlanService();
```

## Debugging Tools

We've created several debugging tools to help diagnose business plan saving issues:

1. `scripts/debug-business-plan-save.js` - Checks the database and attempts to create a test business plan
2. `scripts/fix-business-plan-save.js` - Diagnoses and fixes common issues with business plan saving
3. `scripts/create-execute-sql-function.js` - Creates the execute_sql function needed for advanced database operations

Run these scripts with Node.js:

```bash
node scripts/debug-business-plan-save.js
node scripts/fix-business-plan-save.js
node scripts/create-execute-sql-function.js
```

## Manual Database Checks

If you need to manually check the database, you can use the Supabase dashboard:

1. Go to https://app.supabase.com/project/_/editor
2. Run the following SQL query to check the business_plans table:

```sql
SELECT * FROM public.business_plans ORDER BY created_at DESC LIMIT 10;
```

3. Check RLS policies:

```sql
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'business_plans';
```

## Contact Support

If you continue to experience issues after trying these solutions, please contact the development team with:

1. The specific error message from the browser console
2. Steps to reproduce the issue
3. User ID of the affected user
4. Business plan data being saved (with sensitive information removed) 