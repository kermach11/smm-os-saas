import { useState, useRef, useEffect } from 'react';

interface UseAudioOptions {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
  useRealAudioFirst?: boolean;
  fallbackToWebAudio?: boolean;
  oscillatorFrequency?: number;
  oscillatorType?: 'sine' | 'square' | 'sawtooth' | 'triangle';
}

export const useAudio = (src: string, options: UseAudioOptions = {}) => {
  const { 
    volume = 0.5, 
    loop = true, 
    autoPlay = false,
    useRealAudioFirst = true,
    fallbackToWebAudio = true,
    oscillatorFrequency = 220,
    oscillatorType = 'sine'
  } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canAutoPlay, setCanAutoPlay] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const [audioMode, setAudioMode] = useState<'web-audio' | 'real-audio' | 'loading'>('loading');

  useEffect(() => {
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0;
    gainNodeRef.current = gainNode;
    
    // Load and decode audio file
    loadAudioBuffer();

    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Source already stopped
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [src]);

  const loadAudioBuffer = async () => {
    if (!audioContextRef.current) return;

    try {
      // Fetch the audio file
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      audioBufferRef.current = audioBuffer;
      
      setAudioMode('real-audio');
      setIsLoaded(true);
      
      if (autoPlay) {
        tryAutoPlay();
      }
    } catch (error) {
      if (fallbackToWebAudio) {
        setAudioMode('web-audio');
        setIsLoaded(true);
        
        if (autoPlay) {
          tryAutoPlay();
        }
      }
    }
  };

  const createOscillator = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return null;
    
    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = oscillatorType;
    oscillator.frequency.setValueAtTime(oscillatorFrequency, audioContextRef.current.currentTime);
    oscillator.connect(gainNodeRef.current);
    
    return oscillator;
  };

  const createBufferSource = () => {
    if (!audioContextRef.current || !gainNodeRef.current || !audioBufferRef.current) return null;
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.loop = loop;
    source.connect(gainNodeRef.current);
    
    return source;
  };

  const tryAutoPlay = async () => {
    if (!audioContextRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setCanAutoPlay(true);
      await play();
    } catch (error) {
      setCanAutoPlay(false);
      setIsPlaying(false);
    }
  };

  const fadeVolume = (targetVolume: number, duration: number = 1000) => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime;
    gainNodeRef.current.gain.cancelScheduledValues(currentTime);
    gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, currentTime + duration / 1000);
  };

  const play = async () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Stop existing source
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }

      if (audioMode === 'real-audio' && audioBufferRef.current) {
        // Play real audio through Web Audio API
        const source = createBufferSource();
        if (!source) return;

        sourceNodeRef.current = source;
        source.start();
        
        setIsPlaying(true);
        setCanAutoPlay(true);
        
        fadeVolume(volume, 800);
        
        // Handle end event for non-looping audio
        if (!loop) {
          source.onended = () => {
            setIsPlaying(false);
            sourceNodeRef.current = null;
          };
        }
      } else {
        // Fallback to oscillator
        const oscillator = createOscillator();
        if (!oscillator) return;

        sourceNodeRef.current = oscillator;
        oscillator.start();
        
        setIsPlaying(true);
        setCanAutoPlay(true);
        
        fadeVolume(volume * 0.1, 800); // Quieter for oscillator
      }
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (!sourceNodeRef.current) return;
    
    fadeVolume(0, 600);
    
    setTimeout(() => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
          sourceNodeRef.current = null;
        } catch (e) {
          // Already stopped
        }
      }
      setIsPlaying(false);
    }, 600);
  };

  const toggle = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const setVolume = (newVolume: number) => {
    if (gainNodeRef.current) {
      fadeVolume(newVolume, 300);
    }
  };

  return {
    isPlaying,
    isLoaded,
    canAutoPlay,
    play,
    pause,
    toggle,
    setVolume,
    audioMode
  };
}; 