import React from 'react';

interface WelcomeSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hintText: string;
  brandColor: string;
  accentColor: string;
  textColor: string;
  subtitleColor: string;
  descriptionColor: string;
  buttonTextColor: string;
  logoUrl: string;
  showLogo: boolean;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  autoPlay: boolean;
  animationStyle: 'fade' | 'slide' | 'zoom' | 'bounce';
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
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

export const DesignTab: React.FC<TabsProps> = ({ settings, updateSettings }) => (
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
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            Основний колір бренду
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.brandColor}
              onChange={(e) => updateSettings({ brandColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.brandColor}
              onChange={(e) => updateSettings({ brandColor: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Акцентний колір
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
              className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
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
  </div>
);

export const BackgroundTab: React.FC<TabsProps> = ({ settings, updateSettings, handleFileUpload, backgroundImageRef, backgroundVideoRef }) => (
  <div className="space-y-6">
    {/* Тип фону */}
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🌅</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Фон</h3>
          <p className="text-sm text-slate-600">Налаштуйте фон вашого сайту</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Тип фону</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'color', label: 'Суцільний колір', icon: '🎨' },
              { value: 'gradient', label: 'Градієнт', icon: '🌈' },
              { value: 'image', label: 'Зображення', icon: '🖼️' },
              { value: 'video', label: 'Відео', icon: '🎬' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => updateSettings({ backgroundType: type.value as any })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  settings.backgroundType === type.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {settings.backgroundType === 'color' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Колір фону</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
              />
            </div>
          </div>
        )}

        {settings.backgroundType === 'gradient' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Градієнт від</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.gradientFrom}
                  onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                  className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={settings.gradientFrom}
                  onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Градієнт до</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={settings.gradientTo}
                  onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                  className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={settings.gradientTo}
                  onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {settings.backgroundType === 'image' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Фонове зображення</label>
            <div className="flex gap-3">
              <button
                onClick={() => backgroundImageRef.current?.click()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {settings.backgroundImage ? 'Змінити зображення' : 'Завантажити зображення'}
              </button>
              {settings.backgroundImage && (
                <button
                  onClick={() => updateSettings({ backgroundImage: '' })}
                  className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
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

        {settings.backgroundType === 'video' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Фонове відео</label>
            <div className="flex gap-3">
              <button
                onClick={() => backgroundVideoRef.current?.click()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {settings.backgroundVideo ? 'Змінити відео' : 'Завантажити відео'}
              </button>
              {settings.backgroundVideo && (
                <button
                  onClick={() => updateSettings({ backgroundVideo: '' })}
                  className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
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

export const AudioTab: React.FC<TabsProps> = ({ settings, updateSettings, handleFileUpload, toggleMusic, musicInputRef }) => (
  <div className="space-y-6">
    {/* Фонова музика */}
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🎵</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Фонова музика</h3>
          <p className="text-sm text-slate-600">Налаштуйте аудіо для превю</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎵</span>
            <div>
              <h4 className="font-semibold text-slate-800">Увімкнути музику</h4>
              <p className="text-sm text-slate-600">Фонова музика для превю</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hasMusic}
              onChange={(e) => updateSettings({ hasMusic: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {settings.hasMusic && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Аудіо файл</label>
              <div className="flex gap-3">
                <button
                  onClick={() => musicInputRef.current?.click()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {settings.musicUrl ? 'Змінити музику' : 'Завантажити музику'}
                </button>
                {settings.musicUrl && (
                  <>
                    <button
                      onClick={toggleMusic}
                      className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200"
                    >
                      ▶️ Тест
                    </button>
                    <button
                      onClick={() => updateSettings({ musicUrl: '', hasMusic: false })}
                      className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
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
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Гучність: {Math.round(settings.musicVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <label className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 cursor-pointer hover:bg-green-100 transition-all">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => updateSettings({ autoPlay: e.target.checked })}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-slate-700">Автоматичне відтворення</span>
            </label>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const AnimationTab: React.FC<TabsProps> = ({ settings, updateSettings }) => (
  <div className="space-y-6">
    {/* Анімації */}
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">✨</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Анімації</h3>
          <p className="text-sm text-slate-600">Налаштуйте ефекти анімації</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Стиль анімації</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'fade', label: 'Плавне з\'явлення', icon: '🌅' },
              { value: 'slide', label: 'Ковзання', icon: '➡️' },
              { value: 'zoom', label: 'Масштабування', icon: '🔍' },
              { value: 'bounce', label: 'Підстрибування', icon: '⚡' }
            ].map((style) => (
              <button
                key={style.value}
                onClick={() => updateSettings({ animationStyle: style.value as any })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  settings.animationStyle === style.value
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="text-sm font-medium">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Швидкість анімації</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'slow', label: 'Повільно', icon: '🐌' },
              { value: 'normal', label: 'Нормально', icon: '🚶' },
              { value: 'fast', label: 'Швидко', icon: '🏃' }
            ].map((speed) => (
              <button
                key={speed.value}
                onClick={() => updateSettings({ animationSpeed: speed.value as any })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  settings.animationSpeed === speed.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{speed.icon}</div>
                <div className="text-sm font-medium">{speed.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-semibold text-slate-800">Частинки</h4>
              <p className="text-sm text-slate-600">Анімовані частинки на фоні</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showParticles}
              onChange={(e) => updateSettings({ showParticles: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>

        {settings.showParticles && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Колір частинок</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.particleColor}
                onChange={(e) => updateSettings({ particleColor: e.target.value })}
                className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
              />
              <input
                type="text"
                value={settings.particleColor}
                onChange={(e) => updateSettings({ particleColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
); 