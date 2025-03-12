-- Step 1: Check if RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'business_plans'
        AND rowsecurity = true
    ) THEN
        -- Enable RLS on the business_plans table
        ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Row Level Security has been enabled on business_plans table';
    END IF;
END
$$;

-- Step 2: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can create their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can update their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can delete their own business plans" ON public.business_plans;

-- Step 3: Create SELECT policy
-- Users can only view their own business plans
CREATE POLICY "Users can view their own business plans"
ON public.business_plans
FOR SELECT
USING (
    auth.uid() = user_id
    OR (
        is_public = true -- Allow viewing of public business plans
        AND status = 'completed' -- Only if they're completed
    )
);

-- Step 4: Create INSERT policy
-- Users can only create business plans for themselves
CREATE POLICY "Users can create their own business plans"
ON public.business_plans
FOR INSERT
WITH CHECK (
    auth.uid() = user_id
);

-- Step 5: Create UPDATE policy
-- Users can only update their own business plans
CREATE POLICY "Users can update their own business plans"
ON public.business_plans
FOR UPDATE
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- Step 6: Create DELETE policy
-- Users can only delete their own business plans
CREATE POLICY "Users can delete their own business plans"
ON public.business_plans
FOR DELETE
USING (
    auth.uid() = user_id
);

-- Step 7: Verify policies are in place
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'business_plans'
ORDER BY policyname;

-- Step 8: Add helpful comments to the table and policies
COMMENT ON TABLE public.business_plans IS 'Stores user business plans with RLS enabled - users can only access their own plans';

-- Step 9: Create a function to check access
CREATE OR REPLACE FUNCTION public.check_business_plan_access(plan_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.business_plans
        WHERE id = plan_id
        AND (
            user_id = auth.uid()
            OR (
                is_public = true
                AND status = 'completed'
            )
        )
    );
END;
$$;

-- Step 10: Create a view for debugging RLS
CREATE OR REPLACE VIEW business_plans_access_debug AS
SELECT
    bp.id,
    bp.title,
    bp.user_id,
    bp.is_public,
    bp.status,
    auth.uid() = bp.user_id as is_owner,
    CASE
        WHEN auth.uid() = bp.user_id THEN 'Owner'
        WHEN bp.is_public AND bp.status = 'completed' THEN 'Public Access'
        ELSE 'No Access'
    END as access_level,
    bp.created_at,
    bp.updated_at
FROM
    public.business_plans bp;

-- Grant appropriate permissions
ALTER VIEW business_plans_access_debug SET (security_invoker = true);