import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Share2, Globe, Copy, Check, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import indexedDBService from '../services/IndexedDBService';

interface PreviewGeneratorProps {
  className?: string;
}

interface GeneratedPreview {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  settings: Record<string, unknown>;
  embedCode: string;
}

const PreviewGenerator: React.FC<PreviewGeneratorProps> = ({ className }) => {
  const [previews, setPreviews] = useState<GeneratedPreview[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewName, setPreviewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePreview = async () => {
    if (!previewName.trim()) {
      toast({
        title: "Помилка",
        description: "Введіть назву для превью",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Завантажуємо реальні налаштування з localStorage
      const savedPreviewSettings = localStorage.getItem('previewSettings');
      let previewSettings = {};
      
      if (savedPreviewSettings) {
        try {
          previewSettings = JSON.parse(savedPreviewSettings);
        } catch (error) {
          console.warn('Не вдалося завантажити налаштування превью');
        }
      }

      // Симуляція генерації превью
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPreview: GeneratedPreview = {
        id: Math.random().toString(36).substr(2, 9),
        name: previewName,
        url: `https://preview.smm-os.com/${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        settings: previewSettings, // Використовуємо реальні налаштування
        embedCode: generateEmbedCode()
      };

      setPreviews(prev => [newPreview, ...prev]);
      setPreviewName('');

      toast({
        title: "Успіх!",
        description: "Превью успішно згенеровано з вашими налаштуваннями",
      });

      // Перевіряємо наявність музики з правильною типізацією
      const settings = newPreview.settings as { 
        audioSettings?: { 
          backgroundMusic?: { 
            enabled?: boolean; 
            url?: string; 
            autoPlay?: boolean;
            volume?: number;
          } 
        } 
      };
      
      if (settings.audioSettings?.backgroundMusic?.enabled && 
          typeof settings.audioSettings.backgroundMusic.url === 'string' &&
          settings.audioSettings.backgroundMusic.autoPlay) {
        const audio = new Audio(settings.audioSettings.backgroundMusic.url);
        audio.volume = settings.audioSettings.backgroundMusic.volume || 0.3;
        audio.loop = true;
        audio.play().catch(e => {
          // Тихо ігноруємо помилки аудіо
        });
      }

      // Відстеження аналітики
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'preview_generated',
          timestamp: Date.now(),
          settings: newPreview.settings
        })
      }).catch(e => {
        // Тихо ігноруємо помилки аналітики
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося згенерувати превью",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEmbedCode = () => {
    return `<iframe 
  src="https://preview.smm-os.com/embed/${Math.random().toString(36).substr(2, 9)}" 
  width="100%" 
  height="600" 
  frameborder="0" 
  allowfullscreen>
</iframe>`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Скопійовано!",
        description: "Посилання скопійовано в буфер обміну",
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося скопіювати",
        variant: "destructive"
      });
    }
  };

  const downloadPreview = (preview: GeneratedPreview) => {
    // Генеруємо HTML файл для завантаження
    const htmlContent = generateHTMLPreview(preview);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${preview.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const previewInBrowser = (preview: GeneratedPreview) => {
    // Генеруємо HTML контент з реальними налаштуваннями
    const htmlContent = generateHTMLPreview(preview);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Відкриваємо в новому вікні
    const newWindow = window.open(url, '_blank', 'width=1200,height=800');
    
    // Очищуємо URL після відкриття
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    if (!newWindow) {
      toast({
        title: "Помилка",
        description: "Не вдалося відкрити превью. Перевірте налаштування блокувальника спливаючих вікон.",
        variant: "destructive"
      });
    }
  };

  const quickPreview = async () => {
    // Завантажуємо поточні налаштування з IndexedDB
    console.log('🔄 PreviewGenerator: Швидкий перегляд - завантаження налаштувань...');
    let previewSettings = {};
    
    try {
      const indexedDBSettings = await indexedDBService.loadSettings('previewSettings');
      if (indexedDBSettings) {
        previewSettings = indexedDBSettings;
        console.log('✅ PreviewGenerator: Налаштування завантажено з IndexedDB');
      } else {
        // Якщо немає в IndexedDB, пробуємо localStorage як резерв
        const savedPreviewSettings = localStorage.getItem('previewSettings');
        if (savedPreviewSettings) {
          previewSettings = JSON.parse(savedPreviewSettings);
          console.log('✅ PreviewGenerator: Налаштування завантажено з localStorage');
        } else {
          console.warn('⚠️ PreviewGenerator: Налаштування превью не знайдено');
        }
      }
    } catch (error) {
      console.error('❌ PreviewGenerator: Помилка завантаження налаштувань:', error);
    }

    // Створюємо тимчасовий об'єкт превью
    const tempPreview: GeneratedPreview = {
      id: 'temp-preview',
      name: 'Швидкий перегляд',
      url: '',
      createdAt: new Date().toISOString(),
      settings: previewSettings,
      embedCode: ''
    };

    // Відкриваємо попередній перегляд
    previewInBrowser(tempPreview);
  };

  const generateHTMLPreview = (preview: GeneratedPreview) => {
    const settings = preview.settings as {
      titleText?: string;
      subtitleText?: string;
      descriptionText?: string;
      buttonText?: string;
      logoUrl?: string;
      brandColor?: string;
      accentColor?: string;
      textColor?: string;
      backgroundType?: string;
      backgroundColor?: string;
      gradientFrom?: string;
      gradientTo?: string;
      backgroundImage?: string;
      backgroundVideo?: string;
      showParticles?: boolean;
      particleColor?: string;
      titleFontFamily?: string;
      subtitleFontFamily?: string;
      descriptionFontFamily?: string;
      titleFontSize?: number;
      subtitleFontSize?: number;
      descriptionFontSize?: number;
      titleFontWeight?: number;
      subtitleFontWeight?: number;
      descriptionFontWeight?: number;
      titleAnimation?: string;
      subtitleAnimation?: string;
      descriptionAnimation?: string;
      animationDuration?: number;
      animationDelay?: number;
      audioSettings?: {
        backgroundMusic?: {
          enabled?: boolean;
          url?: string;
          volume?: number;
          loop?: boolean;
          autoPlay?: boolean;
        };
      };
    };

    // Значення за замовчуванням
    const title = settings.titleText || 'Ласкаво просимо';
    const subtitle = settings.subtitleText || 'до нашого бізнесу';
    const description = settings.descriptionText || 'Ми створюємо неймовірні рішення для вашого успіху. Приєднуйтесь до нас та відкрийте нові можливості для розвитку.';
    const buttonText = settings.buttonText || 'Розпочати';
    const brandColor = settings.brandColor || '#667eea';
    const accentColor = settings.accentColor || '#764ba2';
    const textColor = settings.textColor || '#ffffff';
    
    // Фон
    let backgroundStyle = '';
    switch (settings.backgroundType) {
      case 'color':
        backgroundStyle = `background: ${settings.backgroundColor || '#1a1a1a'};`;
        break;
      case 'gradient':
        backgroundStyle = `background: linear-gradient(135deg, ${settings.gradientFrom || '#667eea'} 0%, ${settings.gradientTo || '#764ba2'} 100%);`;
        break;
      case 'image':
        if (settings.backgroundImage) {
          backgroundStyle = `background: url('${settings.backgroundImage}') center/cover no-repeat;`;
        } else {
          backgroundStyle = `background: linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%);`;
        }
        break;
      case 'video':
        backgroundStyle = `background: ${settings.backgroundColor || '#1a1a1a'};`;
        break;
      default:
        backgroundStyle = `background: linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%);`;
    }

    // Анімації
    const getAnimationCSS = (animationType: string, duration: number, delay: number) => {
      switch (animationType) {
        case 'fadeIn':
          return `animation: fadeIn ${duration}ms ease-out ${delay}ms both;`;
        case 'slideUp':
          return `animation: slideUp ${duration}ms ease-out ${delay}ms both;`;
        case 'slideDown':
          return `animation: slideDown ${duration}ms ease-out ${delay}ms both;`;
        case 'slideLeft':
          return `animation: slideLeft ${duration}ms ease-out ${delay}ms both;`;
        case 'slideRight':
          return `animation: slideRight ${duration}ms ease-out ${delay}ms both;`;
        case 'zoomIn':
          return `animation: zoomIn ${duration}ms ease-out ${delay}ms both;`;
        case 'bounce':
          return `animation: bounce ${duration}ms ease-out ${delay}ms both;`;
        case 'typewriter':
          return `animation: typewriter ${duration}ms steps(${title.length}) ${delay}ms both;`;
        case 'glow':
          return `animation: glow ${duration}ms ease-in-out ${delay}ms infinite alternate;`;
        default:
          return `animation: fadeIn ${duration}ms ease-out ${delay}ms both;`;
      }
    };

    const titleAnimation = getAnimationCSS(settings.titleAnimation || 'fadeIn', settings.animationDuration || 800, settings.animationDelay || 200);
    const subtitleAnimation = getAnimationCSS(settings.subtitleAnimation || 'slideUp', settings.animationDuration || 800, (settings.animationDelay || 200) + 200);
    const descriptionAnimation = getAnimationCSS(settings.descriptionAnimation || 'fadeIn', settings.animationDuration || 800, (settings.animationDelay || 200) + 400);

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${preview.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${settings.titleFontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
            ${backgroundStyle}
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: ${textColor};
        }
        
        .preview-container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
            position: relative;
            z-index: 10;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 2rem;
            ${settings.logoUrl ? `background: url('${settings.logoUrl}') center/cover;` : `
                background: rgba(255,255,255,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            `}
            animation: logoFadeIn 1s ease-out;
        }
        
        h1 {
            font-family: ${settings.titleFontFamily || 'inherit'};
            font-size: ${settings.titleFontSize || 48}px;
            font-weight: ${settings.titleFontWeight || 700};
            margin-bottom: 1rem;
            color: ${textColor};
            ${titleAnimation}
        }
        
        h2 {
            font-family: ${settings.subtitleFontFamily || 'inherit'};
            font-size: ${settings.subtitleFontSize || 24}px;
            font-weight: ${settings.subtitleFontWeight || 300};
            margin-bottom: 2rem;
            opacity: 0.9;
            color: ${textColor};
            ${subtitleAnimation}
        }
        
        p {
            font-family: ${settings.descriptionFontFamily || 'inherit'};
            font-size: ${settings.descriptionFontSize || 18}px;
            font-weight: ${settings.descriptionFontWeight || 400};
            line-height: 1.6;
            margin-bottom: 3rem;
            opacity: 0.8;
            color: ${textColor};
            ${descriptionAnimation}
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, ${brandColor}, ${accentColor});
            border: none;
            border-radius: 50px;
            color: white;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            animation: fadeIn 1s ease-out 0.8s both;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        .music-toggle {
            position: fixed;
            top: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .music-toggle:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }
        
        /* Анімації */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideLeft {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0, -30px, 0); }
            70% { transform: translate3d(0, -15px, 0); }
            90% { transform: translate3d(0, -4px, 0); }
        }
        
        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes glow {
            from { text-shadow: 0 0 10px ${brandColor}; }
            to { text-shadow: 0 0 20px ${accentColor}, 0 0 30px ${accentColor}; }
        }
        
        @keyframes logoFadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        
        ${settings.showParticles ? `
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${settings.particleColor || 'rgba(255,255,255,0.3)'};
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        ` : ''}
        
        /* Адаптивність */
        @media (max-width: 768px) {
            h1 { font-size: ${(settings.titleFontSize || 48) * 0.7}px; }
            h2 { font-size: ${(settings.subtitleFontSize || 24) * 0.8}px; }
            p { font-size: ${(settings.descriptionFontSize || 18) * 0.9}px; }
            .preview-container { padding: 1rem; }
        }
    </style>
</head>
<body>
    ${settings.backgroundType === 'video' && settings.backgroundVideo ? `
    <video autoplay muted loop style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
        <source src="${settings.backgroundVideo}" type="video/mp4">
    </video>
    ` : ''}
    
    ${settings.showParticles ? '<div class="particles" id="particles"></div>' : ''}
    
    <div class="preview-container">
        ${settings.logoUrl ? `<div class="logo"></div>` : '<div class="logo">🚀</div>'}
        <h1>${title}</h1>
        <h2>${subtitle}</h2>
        <p>${description}</p>
        <button class="cta-button" onclick="handleButtonClick()">${buttonText}</button>
    </div>
    
    ${settings.audioSettings?.backgroundMusic?.enabled ? `
    <button class="music-toggle" onclick="toggleMusic()" id="musicToggle">🎵</button>
    
    <audio id="backgroundMusic" ${settings.audioSettings.backgroundMusic.loop ? 'loop' : ''}>
        <source src="${settings.audioSettings.backgroundMusic.url}" type="audio/mpeg">
    </audio>
    ` : ''}
    
    <script>
        ${settings.showParticles ? `
        // Створення частинок
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                    particlesContainer.appendChild(particle);
                }
            }
        }
        ` : ''}
        
        ${settings.audioSettings?.backgroundMusic?.enabled ? `
        // Управління музикою
        let musicPlaying = false;
        const audio = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        
        function toggleMusic() {
            if (musicPlaying) {
                audio.pause();
                musicPlaying = false;
                musicToggle.textContent = '🔇';
            } else {
                audio.volume = ${settings.audioSettings.backgroundMusic.volume || 0.5};
                audio.play().catch(e => console.log('Audio play failed:', e));
                musicPlaying = true;
                musicToggle.textContent = '🎵';
            }
        }
        
        ${settings.audioSettings.backgroundMusic.autoPlay ? `
        // Автозапуск музики при взаємодії користувача
        document.addEventListener('click', function() {
            if (!musicPlaying) {
                audio.volume = ${settings.audioSettings.backgroundMusic.volume || 0.5};
                audio.play().catch(e => console.log('Audio autoplay failed:', e));
                musicPlaying = true;
                musicToggle.textContent = '🎵';
            }
        }, { once: true });
        ` : ''}
        ` : ''}
        
        // Обробка кліку по кнопці
        function handleButtonClick() {
            // Аналітика кліків
            fetch('/api/analytics/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    previewId: '${preview.id}',
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent
                })
            }).catch(e => console.log('Analytics failed:', e));
            
            // Тут можна додати перенаправлення або інші дії
            alert('Дякуємо за інтерес! Зв\\'яжіться з нами для отримання більше інформації.');
        }
        
        // Ініціалізація
        ${settings.showParticles ? 'createParticles();' : ''}
        
        console.log('Preview loaded with settings:', ${JSON.stringify(settings, null, 2)});
    </script>
</body>
</html>`;
  };

  const deletePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Видалено",
      description: "Превью успішно видалено",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Генератор превью</h2>
        <p className="text-muted-foreground">
          Створюйте та керуйте готовими превью для ваших клієнтів
        </p>
      </div>

      {/* Generate New Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Створити нове превью</CardTitle>
          <CardDescription>
            Згенеруйте готове превью на основі ваших налаштувань
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Назва превью</label>
            <Input
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              placeholder="Наприклад: Превью для ресторану"
              className="mt-1"
            />
          </div>
          <Button 
            onClick={generatePreview} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Генерація...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Згенерувати превью
              </>
            )}
          </Button>
          
          <Button 
            onClick={quickPreview}
            variant="outline"
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Швидкий перегляд поточних налаштувань
          </Button>
        </CardContent>
      </Card>

      {/* Generated Previews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Згенеровані превью ({previews.length})</h3>
        
        {previews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ще немає згенерованих превью. Створіть перше!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {previews.map((preview) => (
              <motion.div
                key={preview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{preview.name}</CardTitle>
                        <CardDescription>
                          Створено: {new Date(preview.createdAt).toLocaleDateString('uk-UA')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewInBrowser(preview)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Переглянути
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPreview(preview)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Завантажити
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePreview(preview.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* URL */}
                    <div>
                      <label className="text-sm font-medium">URL превью</label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={preview.url}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(preview.url, `url-${preview.id}`)}
                        >
                          {copiedId === `url-${preview.id}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Embed Code */}
                    <div>
                      <label className="text-sm font-medium">Код для вставки</label>
                      <div className="flex gap-2 mt-1">
                        <Textarea
                          value={preview.embedCode}
                          readOnly
                          className="flex-1 font-mono text-xs"
                          rows={4}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(preview.embedCode, `embed-${preview.id}`)}
                        >
                          {copiedId === `embed-${preview.id}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewGenerator; 