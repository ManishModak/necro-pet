// The Bridge between realms - where the living meet the dead...
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Defining the sacred contract between realms
export interface FileEvent {
  type: 'file:changed' | 'file:added';
  path: string;
  timestamp: number;
}

// The ElectronAPI interface - only these channels may pass through the veil
export interface ElectronAPI {
  onFileChanged: (callback: (event: FileEvent) => void) => void;
  onFileAdded: (callback: (event: FileEvent) => void) => void;
  removeFileListeners: () => void;
}

// Whitelist of channels permitted to cross the bridge
const WHITELISTED_CHANNELS = ['file:changed', 'file:added'] as const;

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
  
  // Banishing all listeners when the séance ends
  removeFileListeners: () => {
    ipcRenderer.removeAllListeners('file:changed');
    ipcRenderer.removeAllListeners('file:added');
  },
} as ElectronAPI);

// Declaring the global type for TypeScript's benefit
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
