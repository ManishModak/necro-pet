// Testing the summoning of world context from the ethereal realm...

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWorldContext } from '../useWorldContext';
import { usePetStore } from '../../features/pet/petStore';
import * as weatherService from '../../services/weatherService';
import * as timeContext from '../../services/timeContext';

describe('useWorldContext Hook Unit Tests', () => {
  beforeEach(() => {
    // Resurrecting the pet store to its primordial state
    usePetStore.getState().reset();
    
    // Clearing all mock invocations from previous rituals
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restoring all mocks to their natural state
    vi.restoreAllMocks();
  });

  it('SHALL execute once on mount and update store with weather and isNight values', async () => {
    // **Validates: Requirements 4.1, 4.4**
    
    // Mock the weather spirits to return a specific condition
    const mockWeather = 'RAIN';
    const fetchWeatherSpy = vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue(mockWeather);
    
    // Mock the temporal veil to return night time
    const mockIsNight = true;
    const getCurrentTimeContextSpy = vi.spyOn(timeContext, 'getCurrentTimeContext').mockReturnValue(mockIsNight);
    
    // Capture initial store state
    const initialWeather = usePetStore.getState().weather;
    const initialIsNight = usePetStore.getState().isNight;
    
    // Render the hook - the summoning begins
    renderHook(() => useWorldContext());
    
    // Wait for the async weather fetch to complete
    await waitFor(() => {
      expect(fetchWeatherSpy).toHaveBeenCalledTimes(1);
    });
    
    // Verify the weather spirits were consulted exactly once
    expect(fetchWeatherSpy).toHaveBeenCalledTimes(1);
    expect(fetchWeatherSpy).toHaveBeenCalledWith(); // Called with no arguments (uses default coords)
    
    // Verify the temporal veil was consulted exactly once
    expect(getCurrentTimeContextSpy).toHaveBeenCalledTimes(1);
    
    // Verify the store was updated with the divined values
    const finalWeather = usePetStore.getState().weather;
    const finalIsNight = usePetStore.getState().isNight;
    
    expect(finalWeather).toBe(mockWeather);
    expect(finalIsNight).toBe(mockIsNight);
    
    // Verify the values actually changed from initial state
    expect(finalWeather).not.toBe(initialWeather);
    expect(finalIsNight).not.toBe(initialIsNight);
  });

  it('SHALL execute only once even when component re-renders', async () => {
    // **Validates: Requirements 4.1**
    
    // Mock the services
    const fetchWeatherSpy = vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue('CLEAR');
    const getCurrentTimeContextSpy = vi.spyOn(timeContext, 'getCurrentTimeContext').mockReturnValue(false);
    
    // Render the hook
    const { rerender } = renderHook(() => useWorldContext());
    
    // Wait for initial fetch
    await waitFor(() => {
      expect(fetchWeatherSpy).toHaveBeenCalledTimes(1);
    });
    
    // Force a re-render
    rerender();
    
    // Wait a bit to ensure no additional calls are made
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Verify the services were called only once despite re-render
    expect(fetchWeatherSpy).toHaveBeenCalledTimes(1);
    expect(getCurrentTimeContextSpy).toHaveBeenCalledTimes(1);
  });

  it('SHALL update store with CLEAR weather when fetch fails', async () => {
    // **Validates: Requirements 4.2, 4.4**
    
    // Mock the weather spirits to fail (return default CLEAR)
    const fetchWeatherSpy = vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue('CLEAR');
    vi.spyOn(timeContext, 'getCurrentTimeContext').mockReturnValue(false);
    
    // Render the hook
    renderHook(() => useWorldContext());
    
    // Wait for the async operations
    await waitFor(() => {
      expect(fetchWeatherSpy).toHaveBeenCalled();
    });
    
    // Verify store was updated with default CLEAR weather
    const finalWeather = usePetStore.getState().weather;
    expect(finalWeather).toBe('CLEAR');
  });

  it('SHALL update store with all possible weather states', async () => {
    // **Validates: Requirements 4.2, 4.4**
    
    const weatherStates: Array<weatherService.WeatherState> = ['CLEAR', 'RAIN', 'SNOW', 'STORM'];
    
    for (const weatherState of weatherStates) {
      // Reset store before each test
      usePetStore.getState().reset();
      vi.clearAllMocks();
      
      // Mock the weather spirits to return specific state
      const fetchWeatherSpy = vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue(weatherState);
      vi.spyOn(timeContext, 'getCurrentTimeContext').mockReturnValue(false);
      
      // Render the hook
      renderHook(() => useWorldContext());
      
      // Wait for the async operations
      await waitFor(() => {
        expect(fetchWeatherSpy).toHaveBeenCalled();
      });
      
      // Verify store was updated with the correct weather state
      const finalWeather = usePetStore.getState().weather;
      expect(finalWeather).toBe(weatherState);
      
      // Cleanup
      vi.restoreAllMocks();
    }
  });

  it('SHALL update store with both day and night time contexts', async () => {
    // **Validates: Requirements 4.3, 4.4**
    
    const timeContexts = [true, false];
    
    for (const isNight of timeContexts) {
      // Reset store before each test
      usePetStore.getState().reset();
      vi.clearAllMocks();
      
      // Mock the services
      vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue('CLEAR');
      const getCurrentTimeContextSpy = vi.spyOn(timeContext, 'getCurrentTimeContext').mockReturnValue(isNight);
      
      // Render the hook
      renderHook(() => useWorldContext());
      
      // Wait for the async operations
      await waitFor(() => {
        expect(getCurrentTimeContextSpy).toHaveBeenCalled();
      });
      
      // Verify store was updated with the correct time context
      const finalIsNight = usePetStore.getState().isNight;
      expect(finalIsNight).toBe(isNight);
      
      // Cleanup
      vi.restoreAllMocks();
    }
  });
});
