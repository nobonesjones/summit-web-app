# Supabase Migrations

This directory contains database migrations for the Summit Web App.

## Business Plans RLS Migration

The `20240324_business_plans_rls.sql` migration sets up Row Level Security (RLS) for the business plans table. This ensures that users can only access their own business plans, with some exceptions for public, completed plans.

### Policies Overview

1. **SELECT Policy**: Users can view:
   - Their own business plans
   - Public business plans that are marked as completed

2. **INSERT Policy**: Users can only create business plans for themselves

3. **UPDATE Policy**: Users can only update their own business plans

4. **DELETE Policy**: Users can only delete their own business plans

### Debugging Tools

The migration includes two helpful debugging tools:

1. `check_business_plan_access(plan_id UUID)` function:
   - Checks if the current user has access to a specific plan
   - Returns boolean

2. `business_plans_access_debug` view:
   - Shows access levels for all business plans
   - Helps diagnose permission issues

### Testing the Policies

To test the policies in the Supabase SQL editor:

```sql
-- Test access to a specific plan
SELECT check_business_plan_access('plan-uuid-here');

-- View access debug information
SELECT * FROM business_plans_access_debug;

-- Test policies with specific user
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-id-here"}';
SELECT * FROM business_plans;
```

### Security Notes

- All policies use `auth.uid()` to identify the current user
- The `check_business_plan_access` function is marked as `SECURITY DEFINER`
- The debug view uses `security_invoker = true` for safe access 