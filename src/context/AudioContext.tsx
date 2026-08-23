import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playCrackle: (intensity?: number) => void;
  playDrip: () => void;
  playClick: () => void;
  playRoastHum: (active: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleAudio: () => {},
  playCrackle: () => {},
  playDrip: () => {},
  playClick: () => {},
  playRoastHum: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientSourceRef = useRef<AudioNode | null>(null);
  const roastGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context on demand
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // Ambient Roastery Drone Generator (Brown Noise + Subtle Low Resonance)
  const startAmbient = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    // Create 5 seconds buffer of brown noise
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain adjustment
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Low-pass filter simulating warm acoustic space
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    ambientSourceRef.current = noise;
    ambientGainRef.current = gain;
  }, []);

  const stopAmbient = useCallback(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      ambientGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
      setTimeout(() => {
        if (ambientSourceRef.current) {
          (ambientSourceRef.current as AudioBufferSourceNode).stop?.();
          ambientSourceRef.current = null;
        }
      }, 1000);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    initAudio();
    if (!isPlaying) {
      startAmbient();
      setIsPlaying(true);
    } else {
      stopAmbient();
      setIsPlaying(false);
    }
  }, [initAudio, isPlaying, startAmbient, stopAmbient]);

  // Coffee Bean Crackle (Impulse Pop)
  const playCrackle = useCallback((intensity = 1) => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const volume = 0.04 * Math.min(intensity, 2);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [isPlaying]);

  // Espresso Drip / Crema Ripple Tone
  const playDrip = useCallback(() => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }, [isPlaying]);

  // UI Subtle Click Tone
  const playClick = useCallback(() => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }, [isPlaying]);

  // Roaster Drum Hum Intensity
  const playRoastHum = useCallback((active: boolean) => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    if (active && !roastGainRef.current) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      roastGainRef.current = gain;
    } else if (!active && roastGainRef.current) {
      roastGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      roastGainRef.current = null;
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        toggleAudio,
        playCrackle,
        playDrip,
        playClick,
        playRoastHum,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
