// The Bridge between realms - where the living meet the dead...
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Defining the sacred contract between realms
export interface FileEvent {
  type: 'file:changed' | 'file:added';
  path: string;
  timestamp: number;
}

// The sacred contract for commit events
export interface CommitEvent {
  type: 'commit';
  hash: string;
  message: string;
  timestamp: number;
}

// The sacred contract for save data
export interface SaveData {
  version: number;
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
  createdAt: string;
  updatedAt: string;
}

// The ElectronAPI interface - only these channels may pass through the veil
export interface ElectronAPI {
  onFileChanged: (callback: (event: FileEvent) => void) => void;
  onFileAdded: (callback: (event: FileEvent) => void) => void;
  onCommitDetected: (callback: (event: CommitEvent) => void) => void;
  onSaveLoaded: (callback: (data: SaveData) => void) => void;
  saveData: (data: Partial<SaveData>) => void;
  selectDirectory: () => Promise<string | null>;
  removeFileListeners: () => void;
  removeCommitListeners: () => void;
  removeSaveListeners: () => void;
}

// Whitelist of channels permitted to cross the bridge
const WHITELISTED_CHANNELS = ['file:changed', 'file:added', 'commit:detected'] as const;

// Summoning the context bridge to expose only the sacred channels
contextBridge.exposeInMainWorld('electronAPI', {
  // Listening for file change whispers from the crypt
  onFileChanged: (callback: (event: FileEvent) => void) => {
    const channel = 'file:changed';
    if (!WHITELISTED_CHANNELS.includes(channel)) {
      console.error(`🦇 Forbidden channel attempted: ${channel}`);
      return;
    }
    ipcRenderer.on(channel, (_event: IpcRendererEvent, data: FileEvent) => callback(data));
  },

  // Listening for file addition summonings from the crypt
  onFileAdded: (callback: (event: FileEvent) => void) => {
    const channel = 'file:added';
    if (!WHITELISTED_CHANNELS.includes(channel)) {
      console.error(`🦇 Forbidden channel attempted: ${channel}`);
      return;
    }
    ipcRenderer.on(channel, (_event: IpcRendererEvent, data: FileEvent) => callback(data));
  },

  // Listening for commit offerings from the Git Oracle
  onCommitDetected: (callback: (event: CommitEvent) => void) => {
    const channel = 'commit:detected';
    ipcRenderer.on(channel, (_event: IpcRendererEvent, data: CommitEvent) => callback(data));
  },

  // Listening for save data from the crypt
  onSaveLoaded: (callback: (data: SaveData) => void) => {
    const channel = 'save:loaded';
    ipcRenderer.on(channel, (_event: IpcRendererEvent, data: SaveData) => callback(data));
  },

  // Send save data to persistence layer
  saveData: (data: Partial<SaveData>) => {
    ipcRenderer.send('save:data', data);
  },

  // Open directory picker dialog
  selectDirectory: async (): Promise<string | null> => {
    return ipcRenderer.invoke('dialog:select-directory');
  },

  // Banishing all file listeners when the séance ends
  removeFileListeners: () => {
    ipcRenderer.removeAllListeners('file:changed');
    ipcRenderer.removeAllListeners('file:added');
  },

  // Banishing commit listeners
  removeCommitListeners: () => {
    ipcRenderer.removeAllListeners('commit:detected');
  },

  // Banishing save listeners
  removeSaveListeners: () => {
    ipcRenderer.removeAllListeners('save:loaded');
  },
} as ElectronAPI);

// Declaring the global type for TypeScript's benefit
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
