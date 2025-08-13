-- Create responses table for admin responses
CREATE TABLE IF NOT EXISTS public.grievance_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    admin_name VARCHAR(255) NOT NULL,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_responses_grievance_id ON public.grievance_responses(grievance_id);

-- Enable Row Level Security
ALTER TABLE public.grievance_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on responses" ON public.grievance_responses
    FOR ALL USING (true) WITH CHECK (true);
