--------------------------------------------------------
-- Seed canonical skills
--------------------------------------------------------
INSERT INTO skills (id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'leadership'),
  ('550e8400-e29b-41d4-a716-446655440002', 'communication'),
  ('550e8400-e29b-41d4-a716-446655440003', 'project-management'),
  ('550e8400-e29b-41d4-a716-446655440004', 'data-analysis'),
  ('550e8400-e29b-41d4-a716-446655440005', 'time-management'),
  ('550e8400-e29b-41d4-a716-446655440006', 'teamwork'),
  ('550e8400-e29b-41d4-a716-446655440007', 'problem-solving'),
  ('550e8400-e29b-41d4-a716-446655440008', 'creativity'),
  ('550e8400-e29b-41d4-a716-446655440009', 'strategic-thinking'),
  ('550e8400-e29b-41d4-a716-446655440010', 'emotional-intelligence'),
  ('550e8400-e29b-41d4-a716-446655440011', 'negotiation'),
  ('550e8400-e29b-41d4-a716-446655440012', 'public-speaking'),
  ('550e8400-e29b-41d4-a716-446655440013', 'digital-literacy'),
  ('550e8400-e29b-41d4-a716-446655440014', 'customer-service'),
  ('550e8400-e29b-41d4-a716-446655440015', 'sales'),
  ('550e8400-e29b-41d4-a716-446655440016', 'marketing'),
  ('550e8400-e29b-41d4-a716-446655440017', 'finance'),
  ('550e8400-e29b-41d4-a716-446655440018', 'innovation'),
  ('550e8400-e29b-41d4-a716-446655440019', 'change-management'),
  ('550e8400-e29b-41d4-a716-446655440020', 'mentoring');

--------------------------------------------------------
-- Seed skill aliases
--------------------------------------------------------
INSERT INTO skill_aliases (alias, skill_id) VALUES
  -- Leadership aliases
  ('leading', '550e8400-e29b-41d4-a716-446655440001'),
  ('management', '550e8400-e29b-41d4-a716-446655440001'),
  ('team-leadership', '550e8400-e29b-41d4-a716-446655440001'),
  
  -- Communication aliases
  ('speaking', '550e8400-e29b-41d4-a716-446655440002'),
  ('writing', '550e8400-e29b-41d4-a716-446655440002'),
  ('presentation', '550e8400-e29b-41d4-a716-446655440002'),
  
  -- Project management aliases
  ('project-planning', '550e8400-e29b-41d4-a716-446655440003'),
  ('agile', '550e8400-e29b-41d4-a716-446655440003'),
  ('scrum', '550e8400-e29b-41d4-a716-446655440003'),
  
  -- Data analysis aliases
  ('analytics', '550e8400-e29b-41d4-a716-446655440004'),
  ('data-science', '550e8400-e29b-41d4-a716-446655440004'),
  ('reporting', '550e8400-e29b-41d4-a716-446655440004'),
  
  -- Time management aliases
  ('productivity', '550e8400-e29b-41d4-a716-446655440005'),
  ('organization', '550e8400-e29b-41d4-a716-446655440005'),
  ('planning', '550e8400-e29b-41d4-a716-446655440005'),
  
  -- Teamwork aliases
  ('collaboration', '550e8400-e29b-41d4-a716-446655440006'),
  ('team-building', '550e8400-e29b-41d4-a716-446655440006'),
  ('cooperation', '550e8400-e29b-41d4-a716-446655440006'),
  
  -- Problem solving aliases
  ('critical-thinking', '550e8400-e29b-41d4-a716-446655440007'),
  ('troubleshooting', '550e8400-e29b-41d4-a716-446655440007'),
  ('decision-making', '550e8400-e29b-41d4-a716-446655440007'),
  
  -- Creativity aliases
  ('innovation', '550e8400-e29b-41d4-a716-446655440008'),
  ('design-thinking', '550e8400-e29b-41d4-a716-446655440008'),
  ('brainstorming', '550e8400-e29b-41d4-a716-446655440008'),
  
  -- Strategic thinking aliases
  ('strategy', '550e8400-e29b-41d4-a716-446655440009'),
  ('strategic-planning', '550e8400-e29b-41d4-a716-446655440009'),
  ('vision', '550e8400-e29b-41d4-a716-446655440009'),
  
  -- Emotional intelligence aliases
  ('empathy', '550e8400-e29b-41d4-a716-446655440010'),
  ('self-awareness', '550e8400-e29b-41d4-a716-446655440010'),
  ('social-skills', '550e8400-e29b-41d4-a716-446655440010');

--------------------------------------------------------
-- Seed content from existing courses
--------------------------------------------------------
INSERT INTO contents (id, kind, title, description, duration)
SELECT 
  id,
  'course'::content_kind,
  title,
  description,
  duration
FROM courses;

--------------------------------------------------------
-- Map existing course skills to new schema
--------------------------------------------------------
INSERT INTO content_skills (content_id, skill_id)
SELECT DISTINCT
  c.id as content_id,
  s.id as skill_id
FROM courses c
CROSS JOIN LATERAL unnest(c.skills) AS course_skill
JOIN skills s ON s.name = course_skill
WHERE s.id IS NOT NULL;

--------------------------------------------------------
-- Add some sample lessons and activities
--------------------------------------------------------
INSERT INTO contents (id, kind, title, description, duration) VALUES
  -- Leadership lessons
  ('650e8400-e29b-41d4-a716-446655440001', 'lesson', 'Introduction to Leadership Styles', 'Learn about different leadership approaches and when to use them', 15),
  ('650e8400-e29b-41d4-a716-446655440002', 'lesson', 'Building Trust in Teams', 'Strategies for creating psychological safety and trust', 20),
  ('650e8400-e29b-41d4-a716-446655440003', 'activity', 'Leadership Style Assessment', 'Interactive assessment to identify your natural leadership style', 10),
  
  -- Communication lessons
  ('650e8400-e29b-41d4-a716-446655440004', 'lesson', 'Active Listening Techniques', 'Master the art of truly hearing what others are saying', 18),
  ('650e8400-e29b-41d4-a716-446655440005', 'lesson', 'Difficult Conversations', 'Navigate challenging discussions with confidence', 25),
  ('650e8400-e29b-41d4-a716-446655440006', 'activity', 'Communication Role Play', 'Practice scenarios for better workplace communication', 15),
  
  -- Project management lessons
  ('650e8400-e29b-41d4-a716-446655440007', 'lesson', 'Agile Fundamentals', 'Understanding Agile methodology and its principles', 30),
  ('650e8400-e29b-41d4-a716-446655440008', 'lesson', 'Risk Management in Projects', 'Identify and mitigate project risks effectively', 22),
  ('650e8400-e29b-41d4-a716-446655440009', 'activity', 'Project Planning Workshop', 'Hands-on project planning exercise', 45);

--------------------------------------------------------
-- Link lessons and activities to skills
--------------------------------------------------------
INSERT INTO content_skills (content_id, skill_id) VALUES
  -- Leadership content
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006'), -- teamwork
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
  
  -- Communication content
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007'), -- problem-solving
  ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002'),
  
  -- Project management content
  ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440007'), -- problem-solving
  ('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003'); 