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
  xp: number;          // 0-199, resets on evolution
  stage: Stage;        // Current evolutionary form
  mood: Mood;          // Current emotional state
  evolutionLevel: number; // 0=EGG, 1=LARVA, 2=BEAST
}

// The world context - environmental forces affecting our creature
export interface WorldContextState {
  weather: WeatherState;  // The atmospheric conditions
  isNight: boolean;       // Whether darkness has fallen
}

// Commit tracking state - the soul's memory of offerings
export interface CommitState {
  lastCommitDate: string | null;   // ISO timestamp of last commit
  lastCommitHash: string | null;   // Hash of last commit
  deathCount: number;              // How many times the pet has perished
  watchedProjectPath: string | null; // Path to the git repository being watched
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

// Actions for commit-based feeding
export interface CommitActions {
  feedFromCommit: (hash: string, message: string, timestamp: number) => void;
  applyTimeDecay: (hoursSinceCommit: number) => void;
  revivePet: (commitMessage: string) => void;
  loadFromSave: (data: {
    health: number;
    xp: number;
    stage: string;
    mood: string;
    weather: string;
    isNight: boolean;
    lastCommitDate: string | null;
    lastCommitHash: string | null;
    deathCount: number;
    watchedProjectPath: string | null;
  }) => void;
}

// Pure function: Clamp health to the mortal bounds [0, 100]
export const clampHealth = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

// Pure function: Calculate stage based on evolution level and health
// Death overrides all - the GHOST stage claims those with no life force
export const calculateStage = (evolutionLevel: number, health: number): Stage => {
  // The dead transcend all evolutionary stages
  if (health === 0) {
    return Stage.GHOST;
  }

  // The living evolve through evolution levels
  if (evolutionLevel === 0) {
    return Stage.EGG;
  } else if (evolutionLevel === 1) {
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

// Pure function: Calculate health decay based on hours since last commit
export const calculateDecay = (hoursSinceCommit: number): number => {
  // Grace period - first 12 hours
  if (hoursSinceCommit <= 12) return 0;

  // After 48 hours: instant death
  if (hoursSinceCommit >= 48) return 200; // Exceeds max health, ensures death

  // Linear decay from 12h to 48h
  // Over 36 hours (48-12), pet loses 100 HP
  // Formula: (hours - 12) * (100 / 36)
  const hoursOfDecay = hoursSinceCommit - 12;
  return Math.floor(hoursOfDecay * (100 / 36));
};

// Pure function: Calculate revival health based on commit message
export const calculateRevivalHealth = (commitMessage: string): number => {
  const lowerMessage = commitMessage.toLowerCase();

  // Special resurrection commit gives 75% health
  if (lowerMessage.includes('resurrect')) {
    return 75;
  }

  // Normal revival gives 50% health
  return 50;
};

// The Zustand store - the heart of our necromantic creation
export const usePetStore = create<PetState & WorldContextState & CommitState & PetActions & WorldContextActions & CommitActions>((set) => ({
  // Initial state - a freshly summoned creature
  health: 100,
  xp: 0,
  stage: Stage.EGG,
  mood: Mood.HAPPY,
  evolutionLevel: 0,

  // Initial world context - clear skies and daylight
  weather: 'CLEAR',
  isNight: false,

  // Initial commit state - no offerings yet
  lastCommitDate: null,
  lastCommitHash: null,
  deathCount: 0,
  watchedProjectPath: null,

  // Decrease health - the decay of life
  decreaseHealth: (amount: number) => set((state) => {
    const newHealth = clampHealth(state.health - amount);

    // If pet dies, reset XP and evolution level
    if (newHealth === 0) {
      return {
        health: 0,
        xp: 0,
        evolutionLevel: 0,
        stage: Stage.GHOST,
        mood: Mood.DEAD
      };
    }

    return {
      health: newHealth,
      stage: calculateStage(state.evolutionLevel, newHealth),
      mood: calculateMood(newHealth)
    };
  }),

  // Increase health - the restoration of vitality
  increaseHealth: (amount: number) => set((state) => {
    const newHealth = clampHealth(state.health + amount);
    return {
      health: newHealth,
      stage: calculateStage(state.evolutionLevel, newHealth),
      mood: calculateMood(newHealth)
    };
  }),

  // Increase XP - the accumulation of essence
  increaseXP: (amount: number) => set((state) => {
    const newXP = state.xp + amount;
    let finalXP = newXP;
    let newEvolutionLevel = state.evolutionLevel;

    // Check for evolution at 200 XP threshold
    if (newXP >= 200 && state.evolutionLevel < 2) {
      finalXP = 0; // Reset XP
      newEvolutionLevel = state.evolutionLevel + 1; // Evolve
      console.log(`🦇 EVOLUTION! ${state.stage} → ${calculateStage(newEvolutionLevel, state.health)}`);
    }

    return {
      xp: finalXP,
      evolutionLevel: newEvolutionLevel,
      stage: calculateStage(newEvolutionLevel, state.health)
    };
  }),

  // Reset - return the creature to its primordial form
  reset: () => set({
    health: 100,
    xp: 0,
    stage: Stage.EGG,
    mood: Mood.HAPPY,
    evolutionLevel: 0,
    weather: 'CLEAR',
    isNight: false,
    lastCommitDate: null,
    lastCommitHash: null,
    deathCount: 0,
    watchedProjectPath: null
  }),

  // Set weather - change the atmospheric conditions
  setWeather: (weather: WeatherState) => set({ weather }),

  // Set night mode - toggle between day and night
  setIsNight: (isNight: boolean) => set({ isNight }),

  // Feed from commit - the primary source of sustenance
  feedFromCommit: (hash: string, message: string, timestamp: number) => set((state) => {
    // If pet is dead, revive it instead
    if (state.health === 0) {
      const revivalHealth = calculateRevivalHealth(message);
      const newXP = 0; // Reset XP on revival
      const newEvolutionLevel = 0; // Reset to EGG on revival

      return {
        health: revivalHealth,
        xp: newXP,
        evolutionLevel: newEvolutionLevel,
        stage: calculateStage(newEvolutionLevel, revivalHealth),
        mood: calculateMood(revivalHealth),
        lastCommitDate: new Date(timestamp).toISOString(),
        lastCommitHash: hash,
        deathCount: state.deathCount + 1
      };
    }

    // Normal feeding - +20 HP, +15 XP
    const newHealth = clampHealth(state.health + 20);
    const tempXP = state.xp + 15;
    let finalXP = tempXP;
    let newEvolutionLevel = state.evolutionLevel;

    // Check for evolution at 200 XP threshold
    if (tempXP >= 200 && state.evolutionLevel < 2) {
      finalXP = 0; // Reset XP
      newEvolutionLevel = state.evolutionLevel + 1; // Evolve
      console.log(`🦇 EVOLUTION! ${state.stage} → ${calculateStage(newEvolutionLevel, newHealth)}`);
    }

    return {
      health: newHealth,
      xp: finalXP,
      evolutionLevel: newEvolutionLevel,
      stage: calculateStage(newEvolutionLevel, newHealth),
      mood: calculateMood(newHealth),
      lastCommitDate: new Date(timestamp).toISOString(),
      lastCommitHash: hash
    };
  }),

  // Apply time decay - the slow death from neglect
  applyTimeDecay: (hoursSinceCommit: number) => set((state) => {
    const decay = calculateDecay(hoursSinceCommit);
    if (decay === 0) return state;

    const newHealth = clampHealth(state.health - decay);
    return {
      health: newHealth,
      stage: calculateStage(state.evolutionLevel, newHealth),
      mood: calculateMood(newHealth)
    };
  }),

  // Revive pet - resurrection from the void
  revivePet: (commitMessage: string) => set((state) => {
    if (state.health > 0) return state; // Already alive

    const revivalHealth = calculateRevivalHealth(commitMessage);
    const newXP = 0; // Reset XP on revival
    const newEvolutionLevel = 0; // Reset to EGG on revival

    return {
      health: revivalHealth,
      xp: newXP,
      evolutionLevel: newEvolutionLevel,
      stage: calculateStage(newEvolutionLevel, revivalHealth),
      mood: calculateMood(revivalHealth),
      deathCount: state.deathCount + 1
    };
  }),

  // Load from save - restore the pet's soul from the crypt
  loadFromSave: (data) => {
    // Runtime validation for type safety
    const validateStage = (stage: string): Stage => {
      const validStages: Stage[] = [Stage.EGG, Stage.LARVA, Stage.BEAST, Stage.GHOST];
      return validStages.includes(stage as Stage) ? stage as Stage : Stage.EGG;
    };

    const validateMood = (mood: string): Mood => {
      const validMoods: Mood[] = [Mood.HAPPY, Mood.HUNGRY, Mood.DEAD];
      return validMoods.includes(mood as Mood) ? mood as Mood : Mood.HAPPY;
    };

    const validateWeather = (weather: string): WeatherState => {
      const validWeather: WeatherState[] = ['CLEAR', 'RAIN', 'SNOW', 'STORM'];
      return validWeather.includes(weather as WeatherState) ? weather as WeatherState : 'CLEAR';
    };

    // Validate and sanitize all incoming data
    const health = typeof data.health === 'number' && !isNaN(data.health)
      ? Math.max(0, Math.min(100, data.health))
      : 100; // Default health

    const xp = typeof data.xp === 'number' && !isNaN(data.xp)
      ? Math.max(0, data.xp)
      : 0; // Default XP

    const evolutionLevel = typeof (data as any).evolutionLevel === 'number' && !isNaN((data as any).evolutionLevel)
      ? Math.max(0, Math.min(2, (data as any).evolutionLevel))
      : 0;

    set({
      health,
      xp,
      stage: validateStage(data.stage),
      mood: validateMood(data.mood),
      evolutionLevel,
      weather: validateWeather(data.weather),
      isNight: typeof data.isNight === 'boolean' ? data.isNight : false,
      lastCommitDate: data.lastCommitDate || null,
      lastCommitHash: data.lastCommitHash || null,
      deathCount: typeof data.deathCount === 'number' && !isNaN(data.deathCount)
        ? Math.max(0, data.deathCount)
        : 0,
      watchedProjectPath: data.watchedProjectPath || null
    });
  }
}));
