// The Séance Chamber - where the spirits manifest...
import { useEffect, useState, useRef } from 'react';
import { ActivityLog } from './features/activity-log/ActivityLog';
import { useActivityLogStore } from './features/activity-log/activityLogStore';
import { PetDisplay } from './features/pet/PetDisplay';
import { usePetStore } from './features/pet/petStore';
import { useGameLoop } from './features/pet/useGameLoop';
import { useWorldContext } from './hooks/useWorldContext';
import { WeatherOverlay } from './features/weather/WeatherOverlay';
import { DebugPanel } from './features/debug/DebugPanel';

function App() {
  const addEntry = useActivityLogStore((state) => state.addEntry);
  const [showDebug, setShowDebug] = useState(false);

  // Awakening the Necro-Pet's life force...
  useGameLoop();

  // Summoning the world context from the ethereal realm...
  useWorldContext();

  // Get pet store actions and state
  const feedFromCommit = usePetStore((state) => state.feedFromCommit);
  const loadFromSave = usePetStore((state) => state.loadFromSave);
  const applyTimeDecay = usePetStore((state) => state.applyTimeDecay);
  const petState = usePetStore();

  // Summoning the IPC listeners when the séance begins
  useEffect(() => {
    console.log('🕯️ Opening the portal to the crypt...');

    // Binding the file:changed whispers from the main process
    window.electronAPI.onFileChanged((event) => {
      console.log('👻 Spirit disturbed:', event.path);
      // Visual feedback only - no longer logging to activity log
    });

    // Binding the file:added summonings from the main process
    window.electronAPI.onFileAdded((event) => {
      console.log('🦇 New spirit summoned:', event.path);
      // Visual feedback only - no longer logging to activity log
    });

    // Binding the commit offerings from the Git Oracle
    window.electronAPI.onCommitDetected((event) => {
      console.log('🦇 Commit offering received:', event.message);

      // Check if pet is dead before feeding (get fresh state)
      const wasDead = usePetStore.getState().health === 0;

      feedFromCommit(event.hash, event.message, event.timestamp);

      // Emit appropriate activity log entry
      if (wasDead) {
        // Pet was resurrected
        addEntry({
          type: 'resurrect',
          path: `RESURRECTED: ${event.message}`,
          timestamp: event.timestamp
        });
      } else {
        // Pet was fed
        addEntry({
          type: 'feed',
          path: `FED: ${event.message}`,
          timestamp: event.timestamp
        });
      }
    });

    // Binding the save data loader from the crypt
    window.electronAPI.onSaveLoaded(async (data) => {
      console.log('🦇 Loading pet soul from the crypt...');
      loadFromSave(data);

      // Activity log is NOT persisted across sessions - each session starts fresh
      const clearEntries = useActivityLogStore.getState().clearEntries;
      clearEntries();

      // Load ALL git history as collapsed historical commits (shows all previous work)
      const watchedPath = data.watchedProjectPath;
      if (watchedPath) {
        try {
          const history = await window.electronAPI.getGitHistory(watchedPath);

          if (history && history.length > 0) {
            const addHistoricalEntries = useActivityLogStore.getState().addHistoricalEntries;
            addHistoricalEntries(
              history.map(c => ({
                // Smart detection: check if commit message contains "resurrect"
                type: c.message.toLowerCase().includes('resurrect') ? 'resurrect' : 'feed',
                path: c.message,
                timestamp: c.timestamp
              }))
            );
            console.log(`🦇 Loaded ${history.length} historical commits from git history`);
          }
        } catch (error) {
          console.error('🦇 Failed to load git history:', error);
        }
      }

      // Calculate and apply time decay
      if (data.lastCommitDate) {
        const lastCommit = new Date(data.lastCommitDate);
        const now = new Date();
        const hoursSinceCommit = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCommit > 24) {
          console.log(`🦇 Applying ${Math.floor(hoursSinceCommit)} hours of decay...`);
          applyTimeDecay(hoursSinceCommit);
        }
      }
    });

    // Banishing all listeners when the séance ends
    return () => {
      console.log('🕯️ Closing the portal... banishing listeners...');
      window.electronAPI.removeFileListeners();
      window.electronAPI.removeCommitListeners();
      window.electronAPI.removeSaveListeners();
    };
  }, [addEntry, feedFromCommit, loadFromSave, applyTimeDecay]);

  // Performance: Debounced auto-save to reduce IPC calls
  const debouncedSave = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save pet state whenever it changes
  useEffect(() => {
    // Performance: Skip the initial mount and use debouncing
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }

    debouncedSave.current = setTimeout(() => {
      const entries = useActivityLogStore.getState().entries;
      const saveData = {
        health: petState.health,
        xp: petState.xp,
        stage: petState.stage,
        mood: petState.mood,
        weather: petState.weather,
        isNight: petState.isNight,
        lastCommitDate: petState.lastCommitDate,
        lastCommitHash: petState.lastCommitHash,
        deathCount: petState.deathCount,
        activityLog: entries  // Save activity log
      };

      window.electronAPI.saveData(saveData);
    }, 500); // 500ms debounce delay

    // Cleanup timeout on unmount
    return () => {
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
    };
  }, [
    petState.health,
    petState.xp,
    petState.stage,
    petState.lastCommitDate,
    petState.lastCommitHash,
    petState.deathCount
  ]);

  // Banishing the window back to the void
  const handleClose = () => {
    console.log('🕯️ Extinguishing the candles... closing the séance...');
    window.close();
  };

  return (
    <div className="w-full h-screen bg-crypt-dark flex flex-col">
      {/* The haunted window chrome - draggable region */}
      <div
        className="w-full bg-panel-bg border-b-2 border-terminal-green flex items-center justify-between px-3 py-2 pixelated"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <span className="text-blood-red text-lg">💀</span>
          <h1 className="text-terminal-green text-sm font-bold text-glow">
            NECRO-PET: CRYPT WATCHER
          </h1>
        </div>

        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {/* Debug toggle button */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`text-sm px-2 py-0.5 border transition-colors ${showDebug
              ? 'bg-terminal-green text-crypt-dark border-terminal-green'
              : 'text-terminal-green border-terminal-green hover:bg-terminal-green hover:text-crypt-dark'
              }`}
            title="Toggle Necromancer's Control Panel"
          >
            🔮
          </button>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-blood-red hover:text-terminal-green transition-colors text-lg leading-none"
            title="Banish to the void"
          >
            ✕
          </button>
        </div>
      </div>

      {/* The main séance chamber - split between Pet and Activity Log */}
      <div className="flex-1 overflow-hidden flex">
        {/* The Pet's Resurrection Chamber */}
        <div className="w-2/5 min-w-[140px] border-r-2 border-terminal-green bg-crypt-dark relative">
          <PetDisplay />
          <WeatherOverlay />
        </div>

        {/* The Activity Log Crypt */}
        <div className="flex-1">
          <ActivityLog />
        </div>
      </div>

      {/* The haunted footer */}
      <div className="w-full bg-panel-bg border-t-2 border-terminal-green px-3 py-1 pixelated flex items-center justify-between">
        <p className="text-terminal-green text-xs text-center flex-1">
          🕯️ Watching the veil between worlds... 🕯️
        </p>
        {/* Resize grip - bottom right corner */}
        <div
          className="resize-grip text-terminal-green opacity-50 hover:opacity-100 cursor-se-resize select-none"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          ⋰
        </div>
      </div>

      {/* Resize handles for frameless window */}
      <div className="resize-handle resize-top" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-bottom" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-left" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-right" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-top-left" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-top-right" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-bottom-left" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />
      <div className="resize-handle resize-bottom-right" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} />

      {/* Debug Panel - Toggle with 🔮 button */}
      {showDebug && <DebugPanel />}
    </div>
  );
}

export default App;
