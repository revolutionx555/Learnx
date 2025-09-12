-- Create Supabase Storage buckets for file uploads

-- Create bucket for course videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create bucket for course images/thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create bucket for course documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-documents',
  'course-documents',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
);

-- Create bucket for instructor documents (CVs, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'instructor-documents',
  'instructor-documents',
  false, -- Private bucket for sensitive documents
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create RLS policies for course-videos bucket
CREATE POLICY "Public can view course videos" ON storage.objects
FOR SELECT USING (bucket_id = 'course-videos');

CREATE POLICY "Instructors can upload course videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'instructor'
  )
);

-- Create RLS policies for course-images bucket
CREATE POLICY "Public can view course images" ON storage.objects
FOR SELECT USING (bucket_id = 'course-images');

CREATE POLICY "Instructors can upload course images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-images' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'instructor'
  )
);

-- Create RLS policies for course-documents bucket
CREATE POLICY "Enrolled students can view course documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'course-documents' AND
  auth.role() = 'authenticated' AND
  (
    -- Instructors can view all documents
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'instructor'
    ) OR
    -- Students can view documents from courses they're enrolled in
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON e.course_id = c.id
      WHERE e.user_id = auth.uid() 
      AND e.status = 'active'
      AND name LIKE 'courses/' || c.id::text || '/%'
    )
  )
);

CREATE POLICY "Instructors can upload course documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-documents' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'instructor'
  )
);

-- Create RLS policies for instructor-documents bucket (private)
CREATE POLICY "Only admins can view instructor documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'instructor-documents' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can upload instructor documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'instructor-documents');
