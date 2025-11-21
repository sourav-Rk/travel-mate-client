import { useRef, useCallback } from 'react';

interface NotificationSoundOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundBufferRef = useRef<AudioBuffer | null>(null);
  const isInitializedRef = useRef(false);

const initializeAudio = useCallback(async () => {
  if (isInitializedRef.current) return;

  try {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const sampleRate = audioContextRef.current.sampleRate;
    const duration = 1.2; // Increased from 0.8 to 1.2 seconds
    const bufferSize = sampleRate * duration;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Softer bell sound with increased volume and duration
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      
      // C major chord frequencies (C4, E4, G4)
      const freq1 = 261.63; // C4
      const freq2 = 329.63; // E4
      const freq3 = 392.00; // G4
      
      const wave1 = Math.sin(2 * Math.PI * freq1 * t);
      const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.6;
      const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.4;
      
      // Gentle envelope - adjusted for longer duration
      const envelope = Math.exp(-t * 3) * (1 - Math.exp(-t * 12)); // Slower decay
      
      // Increased volume from 0.25 to 0.45 (almost double)
      data[i] = (wave1 + wave2 + wave3) * envelope * 0.45;
    }

    soundBufferRef.current = buffer;
    isInitializedRef.current = true;
  } catch (error) {
    console.warn('Failed to initialize notification sound:', error);
  }
}, []);

  // Play notification sound
  const playNotificationSound = useCallback(async (options: NotificationSoundOptions = {}) => {
    const {
      volume = 0.5,
      loop = false,
      fadeIn = true,
      fadeOut = true
    } = options;

    try {
      // Initialize if not already done
      if (!isInitializedRef.current) {
        await initializeAudio();
      }

      if (!audioContextRef.current || !soundBufferRef.current) {
        console.warn('Audio not initialized');
        return;
      }

      // Resume audio context if suspended (required for user interaction)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create sound source
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = soundBufferRef.current;
      source.loop = loop;
      
      // Set initial volume
      gainNode.gain.value = fadeIn ? 0 : volume;
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Fade in effect
      if (fadeIn) {
        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.1);
      }

      // Fade out effect
      if (fadeOut && !loop) {
        const duration = soundBufferRef.current.duration;
        gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime + duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration);
      }

      // Play the sound
      source.start();

      // Clean up when finished
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };

    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }, [initializeAudio]);

  // Play different types of notification sounds
  const playSuccessSound = useCallback(() => {
    playNotificationSound({ volume: 0.4 });
  }, [playNotificationSound]);

  const playErrorSound = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        await initializeAudio();
      }

      if (!audioContextRef.current) return;

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const sampleRate = audioContextRef.current.sampleRate;
      const duration = 0.3;
      const bufferSize = sampleRate * duration;
      const buffer = audioContextRef.current.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Create error sound (lower frequency, more abrupt)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate;
        const frequency = 200 + Math.sin(t * 10) * 50; // Oscillating frequency
        const envelope = Math.exp(-t * 15);
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
      }

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = 0.3;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start();
      
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Failed to play error sound:', error);
    }
  }, [initializeAudio]);

  const playMessageSound = useCallback(() => {
    playNotificationSound({ volume: 0.3 });
  }, [playNotificationSound]);

  const playBookingSound = useCallback(() => {
    playNotificationSound({ volume: 0.6 });
  }, [playNotificationSound]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    soundBufferRef.current = null;
    isInitializedRef.current = false;
  }, []);

  return {
    playNotificationSound,
    playSuccessSound,
    playErrorSound,
    playMessageSound,
    playBookingSound,
    initializeAudio,
    cleanup
  };
};

























