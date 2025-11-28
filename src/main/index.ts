// The Crypt Keeper awakens...
import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import { registerIPCHandlers } from './ipc';
import { initFileWatcher, stopFileWatcher } from './fileWatcher';

// Ensuring only one instance of our haunted pet exists
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another spirit already haunts this machine...
  console.log('🦇 Another Necro-Pet already haunts this realm. Banishing duplicate...');
  app.quit();
} else {
  // When someone tries to summon a second instance, focus the existing one
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      const mainWindow = windows[0];
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      console.log('🦇 Attempted duplicate summoning detected. Focusing existing pet...');
    }
  });

  // When the spirits are ready...
  app.whenReady().then(() => {
    console.log('🦇 Resurrecting the Necro-Pet from the digital void...');
    
    // Opening the channels between realms
    registerIPCHandlers();
    
    // Summoning the main window
    createMainWindow();
    
    // Awakening the file watcher to monitor the mortal realm
    const watchPath = process.cwd();
    console.log('👁️ Initiating surveillance of:', watchPath);
    initFileWatcher(watchPath);

    // On macOS, re-summon window when dock icon is clicked
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        console.log('🦇 Re-summoning the window from the shadows...');
        createMainWindow();
      }
    });
  });

  // Banishing all windows on macOS quit
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      console.log('🦇 All windows banished. Returning to the void...');
      stopFileWatcher();
      app.quit();
    }
  });
  
  // Cleanup when the app is about to quit
  app.on('before-quit', () => {
    console.log('🌙 Preparing to return to the void...');
    stopFileWatcher();
  });
}
