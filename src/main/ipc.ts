// The Crypt's messenger - broadcasting whispers to the séance chamber...
import { BrowserWindow, ipcMain } from 'electron';
import { saveSaveData } from './persistence';

// The sacred contract for file events
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

// Registering the IPC handlers - preparing the channels for communication
export const registerIPCHandlers = (): void => {
  console.log('🦇 Opening the channels between realms...');

  // Handler for saving pet state from renderer
  ipcMain.on('save:data', (_event: any, data: any) => {
    console.log('🦇 Saving pet soul to the crypt...');
    saveSaveData(data);
  });

  // Handler for selecting directory to watch
  ipcMain.handle('dialog:select-directory', async () => {
    const { dialog } = require('electron');
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Project Directory to Watch',
      buttonLabel: 'Watch This Directory'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  // Handler for getting git history
  ipcMain.handle('git:get-history', async (_event, watchPath: string) => {
    const { getGitHistory } = require('./gitWatcher');
    return await getGitHistory(watchPath);
  });
};

// Broadcasting file events to all windows in the séance chamber
export const sendFileEvent = (event: FileEvent): void => {
  const allWindows = BrowserWindow.getAllWindows();

  if (allWindows.length === 0) {
    console.warn('🦇 No windows to haunt with this event:', event);
    return;
  }

  // Determining which channel to use based on event type
  const channel = event.type;

  // Broadcasting to all windows (though we typically only have one)
  allWindows.forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send(channel, event);
      console.log(`🦇 Whispered ${event.type} to the séance chamber:`, event.path);
    }
  });
};


// Broadcasting commit events to all windows in the séance chamber
export const sendCommitEvent = (event: CommitEvent): void => {
  const allWindows = BrowserWindow.getAllWindows();

  if (allWindows.length === 0) {
    console.warn('🦇 No windows to haunt with this commit:', event.message);
    return;
  }

  // Broadcasting to all windows
  allWindows.forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send('commit:detected', event);
      console.log(`🦇 Whispered commit to the séance chamber:`, event.message.substring(0, 50));
    }
  });
};
