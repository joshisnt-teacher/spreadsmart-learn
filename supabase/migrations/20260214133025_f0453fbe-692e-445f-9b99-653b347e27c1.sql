
-- Create storage bucket for module banners
INSERT INTO storage.buckets (id, name, public) VALUES ('module-banners', 'module-banners', true);

-- Allow anyone to view banners
CREATE POLICY "Module banners are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'module-banners');

-- Teachers can upload banners
CREATE POLICY "Teachers can upload module banners"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);

-- Teachers can update their banners
CREATE POLICY "Teachers can update module banners"
ON storage.objects FOR UPDATE
USING (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);

-- Teachers can delete their banners
CREATE POLICY "Teachers can delete module banners"
ON storage.objects FOR DELETE
USING (bucket_id = 'module-banners' AND auth.uid() IS NOT NULL);

-- Add banner_url column to custom_modules
ALTER TABLE public.custom_modules ADD COLUMN banner_url TEXT DEFAULT NULL;
