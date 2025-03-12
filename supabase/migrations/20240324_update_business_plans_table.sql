-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.business_plans CASCADE;

-- Create the business_plans table with updated structure
CREATE TABLE public.business_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    business_idea TEXT,
    location TEXT,
    target_market TEXT,
    solution TEXT,
    business_stage TEXT,
    team_size INTEGER,
    revenue_model TEXT,
    funding_needs TEXT,
    growth_goals TEXT,
    marketing_strategy TEXT,
    key_resources TEXT,
    additional_notes TEXT,
    status TEXT DEFAULT 'draft',
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add table comment
COMMENT ON TABLE public.business_plans IS 'Stores business plans created by users';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_plans_updated_at
    BEFORE UPDATE ON public.business_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can insert their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can update their own business plans" ON public.business_plans;
DROP POLICY IF EXISTS "Users can delete their own business plans" ON public.business_plans;

-- Create basic RLS policies
CREATE POLICY "Users can view their own business plans"
    ON public.business_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business plans"
    ON public.business_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business plans"
    ON public.business_plans
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business plans"
    ON public.business_plans
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_business_plans_user_id ON public.business_plans(user_id);
CREATE INDEX idx_business_plans_status ON public.business_plans(status);
CREATE INDEX idx_business_plans_created_at ON public.business_plans(created_at);

-- Create a function to get a user's business plans
CREATE OR REPLACE FUNCTION public.get_user_business_plans(user_id UUID)
RETURNS SETOF public.business_plans
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.business_plans
    WHERE user_id = user_id
    ORDER BY created_at DESC;
$$; 