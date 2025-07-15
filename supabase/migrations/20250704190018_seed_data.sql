-- Clear existing data
TRUNCATE TABLE event_logs CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE companies CASCADE;

-- Insert demo company
INSERT INTO companies (id, name, industry, learning_goal) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Acme Healthcare', 'Medical Technology', 'Elevate soft-skill culture and enhance team collaboration');

-- Insert demo user
INSERT INTO users (id, company_id, first_name, last_name, email, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Jamie', 'Doe', 'jamie.doe@Acme.com', 'Project Engineer');

-- Insert demo courses
INSERT INTO courses (title, type, skills, duration, description, category, difficulty) VALUES
-- Leadership & Management
('Effective Leadership Fundamentals', 'course', ARRAY['leadership', 'management', 'communication'], 45, 'Learn the core principles of effective leadership and how to inspire your team.', 'leadership', 'beginner'),
('Project Management Essentials', 'course', ARRAY['project-management', 'planning', 'organization'], 60, 'Master the fundamentals of project management and delivery.', 'management', 'intermediate'),
('Leading Through Change', 'lesson', ARRAY['leadership', 'change-management', 'adaptability'], 20, 'Navigate organizational change with confidence and guide your team through transitions.', 'leadership', 'intermediate'),
('Delegation and Empowerment', 'activity', ARRAY['leadership', 'delegation', 'empowerment'], 15, 'Practice effective delegation techniques through interactive scenarios.', 'leadership', 'beginner'),
('Strategic Thinking Workshop', 'course', ARRAY['strategy', 'critical-thinking', 'planning'], 90, 'Develop your strategic thinking capabilities and long-term planning skills.', 'strategy', 'advanced'),

-- Communication & Collaboration
('Communication Masterclass', 'course', ARRAY['communication', 'presentation', 'public-speaking'], 75, 'Enhance your communication skills across all mediums and audiences.', 'communication', 'intermediate'),
('Active Listening Techniques', 'lesson', ARRAY['communication', 'listening', 'empathy'], 25, 'Master the art of active listening to improve your relationships and effectiveness.', 'communication', 'beginner'),
('Cross-Cultural Communication', 'course', ARRAY['communication', 'cultural-awareness', 'diversity'], 40, 'Learn to communicate effectively across different cultures and backgrounds.', 'communication', 'intermediate'),
('Conflict Resolution Skills', 'lesson', ARRAY['conflict-resolution', 'mediation', 'negotiation'], 30, 'Develop skills to resolve conflicts constructively and maintain positive relationships.', 'communication', 'intermediate'),
('Team Collaboration Tools', 'activity', ARRAY['collaboration', 'teamwork', 'tools'], 10, 'Explore digital tools and techniques for effective team collaboration.', 'collaboration', 'beginner'),

-- Personal Development
('Emotional Intelligence', 'course', ARRAY['emotional-intelligence', 'self-awareness', 'empathy'], 50, 'Develop your emotional intelligence to improve relationships and decision-making.', 'personal-development', 'intermediate'),
('Time Management Mastery', 'course', ARRAY['time-management', 'productivity', 'organization'], 35, 'Learn effective time management techniques to boost your productivity.', 'productivity', 'beginner'),
('Stress Management and Wellbeing', 'lesson', ARRAY['stress-management', 'wellbeing', 'mindfulness'], 20, 'Develop healthy coping strategies for managing stress and maintaining wellbeing.', 'wellbeing', 'beginner'),
('Goal Setting and Achievement', 'activity', ARRAY['goal-setting', 'motivation', 'planning'], 15, 'Set and achieve your personal and professional goals with proven frameworks.', 'personal-development', 'beginner'),
('Resilience and Adaptability', 'lesson', ARRAY['resilience', 'adaptability', 'growth-mindset'], 25, 'Build resilience and adaptability to thrive in changing environments.', 'personal-development', 'intermediate'),

-- Technical Skills
('Data Analysis Fundamentals', 'course', ARRAY['data-analysis', 'excel', 'statistics'], 80, 'Learn the basics of data analysis and visualization techniques.', 'technical', 'beginner'),
('Digital Literacy Essentials', 'course', ARRAY['digital-literacy', 'technology', 'software'], 45, 'Improve your digital skills and confidence with modern technology.', 'technical', 'beginner'),
('Process Improvement Methods', 'lesson', ARRAY['process-improvement', 'lean', 'efficiency'], 30, 'Learn methodologies for improving processes and increasing efficiency.', 'operations', 'intermediate'),
('Innovation and Creative Thinking', 'activity', ARRAY['innovation', 'creativity', 'problem-solving'], 20, 'Unlock your creative potential and develop innovative solutions.', 'innovation', 'intermediate'),
('Quality Management Principles', 'course', ARRAY['quality-management', 'standards', 'compliance'], 55, 'Understand quality management principles and implementation strategies.', 'quality', 'intermediate'),

-- Customer Focus
('Customer Service Excellence', 'course', ARRAY['customer-service', 'communication', 'problem-solving'], 40, 'Deliver exceptional customer service and build lasting relationships.', 'customer-service', 'beginner'),
('Understanding Customer Needs', 'lesson', ARRAY['customer-research', 'empathy', 'analysis'], 25, 'Learn to identify and understand customer needs and preferences.', 'customer-service', 'beginner'),
('Handling Difficult Conversations', 'activity', ARRAY['communication', 'conflict-resolution', 'customer-service'], 15, 'Practice managing challenging customer interactions with confidence.', 'communication', 'intermediate'),
('Building Customer Loyalty', 'lesson', ARRAY['customer-loyalty', 'relationship-building', 'retention'], 20, 'Develop strategies for building long-term customer relationships.', 'customer-service', 'intermediate'),
('Service Recovery Techniques', 'activity', ARRAY['service-recovery', 'problem-solving', 'customer-service'], 10, 'Learn to turn negative customer experiences into positive outcomes.', 'customer-service', 'intermediate'); 