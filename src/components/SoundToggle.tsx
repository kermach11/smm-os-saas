import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface SoundToggleProps {
  isOn: boolean;
  onToggle: () => void;
  isLoaded?: boolean;
  className?: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

const SoundToggle = ({ isOn, onToggle, isLoaded = true, className = "", onMouseEnter, onClick }: SoundToggleProps) => {
  return (
    <button
      onClick={(e) => {
        onToggle();
        onClick?.();
      }}
      onMouseEnter={onMouseEnter}
      disabled={!isLoaded}
      className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 ${className} ${!isLoaded ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-label={!isLoaded ? "Завантаження звуку..." : isOn ? "Вимкнути звук" : "Увімкнути звук"}
    >
      {!isLoaded ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isOn ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </button>
  );
};

export default SoundToggle; 