// **Feature: pet-state-evolution, Property 6: Growth Mechanic Consistency**
// **Feature: pet-state-evolution, Property 7: Decay Mechanic Consistency**
// Testing the dark forces of growth and decay...

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useGameLoop } from '../useGameLoop';
import { usePetStore } from '../petStore';

// Mocking the electron API for testing in the void
const mockElectronAPI = {
  onFileChanged: vi.fn(),
  onFileAdded: vi.fn(),
  removeFileListeners: vi.fn(),
};

describe('Game Loop Property Tests', () => {
  beforeEach(() => {
    // Resurrecting the pet to its primordial state
    usePetStore.getState().reset();
    
    // Installing the mock bridge to the crypt
    (window as any).electronAPI = mockElectronAPI;
    
    // Clearing all mock invocations
    vi.clearAllMocks();
    
    // Using fake timers to control the flow of time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restoring the natural flow of time
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('Property 6: For any file change event, health SHALL increase by 5 (capped at 100) and XP SHALL increase by 1', () => {
    // **Validates: Requirements 3.1, 3.2**
    
    fc.assert(
      fc.property(
        // Generate initial health state
        fc.integer({ min: 0, max: 100 }),
        // Generate initial XP
        fc.integer({ min: 0, max: 100 }),
        // Generate number of file change events
        fc.integer({ min: 1, max: 20 }),
        (initialHealth, initialXP, numEvents) => {
          // Set up initial state
          const store = usePetStore.getState();
          store.reset();
          
          // Adjust to initial health
          if (initialHealth < 100) {
            store.decreaseHealth(100 - initialHealth);
          }
          
          // Adjust to initial XP
          for (let i = 0; i < initialXP; i++) {
            store.increaseXP(1);
          }
          
          const startHealth = usePetStore.getState().health;
          const startXP = usePetStore.getState().xp;
          
          // Render the hook
          renderHook(() => useGameLoop({ decayIntervalMs: 999999 })); // Long decay to avoid interference
          
          // Get the file change callback that was registered
          expect(mockElectronAPI.onFileChanged).toHaveBeenCalled();
          const fileChangeCallback = mockElectronAPI.onFileChanged.mock.calls[0][0];
          
          // Simulate file change events
          for (let i = 0; i < numEvents; i++) {
            act(() => {
              fileChangeCallback({
                type: 'file:changed',
                path: `/test/file${i}.ts`,
                timestamp: Date.now(),
              });
            });
          }
          
          const finalHealth = usePetStore.getState().health;
          const finalXP = usePetStore.getState().xp;
          
          // Property: Health increases by 5 per event, capped at 100
          const expectedHealth = Math.min(100, startHealth + (numEvents * 5));
          expect(finalHealth).toBe(expectedHealth);
          
          // Property: XP increases by 1 per event (no cap)
          const expectedXP = startXP + numEvents;
          expect(finalXP).toBe(expectedXP);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Growth mechanic SHALL respect health cap of 100', () => {
    // **Validates: Requirements 3.1, 3.2**
    
    fc.assert(
      fc.property(
        // Generate health near the cap
        fc.integer({ min: 90, max: 100 }),
        // Generate number of file events
        fc.integer({ min: 1, max: 10 }),
        (initialHealth, numEvents) => {
          // Reset store before each iteration
          usePetStore.getState().reset();
          vi.clearAllMocks();
          
          const store = usePetStore.getState();
          
          // Set health near cap
          if (initialHealth < 100) {
            store.decreaseHealth(100 - initialHealth);
          }
          
          const startHealth = usePetStore.getState().health;
          
          // Render the hook
          const { unmount } = renderHook(() => useGameLoop({ decayIntervalMs: 999999 }));
          
          const fileChangeCallback = mockElectronAPI.onFileChanged.mock.calls[0][0];
          
          // Simulate multiple file changes
          for (let i = 0; i < numEvents; i++) {
            act(() => {
              fileChangeCallback({
                type: 'file:changed',
                path: `/test/file${i}.ts`,
                timestamp: Date.now(),
              });
            });
          }
          
          const finalHealth = usePetStore.getState().health;
          
          // Cleanup
          unmount();
          
          // Property: Health must never exceed 100
          expect(finalHealth).toBeLessThanOrEqual(100);
          // Property: Health should be min(100, startHealth + numEvents * 5)
          const expectedHealth = Math.min(100, startHealth + (numEvents * 5));
          expect(finalHealth).toBe(expectedHealth);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Growth mechanic SHALL work with custom config values', () => {
    // **Validates: Requirements 3.1, 3.2**
    
    fc.assert(
      fc.property(
        // Generate custom health gain
        fc.integer({ min: 1, max: 20 }),
        // Generate custom XP gain
        fc.integer({ min: 1, max: 10 }),
        // Generate number of events
        fc.integer({ min: 1, max: 5 }),
        (customHealthGain, customXPGain, numEvents) => {
          // Reset store before each iteration
          usePetStore.getState().reset();
          vi.clearAllMocks();
          
          const store = usePetStore.getState();
          
          // Set to 50 health
          store.decreaseHealth(50);
          
          const startHealth = usePetStore.getState().health;
          const startXP = usePetStore.getState().xp;
          
          // Render with custom config
          const { unmount } = renderHook(() => 
            useGameLoop({ 
              decayIntervalMs: 999999,
              healthGain: customHealthGain,
              xpGain: customXPGain
            })
          );
          
          const fileChangeCallback = mockElectronAPI.onFileChanged.mock.calls[0][0];
          
          // Simulate file changes
          for (let i = 0; i < numEvents; i++) {
            act(() => {
              fileChangeCallback({
                type: 'file:changed',
                path: `/test/file${i}.ts`,
                timestamp: Date.now(),
              });
            });
          }
          
          const finalHealth = usePetStore.getState().health;
          const finalXP = usePetStore.getState().xp;
          
          // Cleanup
          unmount();
          
          // Property: Health and XP should increase by custom amounts
          const expectedHealth = Math.min(100, startHealth + (numEvents * customHealthGain));
          const expectedXP = startXP + (numEvents * customXPGain);
          
          expect(finalHealth).toBe(expectedHealth);
          expect(finalXP).toBe(expectedXP);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: For any number of decay intervals N, health SHALL decrease by exactly N (floored at 0)', () => {
    // **Validates: Requirements 2.1**
    
    fc.assert(
      fc.property(
        // Generate initial health
        fc.integer({ min: 0, max: 100 }),
        // Generate number of decay intervals
        fc.integer({ min: 1, max: 150 }),
        // Generate decay amount
        fc.integer({ min: 1, max: 5 }),
        (initialHealth, numIntervals, decayAmount) => {
          // Reset store before each iteration
          usePetStore.getState().reset();
          vi.clearAllMocks();
          
          const store = usePetStore.getState();
          
          // Set initial health
          if (initialHealth < 100) {
            store.decreaseHealth(100 - initialHealth);
          }
          
          const startHealth = usePetStore.getState().health;
          
          // Render the hook with a short decay interval for testing
          const decayIntervalMs = 100; // 100ms for fast testing
          const { unmount } = renderHook(() => 
            useGameLoop({ 
              decayIntervalMs,
              decayAmount
            })
          );
          
          // Advance time by N intervals
          act(() => {
            vi.advanceTimersByTime(decayIntervalMs * numIntervals);
          });
          
          const finalHealth = usePetStore.getState().health;
          
          // Cleanup
          unmount();
          
          // Property: Health decreases by decayAmount * numIntervals, floored at 0
          const expectedHealth = Math.max(0, startHealth - (decayAmount * numIntervals));
          expect(finalHealth).toBe(expectedHealth);
          
          // Property: Health must never go below 0
          expect(finalHealth).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Decay SHALL trigger death condition when health reaches 0', () => {
    // **Validates: Requirements 2.1**
    
    fc.assert(
      fc.property(
        // Generate low initial health that will lead to death
        fc.integer({ min: 1, max: 10 }),
        (initialHealth) => {
          // Reset store and mocks before each iteration
          usePetStore.getState().reset();
          vi.clearAllMocks();
          
          const store = usePetStore.getState();
          
          // Set low health
          store.decreaseHealth(100 - initialHealth);
          
          // Render the hook
          const decayIntervalMs = 100;
          const { unmount } = renderHook(() => 
            useGameLoop({ 
              decayIntervalMs,
              decayAmount: 1
            })
          );
          
          // Advance time enough to kill the pet
          act(() => {
            vi.advanceTimersByTime(decayIntervalMs * (initialHealth + 5));
          });
          
          const finalState = usePetStore.getState();
          
          // Cleanup to prevent timer leaks
          unmount();
          
          // Property: When health reaches 0, pet should be dead (GHOST stage, DEAD mood)
          expect(finalState.health).toBe(0);
          expect(finalState.stage).toBe('GHOST');
          expect(finalState.mood).toBe('DEAD');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Decay and growth mechanics SHALL interact correctly', () => {
    // **Validates: Requirements 2.1, 3.1, 3.2**
    
    fc.assert(
      fc.property(
        // Generate number of decay intervals
        fc.integer({ min: 1, max: 10 }),
        // Generate number of file events
        fc.integer({ min: 1, max: 10 }),
        (numDecayIntervals, numFileEvents) => {
          // Reset store before each iteration
          usePetStore.getState().reset();
          vi.clearAllMocks();
          
          const startHealth = usePetStore.getState().health; // Should be 100 after reset
          const startXP = usePetStore.getState().xp; // Should be 0 after reset
          
          // Render the hook
          const decayIntervalMs = 100;
          const { unmount } = renderHook(() => 
            useGameLoop({ 
              decayIntervalMs,
              decayAmount: 1,
              healthGain: 5,
              xpGain: 1
            })
          );
          
          const fileChangeCallback = mockElectronAPI.onFileChanged.mock.calls[0][0];
          
          // Simulate decay intervals
          act(() => {
            vi.advanceTimersByTime(decayIntervalMs * numDecayIntervals);
          });
          
          // Simulate file change events
          for (let i = 0; i < numFileEvents; i++) {
            act(() => {
              fileChangeCallback({
                type: 'file:changed',
                path: `/test/file${i}.ts`,
                timestamp: Date.now(),
              });
            });
          }
          
          const finalHealth = usePetStore.getState().health;
          const finalXP = usePetStore.getState().xp;
          
          // Cleanup
          unmount();
          
          // Property: Final health = start - decay + growth, clamped to [0, 100]
          const expectedHealth = Math.max(0, Math.min(100, 
            startHealth - numDecayIntervals + (numFileEvents * 5)
          ));
          expect(finalHealth).toBe(expectedHealth);
          
          // Property: XP only increases from file events
          expect(finalXP).toBe(startXP + numFileEvents);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Cleanup SHALL stop decay timer', () => {
    // **Validates: Requirements 2.3**
    
    const store = usePetStore.getState();
    store.reset();
    
    const decayIntervalMs = 100;
    const { unmount } = renderHook(() => 
      useGameLoop({ 
        decayIntervalMs,
        decayAmount: 1
      })
    );
    
    const healthBeforeUnmount = usePetStore.getState().health;
    
    // Unmount the hook (cleanup)
    unmount();
    
    // Advance time - decay should NOT happen after unmount
    act(() => {
      vi.advanceTimersByTime(decayIntervalMs * 10);
    });
    
    const healthAfterUnmount = usePetStore.getState().health;
    
    // Property: Health should not change after cleanup
    expect(healthAfterUnmount).toBe(healthBeforeUnmount);
  });

  it('Property 7: Cleanup SHALL remove file listeners', () => {
    // **Validates: Requirements 3.4**
    
    const { unmount } = renderHook(() => useGameLoop());
    
    // Verify listener was registered
    expect(mockElectronAPI.onFileChanged).toHaveBeenCalled();
    
    // Unmount the hook
    unmount();
    
    // Property: removeFileListeners should be called on cleanup
    expect(mockElectronAPI.removeFileListeners).toHaveBeenCalled();
  });
});
