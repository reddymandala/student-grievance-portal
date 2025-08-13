-- Updated grievances table to reference auth.users
DROP TABLE IF EXISTS public.grievances CASCADE;

CREATE TABLE public.grievances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'administrative', 'facilities', 'harassment', 'discrimination', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their own grievances" ON public.grievances
  FOR SELECT USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can create grievances" ON public.grievances
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own grievances" ON public.grievances
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Admins can update all grievances" ON public.grievances
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_grievances_student_id ON public.grievances(student_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_category ON public.grievances(category);
CREATE INDEX IF NOT EXISTS idx_grievances_assigned_to ON public.grievances(assigned_to);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON public.grievances(created_at);
