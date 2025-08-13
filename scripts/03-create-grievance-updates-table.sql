-- Create grievance updates table for tracking responses and status changes
CREATE TABLE IF NOT EXISTS grievance_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grievance_id UUID NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  status_change VARCHAR(20), -- New status if this update changes status
  is_internal BOOLEAN DEFAULT FALSE, -- Internal notes vs student-visible updates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_grievance_updates_grievance_id ON grievance_updates(grievance_id);
CREATE INDEX IF NOT EXISTS idx_grievance_updates_admin_id ON grievance_updates(admin_id);
CREATE INDEX IF NOT EXISTS idx_grievance_updates_created_at ON grievance_updates(created_at DESC);
