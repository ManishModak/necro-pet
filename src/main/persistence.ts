// The Crypt's Memory - persisting the pet's soul across the void...
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Security constants
export const MAX_SAVE_FILE_SIZE = 1024 * 1024; // 1MB max file size
export const MAX_ACTIVITY_LOG_ENTRIES = 1000; // Prevent unbounded growth

// The sacred contract for saved pet data
export interface SaveData {
  version: number;
  health: number;
  xp: number;
  stage: string;
  mood: string;
  weather: string;
  isNight: boolean;
  lastCommitDate: string | null;  // ISO timestamp
  lastCommitHash: string | null;
  deathCount: number;
  watchedProjectPath: string | null;  // Path to the git repo being watched
  activityLog: Array<{ id: string; type: string; path: string; timestamp: number }>;  // Activity log entries
  createdAt: string;
  updatedAt: string;
}

// The default state for a freshly summoned pet
const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  health: 100,
  xp: 0,
  stage: 'EGG',
  mood: 'HAPPY',
  weather: 'CLEAR',
  isNight: false,
  lastCommitDate: null,
  lastCommitHash: null,
  deathCount: 0,
  watchedProjectPath: null,  // Will be set on first run
  activityLog: [],  // Empty activity log on new save
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// The path to the crypt's memory vault
export const getSavePath = (): string => {
  // Use user's home directory for global persistence
  const homeDir = app.getPath('home');
  return path.join(homeDir, '.necro-pet', 'save.json');
};

// The path to the save directory
const getSaveDir = (): string => {
  const homeDir = app.getPath('home');
  return path.join(homeDir, '.necro-pet');
};

// Ensure the save directory exists in the mortal realm
const ensureSaveDir = (): void => {
  const saveDir = getSaveDir();
  if (!fs.existsSync(saveDir)) {
    console.log('🦇 Creating the crypt vault at:', saveDir);
    fs.mkdirSync(saveDir, { recursive: true });
  }
};

// Load the pet's soul from the void
export const loadSaveData = (): SaveData | null => {
  const savePath = getSavePath();

  try {
    if (!fs.existsSync(savePath)) {
      console.log('🦇 No save file found. A new pet shall be summoned...');
      return null;
    }

    // Security: Check file size before reading
    const stats = fs.statSync(savePath);
    if (stats.size > MAX_SAVE_FILE_SIZE) {
      console.error('🦇 Save file too large! Potential security issue detected.');
      backupCorruptedSave(savePath);
      return null;
    }

    const rawData = fs.readFileSync(savePath, 'utf-8');
    const data = JSON.parse(rawData) as SaveData;

    // Validate the save data has required fields
    if (typeof data.health !== 'number' || typeof data.xp !== 'number') {
      console.warn('🦇 Save file corrupted! The soul is malformed...');
      backupCorruptedSave(savePath);
      return null;
    }

    // Security: Validate activity log size
    if (data.activityLog && data.activityLog.length > MAX_ACTIVITY_LOG_ENTRIES) {
      console.warn('🦇 Activity log too large, truncating...');
      data.activityLog = data.activityLog.slice(-MAX_ACTIVITY_LOG_ENTRIES);
    }

    console.log('🦇 Pet soul loaded from the crypt:', savePath);
    return data;

  } catch (error) {
    console.error('🦇 Failed to load save file:', error);
    backupCorruptedSave(savePath);
    return null;
  }
};

// Save the pet's soul to the void
export const saveSaveData = (data: Partial<SaveData>): void => {
  ensureSaveDir();
  const savePath = getSavePath();

  try {
    // Load existing data or use defaults
    let existingData = loadSaveData() || { ...DEFAULT_SAVE_DATA };

    // Merge with new data
    const saveData: SaveData = {
      ...existingData,
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Security: Validate data before saving
    if (typeof saveData.health !== 'number' || saveData.health < 0 || saveData.health > 100) {
      console.error('🦇 Invalid health value, resetting to default');
      saveData.health = DEFAULT_SAVE_DATA.health;
    }

    if (typeof saveData.xp !== 'number' || saveData.xp < 0) {
      console.error('🦇 Invalid XP value, resetting to default');
      saveData.xp = DEFAULT_SAVE_DATA.xp;
    }

    // Security: Ensure activity log doesn't grow unbounded
    if (saveData.activityLog && saveData.activityLog.length > MAX_ACTIVITY_LOG_ENTRIES) {
      console.warn('🦇 Truncating activity log to prevent unbounded growth');
      saveData.activityLog = saveData.activityLog.slice(-MAX_ACTIVITY_LOG_ENTRIES);
    }

    // Security: Check final serialized size
    const serializedData = JSON.stringify(saveData, null, 2);
    if (serializedData.length > MAX_SAVE_FILE_SIZE) {
      console.error('🦇 Save data too large, cannot save');
      return;
    }

    // Write to the crypt
    fs.writeFileSync(savePath, serializedData, 'utf-8');
    console.log('🦇 Pet soul saved to the crypt');

  } catch (error) {
    console.error('🦇 Failed to save pet soul:', error);
  }
};

// Create a new save with default values
export const createNewSave = (): SaveData => {
  ensureSaveDir();
  const savePath = getSavePath();

  const newSave: SaveData = {
    ...DEFAULT_SAVE_DATA,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(savePath, JSON.stringify(newSave, null, 2), 'utf-8');
    console.log('🦇 New pet summoned and saved to:', savePath);
  } catch (error) {
    console.error('🦇 Failed to create new save:', error);
  }

  return newSave;
};

// Backup a corrupted save file before overwriting
const backupCorruptedSave = (savePath: string): void => {
  try {
    if (fs.existsSync(savePath)) {
      const backupPath = `${savePath}.corrupted.${Date.now()}`;
      fs.copyFileSync(savePath, backupPath);
      console.log('🦇 Corrupted save backed up to:', backupPath);
    }
  } catch (error) {
    console.error('🦇 Failed to backup corrupted save:', error);
  }
};

// Calculate hours since last commit
export const getHoursSinceLastCommit = (lastCommitDate: string | null): number => {
  if (!lastCommitDate) {
    return Infinity; // No commits ever = infinite time
  }

  const lastCommit = new Date(lastCommitDate);
  const now = new Date();
  const diffMs = now.getTime() - lastCommit.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

// Calculate health decay based on hours since last commit
export const calculateDecay = (hoursSinceCommit: number): number => {
  if (hoursSinceCommit <= 24) return 0;           // Grace period - Day 1
  if (hoursSinceCommit <= 48) return 15;          // Day 2
  if (hoursSinceCommit <= 72) return 40;          // Day 3 (15 + 25)

  // Day 4+: 40 + 35 per additional day
  const additionalDays = Math.floor((hoursSinceCommit - 72) / 24);
  return 40 + (additionalDays * 35);
};
