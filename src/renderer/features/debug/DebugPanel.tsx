// The Necromancer's Control Panel - for summoning weather at will...
// DELETE THIS FILE BEFORE PRODUCTION - it's for demo purposes only!
import React from 'react';
import { usePetStore } from '../pet/petStore';
import { WeatherState } from '../../services/weatherService';

export const DebugPanel: React.FC = () => {
  const weather = usePetStore((state) => state.weather);
  const isNight = usePetStore((state) => state.isNight);
  const health = usePetStore((state) => state.health);
  const xp = usePetStore((state) => state.xp);
  const setWeather = usePetStore((state) => state.setWeather);
  const setIsNight = usePetStore((state) => state.setIsNight);
  const increaseHealth = usePetStore((state) => state.increaseHealth);
  const decreaseHealth = usePetStore((state) => state.decreaseHealth);
  const increaseXP = usePetStore((state) => state.increaseXP);
  const reset = usePetStore((state) => state.reset);

  const weatherOptions: WeatherState[] = ['CLEAR', 'RAIN', 'SNOW', 'STORM'];

  return (
    <div className="fixed bottom-2 right-2 bg-panel-bg border-2 border-terminal-green p-2 z-[9999] text-xs">
      <div className="text-terminal-green font-bold mb-2">🔮 DEBUG PANEL</div>
      
      {/* Weather Controls */}
      <div className="mb-2">
        <span className="text-terminal-green">Weather: </span>
        <div className="flex gap-1 mt-1">
          {weatherOptions.map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`px-2 py-1 border ${
                weather === w 
                  ? 'bg-terminal-green text-crypt-dark' 
                  : 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-crypt-dark'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Night Toggle */}
      <div className="mb-2">
        <button
          onClick={() => setIsNight(!isNight)}
          className={`px-2 py-1 border ${
            isNight 
              ? 'bg-ghostly-blue text-crypt-dark' 
              : 'border-ghostly-blue text-ghostly-blue hover:bg-ghostly-blue hover:text-crypt-dark'
          }`}
        >
          {isNight ? '🌙 NIGHT' : '☀️ DAY'}
        </button>
      </div>

      {/* Health Controls */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-terminal-green">HP: {health}</span>
        <button
          onClick={() => decreaseHealth(20)}
          className="px-2 py-1 border border-blood-red text-blood-red hover:bg-blood-red hover:text-crypt-dark"
        >
          -20
        </button>
        <button
          onClick={() => increaseHealth(20)}
          className="px-2 py-1 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-crypt-dark"
        >
          +20
        </button>
      </div>

      {/* XP Controls */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-terminal-green">XP: {xp}</span>
        <button
          onClick={() => increaseXP(15)}
          className="px-2 py-1 border border-ghostly-blue text-ghostly-blue hover:bg-ghostly-blue hover:text-crypt-dark"
        >
          +15
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="w-full px-2 py-1 border border-blood-red text-blood-red hover:bg-blood-red hover:text-crypt-dark"
      >
        💀 RESET PET
      </button>
    </div>
  );
};
