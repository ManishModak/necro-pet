// Summoning the world context from the ethereal realm...
// This hook communes with the weather spirits and temporal forces once upon mounting

import { useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { getCurrentTimeContext } from '../services/timeContext';
import { usePetStore } from '../features/pet/petStore';

/**
 * Hook that orchestrates the initial summoning of world context
 * Fetches weather data and determines time context once on component mount
 * Updates the Pet Store with the divined environmental conditions
 */
export const useWorldContext = (): void => {
  const setWeather = usePetStore((state) => state.setWeather);
  const setIsNight = usePetStore((state) => state.setIsNight);

  useEffect(() => {
    // This ritual executes only once, when the component awakens from the void
    const summonWorldContext = async () => {
      // Commune with the weather spirits to divine atmospheric conditions
      const weather = await fetchWeather();
      setWeather(weather);

      // Consult the temporal veil to determine if night has fallen
      const isNight = getCurrentTimeContext();
      setIsNight(isNight);
    };

    // Begin the summoning ritual
    summonWorldContext();
  }, []); // Empty dependency array - the ritual occurs only once upon mounting
};
