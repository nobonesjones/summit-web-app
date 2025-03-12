-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,
    subscription TEXT,
    credits TEXT,
    preferences JSONB DEFAULT '{}'::JSONB
);

-- Mini-Apps table - For storing mini-app configurations
CREATE TABLE IF NOT EXISTS public.app_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    config JSONB NOT NULL DEFAULT '{}'::JSONB
);

-- Questions table - For storing mini-app questions
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID REFERENCES public.app_templates(id) NOT NULL,
    text TEXT NOT NULL,
    input_type TEXT NOT NULL,
    placeholder TEXT,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    "order" INTEGER NOT NULL,
    options TEXT[] DEFAULT '{}'::TEXT[],
    next_question_logic JSONB DEFAULT '{}'::JSONB
);

-- Outputs table - For storing generated plans
CREATE TABLE IF NOT EXISTS public.outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    mini_app_id UUID REFERENCES public.app_templates(id) NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    formatted_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- Answers table - For storing user responses to questions
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    output_id UUID REFERENCES public.outputs(id) NOT NULL,
    question_id UUID REFERENCES public.questions(id) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Prompts table - For AI templates
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mini_app_id UUID REFERENCES public.app_templates(id) NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    parameters TEXT[] DEFAULT '{}'::TEXT[],
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- AI Responses table - For caching and analysis
CREATE TABLE IF NOT EXISTS public.ai_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID REFERENCES public.prompts(id) NOT NULL,
    input JSONB NOT NULL,
    output TEXT NOT NULL,
    model TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Research Data table - For storing external research
CREATE TABLE IF NOT EXISTS public.research_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    output_id UUID REFERENCES public.outputs(id) NOT NULL,
    topic TEXT NOT NULL,
    source TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    url TEXT
);

-- Business Plans table - For storing business plans
CREATE TABLE IF NOT EXISTS public.business_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    business_idea TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    sections JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes to match Convex indexes
CREATE INDEX IF NOT EXISTS idx_outputs_user_id ON public.outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_outputs_mini_app_id ON public.outputs(mini_app_id);
CREATE INDEX IF NOT EXISTS idx_outputs_created_at ON public.outputs(created_at);

CREATE INDEX IF NOT EXISTS idx_answers_output_id ON public.answers(output_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);

CREATE INDEX IF NOT EXISTS idx_prompts_mini_app_id ON public.prompts(mini_app_id);
CREATE INDEX IF NOT EXISTS idx_prompts_type ON public.prompts(type);

CREATE INDEX IF NOT EXISTS idx_ai_responses_prompt_id ON public.ai_responses(prompt_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_created_at ON public.ai_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_research_data_output_id ON public.research_data(output_id);
CREATE INDEX IF NOT EXISTS idx_research_data_topic ON public.research_data(topic);

CREATE INDEX IF NOT EXISTS idx_app_templates_slug ON public.app_templates(slug);
CREATE INDEX IF NOT EXISTS idx_app_templates_is_active ON public.app_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_questions_mini_app_id ON public.questions(mini_app_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions("order");

CREATE INDEX IF NOT EXISTS idx_business_plans_user_id ON public.business_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_created_at ON public.business_plans(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/write their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Outputs: Users can only read/write their own outputs
CREATE POLICY "Users can view their own outputs" 
ON public.outputs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outputs" 
ON public.outputs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outputs" 
ON public.outputs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outputs" 
ON public.outputs FOR DELETE 
USING (auth.uid() = user_id);

-- Business Plans: Users can only read/write their own business plans
CREATE POLICY "Users can view their own business plans" 
ON public.business_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business plans" 
ON public.business_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business plans" 
ON public.business_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business plans" 
ON public.business_plans FOR DELETE 
USING (auth.uid() = user_id);

-- App Templates: All users can view active app templates
CREATE POLICY "Anyone can view active app templates" 
ON public.app_templates FOR SELECT 
USING (is_active = true);

-- Questions: All users can view questions
CREATE POLICY "Anyone can view questions" 
ON public.questions FOR SELECT 
USING (true);

-- Answers: Users can only read/write their own answers
CREATE POLICY "Users can view their own answers" 
ON public.answers FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.outputs 
  WHERE outputs.id = answers.output_id 
  AND outputs.user_id = auth.uid()
));

CREATE POLICY "Users can create their own answers" 
ON public.answers FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.outputs 
  WHERE outputs.id = answers.output_id 
  AND outputs.user_id = auth.uid()
));

-- Prompts: All users can view prompts
CREATE POLICY "Anyone can view active prompts" 
ON public.prompts FOR SELECT 
USING (is_active = true);

-- AI Responses: Users can only read their own AI responses
CREATE POLICY "Users can view their own AI responses" 
ON public.ai_responses FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.prompts 
  WHERE prompts.id = ai_responses.prompt_id
));

-- Research Data: Users can only read their own research data
CREATE POLICY "Users can view their own research data" 
ON public.research_data FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.outputs 
  WHERE outputs.id = research_data.output_id 
  AND outputs.user_id = auth.uid()
));

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name; 