export const useGlobalAudio = () => {
  // Застарілий глобальний аудіо більше не використовується - вся музика тепер керується через конструктори
  return {
    isPlaying: false,
    toggle: () => {},
    isLoaded: true,
    canAutoPlay: true,
    play: () => Promise.resolve()
  };
}; 