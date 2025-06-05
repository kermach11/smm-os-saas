import React from 'react';
import { playSound } from '../utils/audioUtils';

interface SoundTestComponentProps {
  audioSettings: {
    hoverSounds: {
      enabled: boolean;
      url: string;
      volume: number;
    };
    clickSounds: {
      enabled: boolean;
      url: string;
      volume: number;
    };
  };
}

const SoundTestComponent: React.FC<SoundTestComponentProps> = ({ audioSettings }) => {
  const handleHover = () => {
    playSound(audioSettings.hoverSounds);
  };

  const handleClick = () => {
    playSound(audioSettings.clickSounds);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Тест звуків наведення</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
          onMouseEnter={handleHover}
          onClick={handleClick}
        >
          <h3 className="text-lg font-semibold">Елемент 1</h3>
          <p className="text-sm opacity-90">Наведіть для звуку</p>
        </div>

        <div
          className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
          onMouseEnter={handleHover}
          onClick={handleClick}
        >
          <h3 className="text-lg font-semibold">Елемент 2</h3>
          <p className="text-sm opacity-90">Наведіть для звуку</p>
        </div>

        <div
          className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
          onMouseEnter={handleHover}
          onClick={handleClick}
        >
          <h3 className="text-lg font-semibold">Елемент 3</h3>
          <p className="text-sm opacity-90">Наведіть для звуку</p>
        </div>

        <div
          className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
          onMouseEnter={handleHover}
          onClick={handleClick}
        >
          <h3 className="text-lg font-semibold">Елемент 4</h3>
          <p className="text-sm opacity-90">Наведіть для звуку</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/10 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">Статус звуків:</h4>
        <p className="text-white/80">
          Звуки наведення: {audioSettings.hoverSounds.enabled ? '✅ Увімкнено' : '❌ Вимкнено'}
        </p>
        <p className="text-white/80">
          Звуки кліків: {audioSettings.clickSounds.enabled ? '✅ Увімкнено' : '❌ Вимкнено'}
        </p>
        <p className="text-white/80">
          Гучність: {Math.round(audioSettings.hoverSounds.volume * 100)}%
        </p>
      </div>
    </div>
  );
};

export default SoundTestComponent; 