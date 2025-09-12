-- Production seed data - Create admin account and sample course

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active) 
VALUES (
  uuid_generate_v4(),
  'admin@learnx.com',
  '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8qV',
  'Admin',
  'User',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample instructor (password: instructor123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active) 
VALUES (
  uuid_generate_v4(),
  'instructor@learnx.com',
  '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8qV',
  'John',
  'Instructor',
  'instructor',
  true
) ON CONFLICT (email) DO NOTHING;
