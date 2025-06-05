import { motion } from "framer-motion";
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
    <motion.button
      onClick={(e) => {
        onToggle();
        onClick?.();
      }}
      onMouseEnter={onMouseEnter}
      disabled={!isLoaded}
      className={`relative p-[6px] rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${className} ${!isLoaded ? 'opacity-60 cursor-not-allowed' : ''}`}
      style={{
        background: 'linear-gradient(to bottom, rgba(244,244,247,0.95), rgba(250,250,252,0.9))',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06)',
        border: '1px solid rgba(255,255,255,0.8)',
        color: isOn ? '#007AFF' : '#8E8E93',
        transform: 'translateZ(5px)',
        transformStyle: 'preserve-3d'
      }}
      whileHover={isLoaded ? {
        boxShadow: '0 6px 16px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.08)',
        transition: { duration: 0.2 }
      } : {}}
      whileTap={isLoaded ? {
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      aria-label={!isLoaded ? "Завантаження звуку..." : isOn ? "Вимкнути звук" : "Увімкнути звук"}
    >
      {/* Enhanced glass border effect */}
      <div 
        className="absolute -inset-[1px] rounded-full z-[-1] pointer-events-none"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(250,250,255,0.7))',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.8)',
          transform: 'translateZ(-1px)'
        }}
      />
      
      {/* Inner glow effect when active */}
      {isOn && isLoaded && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'radial-gradient(circle, rgba(0,122,255,0.1) 0%, transparent 70%)',
          }}
        />
      )}
      
      {/* Icon with smooth transition */}
      <motion.div
        key={!isLoaded ? 'loading' : isOn ? 'on' : 'off'}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {!isLoaded ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isOn ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
      </motion.div>
      
      {/* Subtle ripple effect on click */}
      {isLoaded && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1.5, opacity: 0.1 }}
          style={{
            background: isOn ? 'rgba(0,122,255,0.3)' : 'rgba(142,142,147,0.3)',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default SoundToggle; 