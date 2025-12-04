// The Crypt's sentinel - watching over the mortal realm's files...
import chokidar, { FSWatcher } from 'chokidar';
import { sendFileEvent, FileEvent } from './ipc';
import * as fs from 'fs';

// The watcher instance - our eternal guardian
let watcher: FSWatcher | null = null;

// Directories that shall remain unwatched - cursed grounds we dare not tread
const IGNORED_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/.next/**',
  '**/build/**',
  '**/.cache/**'
];

// Performance: Configuration for different project sizes
const getWatchDepthForPath = (targetPath: string): number => {
  try {
    // Check if this is a large project directory
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(targetPath);
      // For large projects, reduce depth to improve performance
      if (files.length > 1000) {
        return 5; // Shallow depth for large projects
      } else if (files.length > 500) {
        return 10; // Medium depth for medium projects
      }
    }
    return 99; // Full depth for small projects
  } catch (error) {
    // If we can't determine, use default depth
    return 99;
  }
};

// Summoning the file watcher to monitor the mortal realm
export const initFileWatcher = (targetPath: string, config: { maxDepth?: number } = {}): FSWatcher => {
  console.log('👁️ Awakening the sentinel to watch:', targetPath);

  try {
    // Performance: Determine optimal depth based on project size
    const watchDepth = config.maxDepth || getWatchDepthForPath(targetPath);
    console.log(`👁️ Using watch depth: ${watchDepth} for performance optimization`);

    // Creating the watcher with our dark configuration
    watcher = chokidar.watch(targetPath, {
      ignored: IGNORED_PATTERNS,
      persistent: true,
      ignoreInitial: true, // Don't emit events for files that already exist
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      },
      depth: watchDepth, // Dynamic depth based on project size
      usePolling: false, // Use native file watching for better performance
      interval: 100, // Polling interval if usePolling is true
      binaryInterval: 300, // Binary polling interval
      alwaysStat: false, // Don't stat files on startup for performance
      ignorePermissionErrors: true, // Ignore permission errors to prevent crashes
      atomic: true, // Use atomic file writing detection
    });

    // Listening for file changes - the whispers of modification
    watcher.on('change', (path: string) => {
      const event: FileEvent = {
        type: 'file:changed',
        path,
        timestamp: Date.now()
      };

      console.log('📝 The spirits detected a change:', path);
      sendFileEvent(event);
    });

    // Listening for new files - the arrival of fresh souls
    watcher.on('add', (path: string) => {
      const event: FileEvent = {
        type: 'file:added',
        path,
        timestamp: Date.now()
      };

      console.log('✨ A new file materializes:', path);
      sendFileEvent(event);
    });

    // Handling errors - when the spirits grow restless
    watcher.on('error', (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('💀 The watcher encountered a disturbance:', err.message);
      console.error('Stack trace from the abyss:', err.stack);
      // Continue operation - we don't let errors stop us from watching
    });

    // Confirming the watcher is ready
    watcher.on('ready', () => {
      console.log('👁️ The sentinel is now vigilant and watching...');
    });

    return watcher;
  } catch (error) {
    console.error('💀 Failed to summon the file watcher:', error);
    throw error;
  }
};

// Banishing the watcher - releasing it back to the void
export const stopFileWatcher = (): void => {
  if (watcher) {
    console.log('🌙 Releasing the sentinel back to the shadows...');
    watcher.close();
    watcher = null;
  }
};

// Checking if the watcher is currently active
export const isWatcherActive = (): boolean => {
  return watcher !== null;
};
