// **Feature: world-context-weather-time, Property 5: Weather Overlay Rendering Consistency**
// Testing that the atmospheric manifestations reflect the true weather state...

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, act } from '@testing-library/react';
import { WeatherOverlay } from '../WeatherOverlay';
import { usePetStore } from '../../pet/petStore';

describe('WeatherOverlay Property Tests', () => {
  beforeEach(() => {
    // Clearing the skies and resetting the world before each test
    act(() => {
      usePetStore.getState().reset();
    });
  });

  it('Property 5: For any WeatherState value, the WeatherOverlay SHALL render the appropriate visual elements', { timeout: 60000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    
    fc.assert(
      fc.property(
        // Generate all possible WeatherState values
        fc.constantFrom('CLEAR' as const, 'RAIN' as const, 'SNOW' as const, 'STORM' as const),
        (weatherState) => {
          // Set the weather state
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            store.setWeather(weatherState);
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<WeatherOverlay />);
            container = result.container;
          });
          
          // Property: Appropriate weather elements must be rendered based on state
          if (weatherState === 'CLEAR') {
            // For CLEAR weather, no rain/snow/storm elements should be present
            const rainElements = container!.querySelectorAll('.rain-drop');
            const snowElements = container!.querySelectorAll('.snow-flake');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            
            expect(rainElements.length).toBe(0);
            expect(snowElements.length).toBe(0);
            expect(lightningElements.length).toBe(0);
          } else if (weatherState === 'RAIN') {
            // For RAIN weather, rain droplets should be present
            const rainElements = container!.querySelectorAll('.rain-drop');
            expect(rainElements.length).toBeGreaterThan(0);
            
            // But no snow or lightning
            const snowElements = container!.querySelectorAll('.snow-flake');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            expect(snowElements.length).toBe(0);
            expect(lightningElements.length).toBe(0);
          } else if (weatherState === 'SNOW') {
            // For SNOW weather, snowflakes should be present
            const snowElements = container!.querySelectorAll('.snow-flake');
            expect(snowElements.length).toBeGreaterThan(0);
            
            // But no rain or lightning
            const rainElements = container!.querySelectorAll('.rain-drop');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            expect(rainElements.length).toBe(0);
            expect(lightningElements.length).toBe(0);
          } else if (weatherState === 'STORM') {
            // For STORM weather, both rain and lightning should be present
            const rainElements = container!.querySelectorAll('.rain-drop');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            
            expect(rainElements.length).toBeGreaterThan(0);
            expect(lightningElements.length).toBeGreaterThan(0);
            
            // But no snow
            const snowElements = container!.querySelectorAll('.snow-flake');
            expect(snowElements.length).toBe(0);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 5: Night overlay SHALL be present when isNight is true and absent when false', { timeout: 30000 }, () => {
    // **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
    
    fc.assert(
      fc.property(
        // Generate boolean values for night mode
        fc.boolean(),
        (isNightValue) => {
          // Set the night mode
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            store.setIsNight(isNightValue);
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<WeatherOverlay />);
            container = result.container;
          });
          
          // Property: Night overlay presence must match isNight state
          const nightOverlay = container!.querySelector('.night-overlay');
          
          if (isNightValue) {
            expect(nightOverlay).not.toBeNull();
          } else {
            expect(nightOverlay).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Weather and night effects SHALL be independent and combinable', { timeout: 60000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 6.1, 6.2**
    
    fc.assert(
      fc.property(
        // Generate all combinations of weather and night mode
        fc.constantFrom('CLEAR' as const, 'RAIN' as const, 'SNOW' as const, 'STORM' as const),
        fc.boolean(),
        (weatherState, isNightValue) => {
          // Set both weather and night mode
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            store.setWeather(weatherState);
            store.setIsNight(isNightValue);
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<WeatherOverlay />);
            container = result.container;
          });
          
          // Property: Night overlay should be independent of weather
          const nightOverlay = container!.querySelector('.night-overlay');
          if (isNightValue) {
            expect(nightOverlay).not.toBeNull();
          } else {
            expect(nightOverlay).toBeNull();
          }
          
          // Property: Weather effects should be independent of night mode
          if (weatherState === 'RAIN') {
            const rainElements = container!.querySelectorAll('.rain-drop');
            expect(rainElements.length).toBeGreaterThan(0);
          } else if (weatherState === 'SNOW') {
            const snowElements = container!.querySelectorAll('.snow-flake');
            expect(snowElements.length).toBeGreaterThan(0);
          } else if (weatherState === 'STORM') {
            const rainElements = container!.querySelectorAll('.rain-drop');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            expect(rainElements.length).toBeGreaterThan(0);
            expect(lightningElements.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 5: Weather overlay SHALL always render the base container', () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    
    act(() => {
      const store = usePetStore.getState();
      store.reset();
    });
    
    let container: HTMLElement;
    act(() => {
      const result = render(<WeatherOverlay />);
      container = result.container;
    });
    
    // Property: The weather-overlay container must always be present
    const weatherOverlay = container!.querySelector('.weather-overlay');
    expect(weatherOverlay).not.toBeNull();
  });

  it('Property 5: Multiple sequential weather changes SHALL update rendered elements correctly', { timeout: 60000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    
    fc.assert(
      fc.property(
        // Generate a sequence of weather changes
        fc.array(
          fc.constantFrom('CLEAR' as const, 'RAIN' as const, 'SNOW' as const, 'STORM' as const),
          { minLength: 2, maxLength: 3 }
        ),
        (weatherSequence) => {
          act(() => {
            usePetStore.getState().reset();
          });
          
          // Apply each weather change and verify rendering
          weatherSequence.forEach(weather => {
            act(() => {
              usePetStore.getState().setWeather(weather);
            });
            
            let container: HTMLElement;
            act(() => {
              const result = render(<WeatherOverlay />);
              container = result.container;
            });
            
            // Property: Rendered elements must match current weather state
            const rainElements = container!.querySelectorAll('.rain-drop');
            const snowElements = container!.querySelectorAll('.snow-flake');
            const lightningElements = container!.querySelectorAll('.lightning-flash');
            
            if (weather === 'CLEAR') {
              expect(rainElements.length).toBe(0);
              expect(snowElements.length).toBe(0);
              expect(lightningElements.length).toBe(0);
            } else if (weather === 'RAIN') {
              expect(rainElements.length).toBeGreaterThan(0);
              expect(snowElements.length).toBe(0);
              expect(lightningElements.length).toBe(0);
            } else if (weather === 'SNOW') {
              expect(snowElements.length).toBeGreaterThan(0);
              expect(rainElements.length).toBe(0);
              expect(lightningElements.length).toBe(0);
            } else if (weather === 'STORM') {
              expect(rainElements.length).toBeGreaterThan(0);
              expect(lightningElements.length).toBeGreaterThan(0);
              expect(snowElements.length).toBe(0);
            }
          });
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Property 5: RAIN weather SHALL render exactly 50 rain droplets', () => {
    // **Validates: Requirements 5.1**
    
    act(() => {
      const store = usePetStore.getState();
      store.reset();
      store.setWeather('RAIN');
    });
    
    let container: HTMLElement;
    act(() => {
      const result = render(<WeatherOverlay />);
      container = result.container;
    });
    
    // Property: Rain should have exactly 50 droplets
    const rainElements = container!.querySelectorAll('.rain-drop');
    expect(rainElements.length).toBe(50);
  });

  it('Property 5: SNOW weather SHALL render exactly 30 snowflakes', () => {
    // **Validates: Requirements 5.3**
    
    act(() => {
      const store = usePetStore.getState();
      store.reset();
      store.setWeather('SNOW');
    });
    
    let container: HTMLElement;
    act(() => {
      const result = render(<WeatherOverlay />);
      container = result.container;
    });
    
    // Property: Snow should have exactly 30 flakes
    const snowElements = container!.querySelectorAll('.snow-flake');
    expect(snowElements.length).toBe(30);
  });

  it('Property 5: STORM weather SHALL render both rain droplets and lightning flash', () => {
    // **Validates: Requirements 5.4**
    
    act(() => {
      const store = usePetStore.getState();
      store.reset();
      store.setWeather('STORM');
    });
    
    let container: HTMLElement;
    act(() => {
      const result = render(<WeatherOverlay />);
      container = result.container;
    });
    
    // Property: Storm should have both rain and lightning
    const rainElements = container!.querySelectorAll('.rain-drop');
    const lightningElements = container!.querySelectorAll('.lightning-flash');
    
    expect(rainElements.length).toBe(50); // Same as RAIN
    expect(lightningElements.length).toBe(1); // One lightning flash element
  });
});
