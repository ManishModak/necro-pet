// **Feature: pet-state-evolution, Property 8: Display State Reflection**
// Testing that the pet's manifestation reflects its true essence...

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, act } from '@testing-library/react';
import { PetDisplay } from '../PetDisplay';
import { usePetStore, Stage, Mood } from '../petStore';

describe('PetDisplay Property Tests', () => {
  beforeEach(() => {
    // Resurrecting the pet to its primordial state before each test
    act(() => {
      usePetStore.getState().reset();
    });
  });

  it('Property 8: For any pet state, the display SHALL contain health value, XP value, and stage-appropriate elements', { timeout: 30000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 6.4**
    
    fc.assert(
      fc.property(
        // Generate arbitrary pet states
        fc.integer({ min: 0, max: 100 }), // health
        fc.integer({ min: 0, max: 200 }),  // xp
        (health, xp) => {
          // Set up the pet state
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            
            // First set health
            if (health < 100) {
              store.decreaseHealth(100 - health);
            }
            
            // Then set XP
            for (let i = 0; i < xp; i++) {
              store.increaseXP(1);
            }
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<PetDisplay />);
            container = result.container;
          });
          
          const displayText = container!.textContent || '';
          
          // Property: Display must contain the health value
          expect(displayText).toContain(health.toString());
          
          // Property: Display must contain the XP value
          expect(displayText).toContain(xp.toString());
          
          // Property: Display must contain stage-appropriate text
          const currentState = usePetStore.getState();
          
          if (currentState.stage === Stage.EGG) {
            expect(displayText).toContain('EGG');
          } else if (currentState.stage === Stage.LARVA) {
            expect(displayText).toContain('LARVA');
          } else if (currentState.stage === Stage.BEAST) {
            expect(displayText).toContain('BEAST');
          } else if (currentState.stage === Stage.GHOST) {
            expect(displayText).toContain('GHOST');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: Display SHALL reflect mood changes through visual feedback', { timeout: 30000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 6.4**
    
    fc.assert(
      fc.property(
        // Generate health values that will produce different moods
        fc.integer({ min: 0, max: 100 }),
        (health) => {
          // Set health to desired value
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            
            if (health < 100) {
              store.decreaseHealth(100 - health);
            }
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<PetDisplay />);
            container = result.container;
          });
          
          const displayText = container!.textContent || '';
          const currentState = usePetStore.getState();
          
          // Property: Display must reflect the current mood state
          if (currentState.mood === Mood.DEAD) {
            expect(displayText).toContain('perished');
          } else if (currentState.mood === Mood.HUNGRY) {
            expect(displayText).toContain('Craving');
          } else if (currentState.mood === Mood.HAPPY) {
            expect(displayText).toContain('Content');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: Display SHALL show correct stage name for all XP values', { timeout: 30000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 6.4**
    
    fc.assert(
      fc.property(
        // Generate XP values across all stage thresholds
        fc.integer({ min: 0, max: 200 }),
        (xp) => {
          // Set XP
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            
            for (let i = 0; i < xp; i++) {
              store.increaseXP(1);
            }
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<PetDisplay />);
            container = result.container;
          });
          
          const displayText = container!.textContent || '';
          
          // Property: Stage name must be present and correct
          if (xp <= 10) {
            expect(displayText).toContain('EGG');
          } else if (xp <= 50) {
            expect(displayText).toContain('LARVA');
          } else {
            expect(displayText).toContain('BEAST');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: Display SHALL show GHOST stage when health is 0 regardless of XP', { timeout: 30000 }, () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 6.4**
    
    fc.assert(
      fc.property(
        // Generate any XP value
        fc.integer({ min: 0, max: 200 }),
        (xp) => {
          // Set XP and kill the pet
          act(() => {
            const store = usePetStore.getState();
            store.reset();
            
            for (let i = 0; i < xp; i++) {
              store.increaseXP(1);
            }
            
            // Kill the pet
            store.decreaseHealth(200);
          });
          
          // Render the component
          let container: HTMLElement;
          act(() => {
            const result = render(<PetDisplay />);
            container = result.container;
          });
          
          const displayText = container!.textContent || '';
          
          // Property: Display must show GHOST stage and death message
          expect(displayText).toContain('GHOST');
          expect(displayText).toContain('0'); // health = 0
          expect(displayText).toContain('perished');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: Display SHALL contain all required UI elements', () => {
    // **Validates: Requirements 5.1, 5.2, 5.3, 6.4**
    
    act(() => {
      const store = usePetStore.getState();
      store.reset();
    });
    
    let container: HTMLElement;
    act(() => {
      const result = render(<PetDisplay />);
      container = result.container;
    });
    
    const displayText = container!.textContent || '';
    
    // Property: Display must contain essential UI elements
    expect(displayText).toContain('PET STATUS');
    expect(displayText).toContain('HP');
    expect(displayText).toContain('XP');
    expect(displayText).toContain('Stage:');
    
    // Property: Display must show initial values
    expect(displayText).toContain('100'); // initial health
    expect(displayText).toContain('0');   // initial XP
    expect(displayText).toContain('EGG'); // initial stage
  });
});
