// The Game Loop - where time itself feeds or starves our creature...
import { useEffect } from 'react';
import { usePetStore } from './petStore';

// Configuration for the game loop's dark rituals
export interface GameLoopConfig {
  decayIntervalMs?: number;  // Default: 60000 (60 seconds) - the sands of time
  decayAmount?: number;      // Default: 1 - the toll of existence
  healthGain?: number;       // Default: 5 - the vitality from coding
  xpGain?: number;           // Default: 1 - the essence accumulated
}

// The hook that binds time and events to our pet's fate
export const useGameLoop = (config?: GameLoopConfig): void => {
  const {
    decayIntervalMs = 60000,  // 60 seconds - the default decay cycle
    decayAmount = 1,
    healthGain = 5,
    xpGain = 1,
  } = config || {};

  useEffect(() => {
    // Summoning the store actions from the void
    const { decreaseHealth, increaseHealth, increaseXP } = usePetStore.getState();

    // The decay timer - entropy claims all things
    console.log('🦇 Starting the decay timer... Time hungers for life force.');
    const decayTimer = setInterval(() => {
      console.log(`🦇 Decay strikes! Draining ${decayAmount} health...`);
      decreaseHealth(decayAmount);
      
      // Check if death has claimed our companion
      const currentHealth = usePetStore.getState().health;
      if (currentHealth === 0) {
        console.log('💀 The pet has crossed into the shadow realm...');
      }
    }, decayIntervalMs);

    // The file change listener - coding activity feeds the beast
    const handleFileChanged = (event: { type: string; path: string; timestamp: number }) => {
      console.log(`🦇 File changed detected: ${event.path} - Feeding the creature!`);
      increaseHealth(healthGain);
      increaseXP(xpGain);
      
      const state = usePetStore.getState();
      console.log(`🦇 Pet fed! Health: ${state.health}, XP: ${state.xp}, Stage: ${state.stage}`);
    };

    // Subscribing to the whispers from the crypt
    if (window.electronAPI) {
      console.log('🦇 Listening for file changes from the crypt...');
      window.electronAPI.onFileChanged(handleFileChanged);
    } else {
      console.warn('🦇 The bridge to the crypt is broken! No file events will reach us.');
    }

    // The cleanup ritual - banishing timers and listeners when the séance ends
    return () => {
      console.log('🦇 Ending the game loop... Silencing the decay timer and file listeners.');
      clearInterval(decayTimer);
      
      if (window.electronAPI) {
        window.electronAPI.removeFileListeners();
      }
    };
  }, [decayIntervalMs, decayAmount, healthGain, xpGain]);
};
