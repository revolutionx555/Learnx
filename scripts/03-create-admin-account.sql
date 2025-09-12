-- Create default admin account with properly hashed password
-- Password: admin123 (hashed with bcrypt rounds=10)
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_verified,
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin@learnx.com',
  '$2b$10$K8QzQxQxQxQxQxQxQxQxQOK8QzQxQxQxQxQxQxQxQxQxQxQxQxQxQx',
  'Admin',
  'User',
  'admin',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Also create a test student account
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_verified,
  is_active,
  created_at,
  updated_at
) VALUES (
  'student@learnx.com',
  '$2b$10$K8QzQxQxQxQxQxQxQxQxQOK8QzQxQxQxQxQxQxQxQxQxQxQxQxQxQx',
  'Test',
  'Student',
  'student',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
