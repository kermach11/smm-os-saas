import React from 'react';

interface WelcomeSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hintText: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  textColor: string;
  subtitleColor: string;
  descriptionColor: string;
  buttonColor: string;
  buttonTextColor: string;
  logoUrl: string;
  logoSize?: number;
  showLogo: boolean;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  autoPlay: boolean;
  animationStyle: 'fade' | 'slide' | 'zoom' | 'bounce';
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
  // Typography settings
  titleFontSize?: number;
  subtitleFontSize?: number;
  descriptionFontSize?: number;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  descriptionFontFamily?: string;
  titleFontWeight?: number;
  subtitleFontWeight?: number;
  descriptionFontWeight?: number;
  titleFontStyle?: string;
  subtitleFontStyle?: string;
  descriptionFontStyle?: string;
  // Тіні та ефекти
  titleShadowIntensity?: number;
  subtitleShadowIntensity?: number;
  descriptionShadowIntensity?: number;
  titleShadowColor?: string;
  subtitleShadowColor?: string;
  descriptionShadowColor?: string;
  title3DDepth?: number;
  subtitle3DDepth?: number;
  description3DDepth?: number;
  splineSettings?: {
    enabled: boolean;
    sceneUrl: string;
    embedCode: string;
    localFile: string;
    position: 'background' | 'foreground' | 'overlay';
    opacity: number;
    scale: number;
    autoplay: boolean;
    controls: boolean;
    method: 'iframe' | 'component' | 'local';
  };
}

interface TabsProps {
  activeTab: string;
  settings: WelcomeSettings;
  updateSettings: (updates: Partial<WelcomeSettings>) => void;
  handleFileUpload: (file: File, type: 'logo' | 'backgroundImage' | 'backgroundVideo' | 'music') => void;
  toggleMusic: () => void;
  backgroundImageRef: React.RefObject<HTMLInputElement>;
  backgroundVideoRef: React.RefObject<HTMLInputElement>;
  musicInputRef: React.RefObject<HTMLInputElement>;
}

