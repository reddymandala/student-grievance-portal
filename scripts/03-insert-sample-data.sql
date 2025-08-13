-- Insert sample grievances
INSERT INTO public.grievances (student_name, student_email, student_id, title, description, category, priority, status, assigned_to) VALUES
('John Doe', 'john.doe@university.edu', 'STU001', 'Library Access Issue', 'Unable to access digital library resources from off-campus', 'Academic', 'high', 'under_review', 'Admin Smith'),
('Jane Smith', 'jane.smith@university.edu', 'STU002', 'Cafeteria Food Quality', 'Food quality has declined significantly in the main cafeteria', 'Facilities', 'medium', 'submitted', NULL),
('Mike Johnson', 'mike.johnson@university.edu', 'STU003', 'Parking Permit Problem', 'Parking permit was not processed despite payment', 'Administrative', 'high', 'in_progress', 'Admin Johnson'),
('Sarah Wilson', 'sarah.wilson@university.edu', 'STU004', 'Dormitory Maintenance', 'Heating system not working in dormitory building C', 'Facilities', 'urgent', 'resolved', 'Admin Brown'),
('Alex Chen', 'alex.chen@university.edu', 'STU005', 'Course Registration Error', 'System error prevented registration for required courses', 'Academic', 'high', 'submitted', NULL);

-- Insert sample responses
INSERT INTO public.grievance_responses (grievance_id, admin_name, response_text) VALUES
((SELECT id FROM public.grievances WHERE title = 'Library Access Issue'), 'Admin Smith', 'We are investigating the VPN access issue. Please try the alternative login method in the meantime.'),
((SELECT id FROM public.grievances WHERE title = 'Parking Permit Problem'), 'Admin Johnson', 'Your parking permit has been processed. You can collect it from the administrative office.'),
((SELECT id FROM public.grievances WHERE title = 'Dormitory Maintenance'), 'Admin Brown', 'The heating system has been repaired. Please let us know if you experience any further issues.');
