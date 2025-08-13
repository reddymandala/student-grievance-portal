-- Create grievances table to store student complaints
CREATE TABLE IF NOT EXISTS grievances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN (
    'academic', 'administrative', 'facilities', 'harassment', 
    'discrimination', 'financial', 'other'
  )),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status VARCHAR(20) NOT NULL CHECK (status IN (
    'submitted', 'under_review', 'in_progress', 'resolved', 'closed'
  )) DEFAULT 'submitted',
  assigned_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grievances_student_id ON grievances(student_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_category ON grievances(category);
CREATE INDEX IF NOT EXISTS idx_grievances_assigned_admin ON grievances(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances(created_at DESC);
