-- SQL Schema для SMM OS SaaS
-- Виконати в Supabase SQL Editor

-- Таблиця для зберігання налаштувань сайтів
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(255) NOT NULL,
  settings_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Унікальний індекс для комбінації site_id + settings_type
  CONSTRAINT unique_site_settings UNIQUE (site_id, settings_type)
);

-- Індекси для оптимізації запитів
CREATE INDEX IF NOT EXISTS idx_site_settings_site_id ON site_settings(site_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_type ON site_settings(settings_type);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated ON site_settings(updated_at);

-- Таблиця для медіафайлів (опційно, для великих файлів)
CREATE TABLE IF NOT EXISTS site_media (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Індекс для швидкого пошуку файлів сайту
  INDEX idx_site_media_site_id (site_id)
);

-- Таблиця для статистики використання (опційно)
CREATE TABLE IF NOT EXISTS site_analytics (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Індекс для аналітики
  INDEX idx_site_analytics_site_id (site_id),
  INDEX idx_site_analytics_created (created_at)
);

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

-- RLS (Row Level Security) політики - ВАЖЛИВО для безпеки!
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- Політика: дозволити всі операції (для публічного доступу)
-- УВАГА: Це базова політика, в продакшені рекомендується більш складна аутентифікація
CREATE POLICY "Allow all operations for site_settings" ON site_settings
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for site_media" ON site_media
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for site_analytics" ON site_analytics
  FOR ALL USING (true); 