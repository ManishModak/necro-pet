// The Crypt's sentinel - watching over the mortal realm's files...
import chokidar, { FSWatcher } from 'chokidar';
import { sendFileEvent, FileEvent } from './ipc';

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

// Summoning the file watcher to monitor the mortal realm
export const initFileWatcher = (targetPath: string): FSWatcher => {
  console.log('👁️ Awakening the sentinel to watch:', targetPath);
  
  try {
    // Creating the watcher with our dark configuration
    watcher = chokidar.watch(targetPath, {
      ignored: IGNORED_PATTERNS,
      persistent: true,
      ignoreInitial: true, // Don't emit events for files that already exist
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      },
      depth: 99, // Recursive watching
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
