-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grievances_updated_at 
    BEFORE UPDATE ON grievances 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create notifications
CREATE OR REPLACE FUNCTION create_grievance_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification when grievance status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO notifications (user_id, grievance_id, title, message, type)
        VALUES (
            NEW.student_id,
            NEW.id,
            'Grievance Status Updated',
            'Your grievance "' || NEW.title || '" status has been updated to: ' || NEW.status,
            'status_update'
        );
    END IF;
    
    -- Create notification when grievance is first submitted
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notifications (user_id, grievance_id, title, message, type)
        VALUES (
            NEW.student_id,
            NEW.id,
            'Grievance Submitted Successfully',
            'Your grievance "' || NEW.title || '" has been submitted and will be reviewed soon.',
            'grievance_submitted'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for grievance notifications
CREATE TRIGGER grievance_notification_trigger
    AFTER INSERT OR UPDATE ON grievances
    FOR EACH ROW EXECUTE FUNCTION create_grievance_notification();
