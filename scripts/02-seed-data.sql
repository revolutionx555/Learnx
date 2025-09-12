-- Seed data for Learn X LMS
-- Run this after creating the database schema

-- Insert categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
  (uuid_generate_v4(), 'Web Development', 'web-development', 'Learn modern web development technologies', 'code'),
  (uuid_generate_v4(), 'Data Science', 'data-science', 'Master data analysis and machine learning', 'chart-bar'),
  (uuid_generate_v4(), 'Design', 'design', 'UI/UX design and creative skills', 'palette'),
  (uuid_generate_v4(), 'Business', 'business', 'Business strategy and entrepreneurship', 'briefcase'),
  (uuid_generate_v4(), 'Marketing', 'marketing', 'Digital marketing and growth strategies', 'megaphone'),
  (uuid_generate_v4(), 'Photography', 'photography', 'Photography techniques and editing', 'camera');

-- Insert sample users (instructors and students)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, bio, is_verified, avatar_url) VALUES
  (uuid_generate_v4(), 'john.instructor@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', 'John', 'Smith', 'instructor', 'Full-stack developer with 10+ years experience', true, '/placeholder.svg?height=100&width=100'),
  (uuid_generate_v4(), 'sarah.designer@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', 'Sarah', 'Johnson', 'instructor', 'UX/UI designer and design systems expert', true, '/placeholder.svg?height=100&width=100'),
  (uuid_generate_v4(), 'mike.data@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', 'Mike', 'Chen', 'instructor', 'Data scientist and ML engineer', true, '/placeholder.svg?height=100&width=100'),
  (uuid_generate_v4(), 'admin@learnx.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', 'Admin', 'User', 'admin', 'Platform administrator', true, '/placeholder.svg?height=100&width=100'),
  (uuid_generate_v4(), 'student@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', 'Alice', 'Brown', 'student', 'Aspiring web developer', true, '/placeholder.svg?height=100&width=100');

-- Insert sample courses
WITH instructor_ids AS (
  SELECT id, email FROM users WHERE role = 'instructor'
),
category_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO courses (id, title, slug, description, short_description, instructor_id, category_id, thumbnail_url, trailer_video_url, price, level, duration_minutes, is_published, is_featured, enrollment_count, rating, review_count) 
SELECT 
  uuid_generate_v4(),
  course_data.title,
  course_data.slug,
  course_data.description,
  course_data.short_description,
  i.id,
  c.id,
  course_data.thumbnail_url,
  course_data.trailer_video_url,
  course_data.price,
  course_data.level,
  course_data.duration_minutes,
  course_data.is_published,
  course_data.is_featured,
  course_data.enrollment_count,
  course_data.rating,
  course_data.review_count
