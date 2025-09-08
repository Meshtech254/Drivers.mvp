-- Storage policies for driver-photos bucket
-- Run these in your Supabase SQL editor

-- Create the storage bucket (if not already created)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('driver-photos', 'driver-photos', true, 52428800, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'driver-photos');

-- Policy 2: Allow public to view images
CREATE POLICY "Allow public to view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'driver-photos');

-- Policy 3: Allow users to update their own images
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'driver-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy 4: Allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'driver-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- KYC documents bucket (public read is okay for admin preview via signed URL; consider private in production)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('kyc-docs', 'kyc-docs', true, 52428800, ARRAY['image/*','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload KYC docs
CREATE POLICY "Allow authenticated users to upload KYC" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kyc-docs');

-- Allow public to view KYC docs (optional; for stricter privacy set TO authenticated and use signed URLs)
CREATE POLICY "Allow public to view KYC docs" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'kyc-docs');