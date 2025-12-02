// The Crypt Keeper awakens...
import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import { registerIPCHandlers } from './ipc';
import { initFileWatcher, stopFileWatcher } from './fileWatcher';
import { initGitWatcher, stopGitWatcher, setLastKnownHash } from './gitWatcher';
import { loadSaveData, createNewSave, saveSaveData, getHoursSinceLastCommit, calculateDecay } from './persistence';

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
  app.whenReady().then(async () => {
    console.log('🦇 Resurrecting the Necro-Pet from the digital void...');

    // Opening the channels between realms
    registerIPCHandlers();

    // Loading the pet's soul from the crypt
    let saveData = loadSaveData();
    if (!saveData) {
      console.log('🦇 No save found. Summoning a new pet...');
      saveData = createNewSave();
    } else {
      // Calculate and log time decay
      const hoursSinceCommit = getHoursSinceLastCommit(saveData.lastCommitDate);
      const decay = calculateDecay(hoursSinceCommit);
      if (decay > 0) {
        console.log(`🦇 Pet has decayed ${decay} HP from ${Math.floor(hoursSinceCommit)} hours of neglect...`);
        saveData.health = Math.max(0, saveData.health - decay);
        saveSaveData(saveData);
      }
    }

    // Set the last known commit hash for the git watcher
    if (saveData.lastCommitHash) {
      setLastKnownHash(saveData.lastCommitHash);
    }

    // Summoning the main window
    const mainWindow = createMainWindow();

    // Send save data to renderer once window is ready
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('save:loaded', saveData);
    });

    // Determining which path to watch - use saved path or default to current directory
    const watchPath = saveData.watchedProjectPath || process.cwd();

    // Save the watch path if it wasn't set
    if (!saveData.watchedProjectPath) {
      console.log('🦇 Setting default watch path:', watchPath);
      saveData.watchedProjectPath = watchPath;
      saveSaveData({ watchedProjectPath: watchPath });
    }

    console.log('👁️ Initiating surveillance of:', watchPath);

    // Awakening the file watcher to monitor the mortal realm
    initFileWatcher(watchPath);

    // Awakening the Git Oracle to watch for commits
    await initGitWatcher({ watchPath, pollInterval: 30000 });

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
      stopGitWatcher();
      app.quit();
    }
  });

  // Cleanup when the app is about to quit
  app.on('before-quit', () => {
    console.log('🌙 Preparing to return to the void...');
    stopFileWatcher();
    stopGitWatcher();
  });
}