FROM (VALUES
  ('Complete React & Next.js Course', 'complete-react-nextjs-course', 'Master modern React development with Next.js, TypeScript, and advanced patterns. Build production-ready applications from scratch.', 'Learn React & Next.js from beginner to advanced level', 'john.instructor@example.com', 'web-development', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=300', 99.99, 'intermediate', 1200, true, true, 1250, 4.8, 89),
  ('UI/UX Design Masterclass', 'ui-ux-design-masterclass', 'Complete guide to user interface and user experience design. Learn design thinking, prototyping, and modern design tools.', 'Master UI/UX design principles and tools', 'sarah.designer@example.com', 'design', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=300', 79.99, 'beginner', 800, true, true, 890, 4.9, 67),
  ('Data Science with Python', 'data-science-python', 'Learn data analysis, visualization, and machine learning with Python. Hands-on projects with real datasets.', 'Complete data science bootcamp with Python', 'mike.data@example.com', 'data-science', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=300', 129.99, 'intermediate', 1500, true, false, 456, 4.7, 34),
  ('JavaScript Fundamentals', 'javascript-fundamentals', 'Solid foundation in JavaScript programming. Perfect for beginners starting their coding journey.', 'Learn JavaScript from scratch', 'john.instructor@example.com', 'web-development', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=300', 49.99, 'beginner', 600, true, false, 2100, 4.6, 156),
  ('Advanced CSS & Animations', 'advanced-css-animations', 'Master CSS Grid, Flexbox, animations, and modern CSS techniques for stunning web interfaces.', 'Advanced CSS techniques and animations', 'sarah.designer@example.com', 'design', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=300', 69.99, 'advanced', 450, true, false, 678, 4.5, 45)
) AS course_data(title, slug, description, short_description, instructor_email, category_slug, thumbnail_url, trailer_video_url, price, level, duration_minutes, is_published, is_featured, enrollment_count, rating, review_count)
JOIN instructor_ids i ON i.email = course_data.instructor_email
JOIN category_ids c ON c.slug = course_data.category_slug;

-- Insert course sections and lessons for the React course
WITH react_course AS (
  SELECT id FROM courses WHERE slug = 'complete-react-nextjs-course' LIMIT 1
),
sections_data AS (
  INSERT INTO course_sections (id, course_id, title, description, order_index)
  SELECT 
    uuid_generate_v4(),
    rc.id,
    section_info.title,
    section_info.description,
    section_info.order_index
  FROM react_course rc,
  (VALUES
    ('Getting Started', 'Introduction to React and setting up your development environment', 1),
    ('React Fundamentals', 'Core React concepts: components, props, state, and events', 2),
    ('Advanced React', 'Hooks, context, performance optimization, and advanced patterns', 3),
    ('Next.js Essentials', 'Server-side rendering, routing, and API routes with Next.js', 4),
    ('Building Real Projects', 'Hands-on projects to solidify your learning', 5)
  ) AS section_info(title, description, order_index)
  RETURNING id, title, order_index
)
-- Insert lessons for each section
INSERT INTO lessons (section_id, title, description, content_type, content_url, duration_minutes, order_index, is_preview, is_required)
SELECT 
  s.id,
  lesson_data.title,
  lesson_data.description,
  lesson_data.content_type,
  lesson_data.content_url,
  lesson_data.duration_minutes,
  lesson_data.order_index,
  lesson_data.is_preview,
  lesson_data.is_required
FROM sections_data s
JOIN (VALUES
  -- Getting Started lessons
  ('Getting Started', 'Course Introduction', 'Welcome to the course and what you will learn', 'video', '/placeholder.svg?height=200&width=300', 15, 1, true, true),
  ('Getting Started', 'Development Environment Setup', 'Setting up Node.js, VS Code, and React development tools', 'video', '/placeholder.svg?height=200&width=300', 25, 2, true, true),
  ('Getting Started', 'Your First React App', 'Creating and running your first React application', 'video', '/placeholder.svg?height=200&width=300', 30, 3, false, true),
  
  -- React Fundamentals lessons
  ('React Fundamentals', 'Understanding Components', 'What are components and how to create them', 'video', '/placeholder.svg?height=200&width=300', 35, 1, false, true),
  ('React Fundamentals', 'Props and State', 'Managing data flow and component state', 'video', '/placeholder.svg?height=200&width=300', 40, 2, false, true),
  ('React Fundamentals', 'Event Handling', 'Handling user interactions in React', 'video', '/placeholder.svg?height=200&width=300', 30, 3, false, true),
  ('React Fundamentals', 'Knowledge Check', 'Test your understanding of React fundamentals', 'quiz', null, 15, 4, false, true),
  
  -- Advanced React lessons
  ('Advanced React', 'React Hooks Deep Dive', 'useState, useEffect, and custom hooks', 'video', '/placeholder.svg?height=200&width=300', 50, 1, false, true),
  ('Advanced React', 'Context API', 'Managing global state with React Context', 'video', '/placeholder.svg?height=200&width=300', 35, 2, false, true),
  ('Advanced React', 'Performance Optimization', 'React.memo, useMemo, and useCallback', 'video', '/placeholder.svg?height=200&width=300', 45, 3, false, true),
  
  -- Next.js Essentials lessons
  ('Next.js Essentials', 'Introduction to Next.js', 'Why Next.js and key features overview', 'video', '/placeholder.svg?height=200&width=300', 25, 1, false, true),
  ('Next.js Essentials', 'Pages and Routing', 'File-based routing and dynamic routes', 'video', '/placeholder.svg?height=200&width=300', 40, 2, false, true),
  ('Next.js Essentials', 'API Routes', 'Building backend APIs with Next.js', 'video', '/placeholder.svg?height=200&width=300', 35, 3, false, true),
  
  -- Building Real Projects lessons
  ('Building Real Projects', 'Project Planning', 'Planning and designing our final project', 'video', '/placeholder.svg?height=200&width=300', 20, 1, false, true),
  ('Building Real Projects', 'Building the Frontend', 'Implementing the user interface', 'video', '/placeholder.svg?height=200&width=300', 60, 2, false, true),
  ('Building Real Projects', 'Adding Backend Features', 'Implementing API endpoints and data management', 'video', '/placeholder.svg?height=200&width=300', 55, 3, false, true),
  ('Building Real Projects', 'Deployment', 'Deploying your application to production', 'video', '/placeholder.svg?height=200&width=300', 30, 4, false, true)
) AS lesson_data(section_title, title, description, content_type, content_url, duration_minutes, order_index, is_preview, is_required)
ON s.title = lesson_data.section_title;

-- Insert sample enrollments
WITH student_user AS (
  SELECT id FROM users WHERE email = 'student@example.com' LIMIT 1
),
sample_courses AS (
  SELECT id FROM courses WHERE is_published = true LIMIT 3
)
INSERT INTO enrollments (user_id, course_id, progress_percentage, enrolled_at)
SELECT 
  su.id,
  sc.id,
  CASE 
    WHEN random() < 0.3 THEN 100
    WHEN random() < 0.6 THEN floor(random() * 80 + 20)
    ELSE floor(random() * 30)
  END,
  NOW() - (random() * interval '30 days')
FROM student_user su
CROSS JOIN sample_courses sc;

-- Insert sample reviews
WITH enrolled_courses AS (
  SELECT DISTINCT e.user_id, e.course_id 
  FROM enrollments e 
  WHERE e.progress_percentage > 50
)
INSERT INTO course_reviews (user_id, course_id, rating, review_text, created_at)
SELECT 
  ec.user_id,
  ec.course_id,
  floor(random() * 2 + 4)::integer, -- Rating between 4-5
  CASE floor(random() * 3)
    WHEN 0 THEN 'Excellent course! Really helped me understand the concepts.'
    WHEN 1 THEN 'Great instructor and well-structured content. Highly recommended!'
    ELSE 'Very practical and hands-on approach. Learned a lot!'
  END,
  NOW() - (random() * interval '20 days')
FROM enrolled_courses ec
WHERE random() < 0.7; -- 70% chance of having a review
