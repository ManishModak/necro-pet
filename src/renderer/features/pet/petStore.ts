// Summoning the Pet Store from the digital void...
import { create } from 'zustand';
import { WeatherState } from '../../services/weatherService';

// Stage enum - The evolutionary forms of our undead companion
export const Stage = {
  EGG: 'EGG',
  LARVA: 'LARVA',
  BEAST: 'BEAST',
  GHOST: 'GHOST'
} as const;
export type Stage = typeof Stage[keyof typeof Stage];

// Mood enum - The emotional states of the creature
export const Mood = {
  HAPPY: 'HAPPY',
  HUNGRY: 'HUNGRY',
  DEAD: 'DEAD'
} as const;
export type Mood = typeof Mood[keyof typeof Mood];

// The vital statistics of our necromantic pet
export interface PetState {
  health: number;      // 0-100, the life force
  xp: number;          // 0-infinity, the accumulated essence
  stage: Stage;        // Current evolutionary form
  mood: Mood;          // Current emotional state
}

// The world context - environmental forces affecting our creature
export interface WorldContextState {
  weather: WeatherState;  // The atmospheric conditions
  isNight: boolean;       // Whether darkness has fallen
}

// Actions to manipulate the pet's existence
export interface PetActions {
  decreaseHealth: (amount: number) => void;
  increaseHealth: (amount: number) => void;
  increaseXP: (amount: number) => void;
  reset: () => void;
}

// Actions to manipulate the world context
export interface WorldContextActions {
  setWeather: (weather: WeatherState) => void;
  setIsNight: (isNight: boolean) => void;
}

// Pure function: Clamp health to the mortal bounds [0, 100]
export const clampHealth = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

// Pure function: Calculate stage based on XP and health
// Death overrides all - the GHOST stage claims those with no life force
export const calculateStage = (xp: number, health: number): Stage => {
  // The dead transcend all evolutionary stages
  if (health === 0) {
    return Stage.GHOST;
  }
  
  // The living evolve through XP thresholds
  if (xp <= 10) {
    return Stage.EGG;
  } else if (xp <= 50) {
    return Stage.LARVA;
  } else {
    return Stage.BEAST;
  }
};

// Pure function: Calculate mood based on health
export const calculateMood = (health: number): Mood => {
  if (health === 0) {
    return Mood.DEAD;
  } else if (health > 50) {
    return Mood.HAPPY;
  } else {
    return Mood.HUNGRY;
  }
};

// The Zustand store - the heart of our necromantic creation
export const usePetStore = create<PetState & WorldContextState & PetActions & WorldContextActions>((set) => ({
  // Initial state - a freshly summoned creature
  health: 100,
  xp: 0,
  stage: Stage.EGG,
  mood: Mood.HAPPY,
  
  // Initial world context - clear skies and daylight
  weather: 'CLEAR',
  isNight: false,

  // Decrease health - the decay of life
  decreaseHealth: (amount: number) => set((state) => {
    const newHealth = clampHealth(state.health - amount);
    return {
      health: newHealth,
      stage: calculateStage(state.xp, newHealth),
      mood: calculateMood(newHealth)
    };
  }),

  // Increase health - the restoration of vitality
  increaseHealth: (amount: number) => set((state) => {
    const newHealth = clampHealth(state.health + amount);
    return {
      health: newHealth,
      stage: calculateStage(state.xp, newHealth),
      mood: calculateMood(newHealth)
    };
  }),

  // Increase XP - the accumulation of essence
  increaseXP: (amount: number) => set((state) => {
    const newXP = Math.max(0, state.xp + amount);
    return {
      xp: newXP,
      stage: calculateStage(newXP, state.health)
    };
  }),

  // Reset - return the creature to its primordial form
  reset: () => set({
    health: 100,
    xp: 0,
    stage: Stage.EGG,
    mood: Mood.HAPPY,
    weather: 'CLEAR',
    isNight: false
  }),
  
  // Set weather - change the atmospheric conditions
  setWeather: (weather: WeatherState) => set({ weather }),
  
  // Set night mode - toggle between day and night
  setIsNight: (isNight: boolean) => set({ isNight })
}));
