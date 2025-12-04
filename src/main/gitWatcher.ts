// The Git Oracle - watching for commits from the mortal realm...
import { exec } from 'child_process';
import { promisify } from 'util';
import { watch, FSWatcher } from 'fs';
import { join } from 'path';
import { sendCommitEvent } from './ipc';

const execAsync = promisify(exec);

// The sacred contract for git commits
export interface GitCommit {
  hash: string;
  message: string;
  timestamp: number;
  author: string;
}

// Configuration for the git watcher
export interface GitWatcherConfig {
  pollInterval: number;  // milliseconds, default 30000 (30 seconds)
  watchPath: string;     // directory to watch
}

// The watcher's state
let watchInterval: NodeJS.Timeout | null = null;
let lastKnownHash: string | null = null;
let currentWatchPath: string | null = null;
let isGitRepo: boolean = false;
let fileWatcher: FSWatcher | null = null;
let debounceTimer: NodeJS.Timeout | null = null;

// Check if the directory is a git repository
const checkIsGitRepo = async (watchPath: string): Promise<boolean> => {
  try {
    await execAsync('git rev-parse --is-inside-work-tree', { cwd: watchPath });
    return true;
  } catch {
    return false;
  }
};

// Get the latest commit from the repository
const getLatestCommit = async (watchPath: string): Promise<GitCommit | null> => {
  try {
    // Format: hash|message|timestamp|author
    const { stdout } = await execAsync(
      'git log -1 --format="%H|%s|%at|%an"',
      { cwd: watchPath, timeout: 5000 }
    );

    const trimmed = stdout.trim().replace(/"/g, '');
    if (!trimmed) return null;

    const [hash, message, timestampStr, author] = trimmed.split('|');

    if (!hash || !message) return null;

    return {
      hash,
      message,
      timestamp: parseInt(timestampStr, 10) * 1000, // Convert to milliseconds
      author: author || 'Unknown'
    };
  } catch (error) {
    // Git command failed - likely not a git repo or no commits
    return null;
  }
};

// Poll for new commits
const pollForCommits = async (): Promise<void> => {
  if (!currentWatchPath || !isGitRepo) return;

  try {
    const latestCommit = await getLatestCommit(currentWatchPath);

    if (!latestCommit) return;

    // Check if this is a new commit
    if (lastKnownHash && latestCommit.hash !== lastKnownHash) {
      console.log('🦇 New commit detected from the mortal realm:', latestCommit.message);

      // Emit the commit event via IPC
      sendCommitEvent({
        type: 'commit',
        hash: latestCommit.hash,
        message: latestCommit.message,
        timestamp: latestCommit.timestamp
      });
    }

    // Update the last known hash
    lastKnownHash = latestCommit.hash;

  } catch (error) {
    console.error('🦇 Error polling for commits:', error);
  }
};

// Debounced poll - prevents rapid-fire polling
const debouncedPoll = (): void => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    pollForCommits();
  }, 500); // 500ms debounce
};

// Initialize the git watcher
export const initGitWatcher = async (config: GitWatcherConfig): Promise<void> => {
  const { pollInterval = 30000, watchPath } = config;

  console.log('🦇 Initializing Git Oracle for:', watchPath);

  // Check if it's a git repository
  isGitRepo = await checkIsGitRepo(watchPath);

  if (!isGitRepo) {
    console.log('🦇 Not a git repository. Git watching disabled for:', watchPath);
    return;
  }

  currentWatchPath = watchPath;

  // Get the initial commit hash
  const initialCommit = await getLatestCommit(watchPath);
  if (initialCommit) {
    lastKnownHash = initialCommit.hash;
    console.log('🦇 Initial commit hash:', lastKnownHash?.substring(0, 7));
  }

  // Watch .git/refs/heads for instant commit detection
  try {
    const refsPath = join(watchPath, '.git', 'refs', 'heads');
    fileWatcher = watch(refsPath, { recursive: true }, (eventType, filename) => {
      if (eventType === 'change' || eventType === 'rename') {
        console.log(`🦇 Git ref changed: ${filename}`);
        debouncedPoll(); // Trigger immediate check with debounce
      }
    });
    console.log('🦇 File watcher active on .git/refs/heads');
  } catch (error) {
    console.log('🦇 Could not watch .git/refs/heads, relying on polling only');
  }

  // Start polling
  watchInterval = setInterval(pollForCommits, pollInterval);
  console.log(`🦇 Git Oracle awakened. Polling every ${pollInterval / 1000} seconds...`);
};

// Stop the git watcher
export const stopGitWatcher = (): void => {
  if (watchInterval) {
    clearInterval(watchInterval);
    watchInterval = null;
    console.log('🦇 Git Oracle has returned to slumber...');
  }

  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
    console.log('🦇 File watcher stopped');
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  lastKnownHash = null;
  currentWatchPath = null;
  isGitRepo = false;
};

// Export git history getter for external use
export const getGitHistory = async (watchPath: string) => {
  try {
    const { stdout } = await execAsync(
      'git log -50 --pretty=format:"%H|%s|%at"',
      { cwd: watchPath }
    );

    if (!stdout.trim()) {
      return [];
    }

    const commits = stdout.trim().split('\n').map(line => {
      const [hash, message, timestamp] = line.split('|');
      return {
        hash: hash.trim(),
        message: message.trim(),
        timestamp: parseInt(timestamp) * 1000 // Convert to milliseconds
      };
    });

    return commits;
  } catch (error) {
    console.error('🦇 Error fetching git history:', error);
    return [];
  }
};

// Get the last known commit (for initialization)
export const getLastKnownCommit = async (): Promise<GitCommit | null> => {
  if (!currentWatchPath) return null;
  return getLatestCommit(currentWatchPath);
};

// Set the last known hash (for loading from save)
export const setLastKnownHash = (hash: string | null): void => {
  lastKnownHash = hash;
};

// Check if git watching is active
export const isGitWatchingActive = (): boolean => {
  return isGitRepo && watchInterval !== null;
};
