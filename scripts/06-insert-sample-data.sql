-- Insert sample admin user
INSERT INTO users (email, full_name, role) VALUES 
('admin@university.edu', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample student users
INSERT INTO users (email, full_name, student_id, role) VALUES 
('john.doe@student.edu', 'John Doe', 'STU001', 'student'),
('jane.smith@student.edu', 'Jane Smith', 'STU002', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert sample grievance categories for reference
-- (These are already defined in the CHECK constraint, this is just for documentation)
/*
Available categories:
- academic: Issues related to courses, grades, faculty
- administrative: Problems with registration, records, policies
- facilities: Campus infrastructure, dormitory, library issues
- harassment: Any form of harassment or bullying
- discrimination: Discrimination based on any grounds
- financial: Fee-related issues, scholarship problems
- other: Any other issues not covered above

Available priorities: low, medium, high, urgent
Available statuses: submitted, under_review, in_progress, resolved, closed
*/
