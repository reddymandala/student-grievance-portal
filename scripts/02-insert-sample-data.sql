-- Insert sample grievances for testing
INSERT INTO grievances (student_name, student_email, student_id, title, description, category, priority, status, admin_response, admin_name) VALUES
('John Smith', 'john.smith@university.edu', 'STU001', 'Library Access Issue', 'Unable to access digital library resources from off-campus', 'Academic', 'medium', 'resolved', 'Issue resolved. VPN access has been configured for your account.', 'Dr. Sarah Johnson'),
('Emily Davis', 'emily.davis@university.edu', 'STU002', 'Cafeteria Food Quality', 'Poor quality of food served in the main cafeteria', 'Facilities', 'low', 'in_progress', 'We are reviewing the food quality standards with our vendor.', 'Mark Wilson'),
('Michael Brown', 'michael.brown@university.edu', 'STU003', 'Discrimination in Class', 'Experiencing unfair treatment from professor', 'Academic', 'high', 'under_review', NULL, NULL),
('Sarah Wilson', 'sarah.wilson@university.edu', 'STU004', 'Parking Shortage', 'Not enough parking spaces for students', 'Facilities', 'medium', 'submitted', NULL, NULL),
('David Lee', 'david.lee@university.edu', 'STU005', 'Internet Connectivity Issues', 'Frequent WiFi disconnections in dormitory', 'Technical', 'urgent', 'in_progress', 'IT team is working on upgrading the network infrastructure.', 'Tech Support Team');
