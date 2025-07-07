-- SQL Schema для SMM OS SaaS
-- Виконати в Supabase SQL Editor

-- Таблиця для зберігання налаштувань сайтів
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL,
  settings_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, settings_type)
);

-- Індекси для оптимізації запитів
CREATE INDEX IF NOT EXISTS idx_site_settings_site_id ON site_settings(site_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_type ON site_settings(settings_type);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated ON site_settings(updated_at);

-- Таблиця для медіафайлів (опційно, для великих файлів)
CREATE TABLE IF NOT EXISTS site_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  file_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Індекси для site_media
CREATE INDEX IF NOT EXISTS idx_site_media_site_id ON site_media(site_id);

-- Таблиця для статистики використання (опційно)
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Індекси для site_analytics
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON site_analytics(site_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created ON site_analytics(created_at);

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення updated_at
CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ⚠️ ВИМКНУТИ RLS для публічного доступу (для тестування)
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics DISABLE ROW LEVEL SECURITY;

-- 🔓 Альтернативно: Дозволити все через RLS політики
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- Створити RLS політики для таблиці site_settings
CREATE POLICY "Allow anon to select site_settings" ON site_settings
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anon to insert site_settings" ON site_settings
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update site_settings" ON site_settings
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete site_settings" ON site_settings
    FOR DELETE TO anon
    USING (true);

-- Створити RLS політики для таблиці site_media
CREATE POLICY "Allow anon to select site_media" ON site_media
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anon to insert site_media" ON site_media
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update site_media" ON site_media
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete site_media" ON site_media
    FOR DELETE TO anon
    USING (true);

-- Створити RLS політики для таблиці site_analytics
CREATE POLICY "Allow anon to select site_analytics" ON site_analytics
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anon to insert site_analytics" ON site_analytics
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update site_analytics" ON site_analytics
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete site_analytics" ON site_analytics
    FOR DELETE TO anon
    USING (true);

-- Увімкнути RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- Створюємо storage buckets (якщо не існують)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('smm-os-images', 'smm-os-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
    ('smm-os-videos', 'smm-os-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
    ('smm-os-audio', 'smm-os-audio', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']),
    ('smm-os-documents', 'smm-os-documents', true, 10485760, ARRAY['application/pdf', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- Оновлюємо bucket щоб вони були публічні
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('smm-os-images', 'smm-os-videos', 'smm-os-audio', 'smm-os-documents');

-- Створюємо storage policies для публічного доступу
CREATE POLICY "Public read access on smm-os-images" ON storage.objects 
    FOR SELECT TO anon
    USING (bucket_id = 'smm-os-images');

CREATE POLICY "Public upload access on smm-os-images" ON storage.objects 
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'smm-os-images');

CREATE POLICY "Public read access on smm-os-videos" ON storage.objects 
    FOR SELECT TO anon
    USING (bucket_id = 'smm-os-videos');

CREATE POLICY "Public upload access on smm-os-videos" ON storage.objects 
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'smm-os-videos');

CREATE POLICY "Public read access on smm-os-audio" ON storage.objects 
    FOR SELECT TO anon
    USING (bucket_id = 'smm-os-audio');

CREATE POLICY "Public upload access on smm-os-audio" ON storage.objects 
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'smm-os-audio');

CREATE POLICY "Public read access on smm-os-documents" ON storage.objects 
    FOR SELECT TO anon
    USING (bucket_id = 'smm-os-documents');

CREATE POLICY "Public upload access on smm-os-documents" ON storage.objects 
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'smm-os-documents');

-- Перевіряємо що все створено
SELECT 'Database setup completed successfully!' as status; 