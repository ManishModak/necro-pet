// The Séance Chamber - where the spirits manifest...
import { useEffect } from 'react';
import { ActivityLog } from './features/activity-log/ActivityLog';
import { useActivityLogStore } from './features/activity-log/activityLogStore';
import { PetDisplay } from './features/pet/PetDisplay';
import { useGameLoop } from './features/pet/useGameLoop';
import { useWorldContext } from './hooks/useWorldContext';
import { WeatherOverlay } from './features/weather/WeatherOverlay';

function App() {
  const addEntry = useActivityLogStore((state) => state.addEntry);

  // Awakening the Necro-Pet's life force...
  useGameLoop();

  // Summoning the world context from the ethereal realm...
  useWorldContext();

  // Summoning the IPC listeners when the séance begins
  useEffect(() => {
    console.log('🕯️ Opening the portal to the crypt...');

    // Binding the file:changed whispers from the main process
    window.electronAPI.onFileChanged((event) => {
      console.log('👻 Spirit disturbed:', event.path);
      addEntry(event);
    });

    // Binding the file:added summonings from the main process
    window.electronAPI.onFileAdded((event) => {
      console.log('🦇 New spirit summoned:', event.path);
      addEntry(event);
    });

    // Banishing all listeners when the séance ends
    return () => {
      console.log('🕯️ Closing the portal... banishing listeners...');
      window.electronAPI.removeFileListeners();
    };
  }, [addEntry]);

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
        
        {/* Close button - must be non-draggable */}
        <button
          onClick={handleClose}
          className="text-blood-red hover:text-terminal-green transition-colors text-lg leading-none"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          title="Banish to the void"
        >
          ✕
        </button>
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
      <div className="w-full bg-panel-bg border-t-2 border-terminal-green px-3 py-1 pixelated">
        <p className="text-terminal-green text-xs text-center">
          🕯️ Watching the veil between worlds... 🕯️
        </p>
      </div>
    </div>
  );
}

export default App;
