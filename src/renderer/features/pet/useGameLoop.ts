// The Game Loop - where file events provide visual feedback only...
import { useEffect } from 'react';

// NOTE: The game loop no longer handles feeding or decay.
// Feeding is done through git commits (see feedFromCommit in petStore.ts)
// Decay is calculated on app startup based on time since last commit (see persistence.ts)

// The hook that binds file events to visual feedback
export const useGameLoop = (): void => {

  useEffect(() => {
    // NOTE: The decay timer has been removed - time-based decay is now calculated
    // on app startup based on time since last commit (see persistence.ts)

    // The file change listener - provides visual feedback only (no HP/XP gain)
    // Commits are now the primary food source!
    const handleFileChanged = (event: { type: string; path: string; timestamp: number }) => {
      console.log(`🦇 File changed detected: ${event.path} - Visual feedback only, no feeding.`);
      // TODO: Add subtle visual feedback animation here in the future
      // For now, the activity log entry is the visual feedback
    };

    // Subscribing to the whispers from the crypt
    if (window.electronAPI) {
      console.log('🦇 Listening for file changes from the crypt (visual feedback only)...');
      window.electronAPI.onFileChanged(handleFileChanged);
    } else {
      console.warn('🦇 The bridge to the crypt is broken! No file events will reach us.');
    }

    // The cleanup ritual - banishing listeners when the séance ends
    return () => {
      console.log('🦇 Ending the game loop... Silencing file listeners.');

      if (window.electronAPI) {
        window.electronAPI.removeFileListeners();
      }
    };
  }, []);
};