export const DesignTab: React.FC<TabsProps> = ({ settings, updateSettings }) => {
  console.log('🎨 DesignTab отримав налаштування:', {
    titleFontSize: settings.titleFontSize,
    titleFontFamily: settings.titleFontFamily,
    titleFontWeight: settings.titleFontWeight,
    // Додаю логи для тіней
    titleShadowIntensity: settings.titleShadowIntensity,
    titleShadowColor: settings.titleShadowColor,
    title3DDepth: settings.title3DDepth,
    subtitleShadowIntensity: settings.subtitleShadowIntensity,
    descriptionShadowIntensity: settings.descriptionShadowIntensity
  });
  
  return (
  <div className="space-y-6">
    {/* Кольорова схема */}
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🎨</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Кольорова схема</h3>
          <p className="text-sm text-slate-600">Налаштуйте кольори вашого сайту</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Колір кнопки
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.buttonColor}
              onChange={(e) => updateSettings({ buttonColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.buttonColor}
              onChange={(e) => updateSettings({ buttonColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            Колір заголовку
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSettings({ textColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.textColor}
              onChange={(e) => updateSettings({ textColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Колір підзаголовку
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.subtitleColor}
              onChange={(e) => updateSettings({ subtitleColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.subtitleColor}
              onChange={(e) => updateSettings({ subtitleColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Колір опису
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.descriptionColor}
              onChange={(e) => updateSettings({ descriptionColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.descriptionColor}
              onChange={(e) => updateSettings({ descriptionColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Колір тексту кнопки
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.buttonTextColor}
              onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.buttonTextColor}
              onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Типографія */}
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">✍️</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Типографія</h3>
          <p className="text-sm text-slate-600">Налаштуйте шрифти та розміри тексту</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Typography */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Заголовок</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Розмір</label>
              <input
                type="range"
                min="20"
                max="80"
                value={settings.titleFontSize || 32}
                                 onChange={(e) => {
                   const newSize = parseInt(e.target.value);
                   console.log('🔤 Оновлення розміру заголовка:', newSize);
                   updateSettings({ titleFontSize: newSize });
                 }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">{settings.titleFontSize || 32}px</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Сімейство шрифтів</label>
              <select
                value={settings.titleFontFamily || 'Inter'}
                onChange={(e) => updateSettings({ titleFontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Жирність</label>
              <select
                value={settings.titleFontWeight || 300}
                onChange={(e) => updateSettings({ titleFontWeight: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value={100}>Тонкий (100)</option>
                <option value={300}>Легкий (300)</option>
                <option value={400}>Звичайний (400)</option>
                <option value={600}>Напівжирний (600)</option>
                <option value={700}>Жирний (700)</option>
                <option value={900}>Дуже жирний (900)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Стиль</label>
              <select
                value={settings.titleFontStyle || 'normal'}
                onChange={(e) => updateSettings({ titleFontStyle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="normal">Звичайний</option>
                <option value="italic">Курсив</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subtitle Typography */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Підзаголовок</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Розмір</label>
              <input
                type="range"
                min="14"
                max="40"
                value={settings.subtitleFontSize || 20}
                onChange={(e) => updateSettings({ subtitleFontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">{settings.subtitleFontSize || 20}px</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Шрифт</label>
              <select
                value={settings.subtitleFontFamily || 'Inter'}
                onChange={(e) => updateSettings({ subtitleFontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Жирність</label>
              <select
                value={settings.subtitleFontWeight || 300}
                onChange={(e) => updateSettings({ subtitleFontWeight: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value={100}>Тонкий (100)</option>
                <option value={300}>Легкий (300)</option>
                <option value={400}>Звичайний (400)</option>
                <option value={600}>Напівжирний (600)</option>
                <option value={700}>Жирний (700)</option>
                <option value={900}>Дуже жирний (900)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Стиль</label>
              <select
                value={settings.subtitleFontStyle || 'normal'}
                onChange={(e) => updateSettings({ subtitleFontStyle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="normal">Звичайний</option>
                <option value="italic">Курсив</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Typography */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Опис</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Розмір</label>
              <input
                type="range"
                min="10"
                max="24"
                value={settings.descriptionFontSize || 14}
                onChange={(e) => updateSettings({ descriptionFontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-slate-500 mt-1">{settings.descriptionFontSize || 14}px</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Шрифт</label>
              <select
                value={settings.descriptionFontFamily || 'Inter'}
                onChange={(e) => updateSettings({ descriptionFontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Жирність</label>
              <select
                value={settings.descriptionFontWeight || 400}
                onChange={(e) => updateSettings({ descriptionFontWeight: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value={100}>Тонкий (100)</option>
                <option value={300}>Легкий (300)</option>
                <option value={400}>Звичайний (400)</option>
                <option value={600}>Напівжирний (600)</option>
                <option value={700}>Жирний (700)</option>
                <option value={900}>Дуже жирний (900)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Стиль</label>
              <select
                value={settings.descriptionFontStyle || 'normal'}
                onChange={(e) => updateSettings({ descriptionFontStyle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option value="normal">Звичайний</option>
                <option value="italic">Курсив</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Тіні та ефекти */}
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🌟</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Тіні та ефекти</h3>
          <p className="text-sm text-slate-600">Додайте глибину вашому тексту</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Shadow */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Заголовок</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Інтенсивність тіні: {settings.titleShadowIntensity || 0}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.titleShadowIntensity || 0}
                onChange={(e) => updateSettings({ titleShadowIntensity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Колір тіні</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.titleShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ titleShadowColor: e.target.value })}
                  className="w-12 h-8 border-2 border-slate-200 rounded-lg cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={settings.titleShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ titleShadowColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                3D глибина: {settings.title3DDepth || 0}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.title3DDepth || 0}
                onChange={(e) => updateSettings({ title3DDepth: parseInt(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Subtitle Shadow */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Підзаголовок</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Інтенсивність тіні: {settings.subtitleShadowIntensity || 0}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.subtitleShadowIntensity || 0}
                onChange={(e) => updateSettings({ subtitleShadowIntensity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Колір тіні</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.subtitleShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ subtitleShadowColor: e.target.value })}
                  className="w-12 h-8 border-2 border-slate-200 rounded-lg cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={settings.subtitleShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ subtitleShadowColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                3D глибина: {settings.subtitle3DDepth || 0}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.subtitle3DDepth || 0}
                onChange={(e) => updateSettings({ subtitle3DDepth: parseInt(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Description Shadow */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Опис</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Інтенсивність тіні: {settings.descriptionShadowIntensity || 0}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.descriptionShadowIntensity || 0}
                onChange={(e) => updateSettings({ descriptionShadowIntensity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Колір тіні</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.descriptionShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ descriptionShadowColor: e.target.value })}
                  className="w-12 h-8 border-2 border-slate-200 rounded-lg cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={settings.descriptionShadowColor || '#000000'}
                  onChange={(e) => updateSettings({ descriptionShadowColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                3D глибина: {settings.description3DDepth || 0}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.description3DDepth || 0}
                onChange={(e) => updateSettings({ description3DDepth: parseInt(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const BackgroundTab: React.FC<TabsProps> = ({ settings, updateSettings, handleFileUpload, backgroundImageRef, backgroundVideoRef }) => {
  return (
  <div className="space-y-2 lg:space-y-6">
    {/* Тип фону - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-lg">🌅</span>
        </div>
        <div>
          <h3 className="text-xs lg:text-lg font-bold text-slate-800">Фон</h3>
          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Налаштуйте фон вашого сайту</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-5">
        <div>
          <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Тип фону</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 lg:gap-3">
            {[
              { value: 'color', label: 'Суцільний колір', shortLabel: 'Колір', icon: '🎨' },
              { value: 'gradient', label: 'Градієнт', shortLabel: 'Градієнт', icon: '🌈' },
              { value: 'image', label: 'Зображення', shortLabel: 'Фото', icon: '🖼️' },
              { value: 'video', label: 'Відео', shortLabel: 'Відео', icon: '🎬' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => updateSettings({ backgroundType: type.value as any })}
                className={`p-1.5 lg:p-4 rounded-md lg:rounded-xl border-2 transition-all duration-200 min-h-[55px] lg:min-h-[auto] touch-manipulation flex flex-col items-center justify-center ${
                  settings.backgroundType === type.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-base lg:text-2xl mb-0.5 lg:mb-2">{type.icon}</div>
                <div className="text-xs lg:text-sm font-medium text-center leading-tight">
                  <span className="lg:hidden">{type.shortLabel}</span>
                  <span className="hidden lg:inline">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Налаштування кольору - МОБІЛЬНО ОПТИМІЗОВАНІ */}
        {settings.backgroundType === 'color' && (
          <div className="px-1">
            <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Колір фону
            </label>
            <div className="flex gap-2 lg:gap-3">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[32px] lg:min-h-[auto] touch-manipulation"
                placeholder="#ffffff"
              />
            </div>
          </div>
        )}

        {/* Налаштування градієнта - МОБІЛЬНО ОПТИМІЗОВАНІ */}
        {settings.backgroundType === 'gradient' && (
          <div className="space-y-2 lg:space-y-4 px-1">
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></span>
                Градієнт від
              </label>
              <div className="flex gap-2 lg:gap-3">
                <input
                  type="color"
                  value={settings.gradientFrom}
                  onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                  className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                />
                <input
                  type="text"
                  value={settings.gradientFrom}
                  onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                  className="flex-1 px-3 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[32px] lg:min-h-[auto] touch-manipulation"
                  placeholder="#4f46e5"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                Градієнт до
              </label>
              <div className="flex gap-2 lg:gap-3">
                <input
                  type="color"
                  value={settings.gradientTo}
                  onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                  className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                />
                <input
                  type="text"
                  value={settings.gradientTo}
                  onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                  className="flex-1 px-3 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[32px] lg:min-h-[auto] touch-manipulation"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        )}

        {/* Налаштування зображення - МОБІЛЬНО ОПТИМІЗОВАНІ */}
        {settings.backgroundType === 'image' && (
          <div className="px-1">
            <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Фонове зображення
            </label>
            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => backgroundImageRef.current?.click()}
                className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-md lg:rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-base min-h-[40px] lg:min-h-[auto] touch-manipulation flex items-center justify-center gap-1"
              >
                📚 <span className="lg:hidden">{settings.backgroundImage ? 'Змінити' : 'Вибрати'}</span>
                <span className="hidden lg:inline">{settings.backgroundImage ? 'Змінити зображення' : 'Завантажити зображення'}</span>
              </button>
              {settings.backgroundImage && (
                <button
                  onClick={() => updateSettings({ backgroundImage: '' })}
                  className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              ref={backgroundImageRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'backgroundImage');
              }}
              className="hidden"
            />
          </div>
        )}

        {/* Налаштування відео - МОБІЛЬНО ОПТИМІЗОВАНІ */}
        {settings.backgroundType === 'video' && (
          <div className="px-1">
            <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Фонове відео
            </label>
            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => backgroundVideoRef.current?.click()}
                className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-md lg:rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-base min-h-[40px] lg:min-h-[auto] touch-manipulation flex items-center justify-center gap-1"
              >
                📚 <span className="lg:hidden">{settings.backgroundVideo ? 'Змінити' : 'Вибрати'}</span>
                <span className="hidden lg:inline">{settings.backgroundVideo ? 'Змінити відео' : 'Завантажити відео'}</span>
              </button>
              {settings.backgroundVideo && (
                <button
                  onClick={() => updateSettings({ backgroundVideo: '' })}
                  className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              ref={backgroundVideoRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'backgroundVideo');
              }}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export const AudioTab: React.FC<TabsProps> = ({ settings, updateSettings, handleFileUpload, toggleMusic, musicInputRef }) => {
  return (
  <div className="space-y-2 lg:space-y-6">
    {/* Фонова музика - МОБІЛЬНО ОПТИМІЗОВАНА */}
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-green-100 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-lg">🎵</span>
        </div>
        <div>
          <h3 className="text-xs lg:text-lg font-bold text-slate-800">Фонова музика</h3>
          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Налаштуйте аудіо для превю</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-5">
        <div className="flex items-center justify-between p-2 lg:p-4 bg-green-50 rounded-md lg:rounded-xl border border-green-100">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-lg lg:text-2xl">🎵</span>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs lg:text-base">Увімкнути музику</h4>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Фонова музика для превю</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hasMusic}
              onChange={(e) => updateSettings({ hasMusic: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-green-500 touch-manipulation"></div>
          </label>
        </div>

        {/* Налаштування музики - МОБІЛЬНО ОПТИМІЗОВАНІ */}
        {settings.hasMusic && (
          <div className="space-y-2 lg:space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Аудіо файл</label>
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => musicInputRef.current?.click()}
                  className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md lg:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-base min-h-[40px] lg:min-h-[auto] touch-manipulation"
                >
                  📚 {settings.musicUrl ? 'Змінити музику' : 'Завантажити музику'}
                </button>
                {settings.musicUrl && (
                  <>
                    <button
                      onClick={toggleMusic}
                      className="px-2 lg:px-4 py-2 lg:py-3 bg-blue-500 text-white rounded-md lg:rounded-xl hover:bg-blue-600 transition-all duration-200 min-h-[40px] lg:min-h-[auto] min-w-[50px] lg:min-w-[auto] touch-manipulation text-xs lg:text-base"
                    >
                      ▶️ <span className="hidden lg:inline">Тест</span>
                    </button>
                    <button
                      onClick={() => updateSettings({ musicUrl: '', hasMusic: false })}
                      className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'music');
                }}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                Гучність: {Math.round(settings.musicVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
                className="w-full h-1.5 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider modern-slider touch-manipulation"
              />
            </div>

            <label className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 bg-green-50 rounded-md lg:rounded-xl border border-green-100 cursor-pointer hover:bg-green-100 transition-all touch-manipulation">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => updateSettings({ autoPlay: e.target.checked })}
                className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 touch-manipulation"
              />
              <span className="text-xs lg:text-sm font-medium text-slate-700">Автоматичне відтворення</span>
            </label>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export const AnimationTab: React.FC<TabsProps> = ({ settings, updateSettings }) => {
  return (
  <div className="space-y-2 lg:space-y-6">
    {/* Анімації - МОБІЛЬНО ОПТИМІЗОВАНІ */}
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-pink-100 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-lg">✨</span>
        </div>
        <div>
          <h3 className="text-xs lg:text-lg font-bold text-slate-800">Анімації</h3>
          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Налаштуйте ефекти анімації</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-5">
        <div>
          <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Стиль анімації</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            {[
              { value: 'fade', label: 'Плавне з\'явлення', icon: '🌅' },
              { value: 'slide', label: 'Ковзання', icon: '➡️' },
              { value: 'zoom', label: 'Масштабування', icon: '🔍' },
              { value: 'bounce', label: 'Підстрибування', icon: '⚡' }
            ].map((style) => (
              <button
                key={style.value}
                onClick={() => updateSettings({ animationStyle: style.value as any })}
                className={`p-2 lg:p-4 rounded-md lg:rounded-xl border-2 transition-all duration-200 min-h-[60px] lg:min-h-[auto] touch-manipulation ${
                  settings.animationStyle === style.value
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-lg lg:text-2xl mb-1 lg:mb-2">{style.icon}</div>
                <div className="text-xs lg:text-sm font-medium leading-tight break-words">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Швидкість анімації</label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
            {[
              { value: 'slow', label: 'Повільно', icon: '🐌' },
              { value: 'normal', label: 'Нормально', icon: '🚶' },
              { value: 'fast', label: 'Швидко', icon: '🏃' }
            ].map((speed) => (
              <button
                key={speed.value}
                onClick={() => updateSettings({ animationSpeed: speed.value as any })}
                className={`p-2 lg:p-4 rounded-md lg:rounded-xl border-2 transition-all duration-200 min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                  settings.animationSpeed === speed.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-lg lg:text-2xl mb-1 lg:mb-2">{speed.icon}</div>
                <div className="text-xs lg:text-sm font-medium">{speed.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-2 lg:p-4 bg-purple-50 rounded-md lg:rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-lg lg:text-2xl">✨</span>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs lg:text-base">Частинки</h4>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Анімовані частинки на фоні</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showParticles}
              onChange={(e) => updateSettings({ showParticles: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-purple-500 touch-manipulation"></div>
          </label>
        </div>

        {/* Колір частинок - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
        {settings.showParticles && (
          <div>
            <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Колір частинок</label>
            <div className="flex gap-2 lg:gap-3">
              <input
                type="color"
                value={settings.particleColor}
                onChange={(e) => updateSettings({ particleColor: e.target.value })}
                className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
              />
              <input
                type="text"
                value={settings.particleColor}
                onChange={(e) => updateSettings({ particleColor: e.target.value })}
                className="flex-1 px-3 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[32px] lg:min-h-[auto] touch-manipulation"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    {/* 3D Spline анімація */}
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-blue-100 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-lg">🎭</span>
        </div>
        <div>
          <h3 className="text-xs lg:text-lg font-bold text-slate-800">3D Анімація</h3>
          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Налаштуйте Spline 3D анімацію</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-5">
        <div className="flex items-center justify-between p-2 lg:p-4 bg-blue-50 rounded-md lg:rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-lg lg:text-2xl">🎭</span>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs lg:text-base">Увімкнути 3D анімацію</h4>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Spline 3D сцена на фоні</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.splineSettings?.enabled || false}
              onChange={(e) => updateSettings({ 
                splineSettings: { 
                  ...settings.splineSettings, 
                  enabled: e.target.checked 
                } 
              })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-blue-500 touch-manipulation"></div>
          </label>
        </div>

        {settings.splineSettings?.enabled && (
          <div className="space-y-2 lg:space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">URL Spline сцени</label>
              <input
                type="text"
                value={settings.splineSettings?.sceneUrl || ''}
                onChange={(e) => updateSettings({ 
                  splineSettings: { 
                    ...settings.splineSettings, 
                    sceneUrl: e.target.value 
                  } 
                })}
                placeholder="https://prod.spline.design/..."
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[32px] lg:min-h-[auto] touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">Позиція</label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
                {[
                  { value: 'background', label: 'Фон', icon: '🖼️' },
                  { value: 'foreground', label: 'Передній план', icon: '🎬' },
                  { value: 'overlay', label: 'Накладення', icon: '🔝' }
                ].map((position) => (
                  <button
                    key={position.value}
                    onClick={() => updateSettings({ 
                      splineSettings: { 
                        ...settings.splineSettings, 
                        position: position.value as any 
                      } 
                    })}
                    className={`p-2 lg:p-4 rounded-md lg:rounded-xl border-2 transition-all duration-200 min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                      settings.splineSettings?.position === position.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-lg lg:text-2xl mb-1 lg:mb-2">{position.icon}</div>
                    <div className="text-xs lg:text-sm font-medium">{position.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                Прозорість: {Math.round((settings.splineSettings?.opacity || 1) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.splineSettings?.opacity || 1}
                onChange={(e) => updateSettings({ 
                  splineSettings: { 
                    ...settings.splineSettings, 
                    opacity: parseFloat(e.target.value) 
                  } 
                })}
                className="w-full h-1.5 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider modern-slider touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                Масштаб: {Math.round((settings.splineSettings?.scale || 1) * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.splineSettings?.scale || 1}
                onChange={(e) => updateSettings({ 
                  splineSettings: { 
                    ...settings.splineSettings, 
                    scale: parseFloat(e.target.value) 
                  } 
                })}
                className="w-full h-1.5 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider modern-slider touch-manipulation"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <label className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all touch-manipulation">
                <input
                  type="checkbox"
                  checked={settings.splineSettings?.autoplay || false}
                  onChange={(e) => updateSettings({ 
                    splineSettings: { 
                      ...settings.splineSettings, 
                      autoplay: e.target.checked 
                    } 
                  })}
                  className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 touch-manipulation"
                />
                <span className="text-xs lg:text-sm font-medium text-slate-700">Автопрогравання</span>
              </label>

              <label className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all touch-manipulation">
                <input
                  type="checkbox"
                  checked={settings.splineSettings?.controls || false}
                  onChange={(e) => updateSettings({ 
                    splineSettings: { 
                      ...settings.splineSettings, 
                      controls: e.target.checked 
                    } 
                  })}
                  className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 touch-manipulation"
                />
                <span className="text-xs lg:text-sm font-medium text-slate-700">Елементи керування</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}; 