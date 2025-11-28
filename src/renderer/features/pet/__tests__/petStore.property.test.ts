// **Feature: pet-state-evolution, Property 1: Health Bounds Invariant**
// **Feature: pet-state-evolution, Property 2: XP Non-Negativity Invariant**
// **Feature: pet-state-evolution, Property 3: Stage Derivation from XP**
// **Feature: pet-state-evolution, Property 4: Death Overrides Stage**
// **Feature: pet-state-evolution, Property 5: Mood Derivation from Health**
// Testing the vital forces that bind our necromantic companion...

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  usePetStore, 
  clampHealth, 
  calculateStage, 
  calculateMood,
  Stage,
  Mood
} from '../petStore';

describe('Pet Store Property Tests', () => {
  beforeEach(() => {
    // Resurrecting the pet to its primordial state before each test
    usePetStore.getState().reset();
  });

  it('Property 1: For any health modification, the resulting health SHALL be within [0, 100]', () => {
    // **Validates: Requirements 1.2, 3.3**
    
    fc.assert(
      fc.property(
        // Generate arbitrary health modification amounts
        fc.integer({ min: -1000, max: 1000 }),
        fc.boolean(), // true = increase, false = decrease
        (amount, isIncrease) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Apply the health modification
          if (isIncrease) {
            store.increaseHealth(amount);
          } else {
            store.decreaseHealth(amount);
          }
          
          const finalHealth = usePetStore.getState().health;
          
          // Property: Health must always be within bounds
          expect(finalHealth).toBeGreaterThanOrEqual(0);
          expect(finalHealth).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1: clampHealth pure function SHALL always return values in [0, 100]', () => {
    // **Validates: Requirements 1.2, 3.3**
    
    fc.assert(
      fc.property(
        // Generate arbitrary numbers including extremes
        fc.integer({ min: -10000, max: 10000 }),
        (value) => {
          const clamped = clampHealth(value);
          
          // Property: Clamped value must be within bounds
          expect(clamped).toBeGreaterThanOrEqual(0);
          expect(clamped).toBeLessThanOrEqual(100);
          
          // Property: Values within range should be unchanged
          if (value >= 0 && value <= 100) {
            expect(clamped).toBe(value);
          }
          
          // Property: Values below 0 should become 0
          if (value < 0) {
            expect(clamped).toBe(0);
          }
          
          // Property: Values above 100 should become 100
          if (value > 100) {
            expect(clamped).toBe(100);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1: Multiple sequential health modifications SHALL maintain bounds', () => {
    // **Validates: Requirements 1.2, 3.3**
    
    fc.assert(
      fc.property(
        // Generate a sequence of health modifications
        fc.array(
          fc.record({
            amount: fc.integer({ min: 1, max: 200 }),
            isIncrease: fc.boolean()
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (modifications) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Apply all modifications
          modifications.forEach(({ amount, isIncrease }) => {
            if (isIncrease) {
              store.increaseHealth(amount);
            } else {
              store.decreaseHealth(amount);
            }
            
            // Property: After each modification, health must be in bounds
            const currentHealth = usePetStore.getState().health;
            expect(currentHealth).toBeGreaterThanOrEqual(0);
            expect(currentHealth).toBeLessThanOrEqual(100);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

  it('Property 2: For any XP modification, the resulting XP SHALL be >= 0', () => {
    // **Validates: Requirements 1.3**
    
    fc.assert(
      fc.property(
        // Generate arbitrary XP modification amounts including negatives
        fc.integer({ min: -1000, max: 1000 }),
        (amount) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Apply the XP modification
          store.increaseXP(amount);
          
          const finalXP = usePetStore.getState().xp;
          
          // Property: XP must never be negative
          expect(finalXP).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Multiple XP modifications SHALL maintain non-negativity', () => {
    // **Validates: Requirements 1.3**
    
    fc.assert(
      fc.property(
        // Generate a sequence of XP modifications
        fc.array(
          fc.integer({ min: -100, max: 100 }),
          { minLength: 1, maxLength: 20 }
        ),
        (modifications) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Apply all modifications
          modifications.forEach(amount => {
            store.increaseXP(amount);
            
            // Property: After each modification, XP must be non-negative
            const currentXP = usePetStore.getState().xp;
            expect(currentXP).toBeGreaterThanOrEqual(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: XP SHALL accumulate correctly with positive values', () => {
    // **Validates: Requirements 1.3**
    
    fc.assert(
      fc.property(
        // Generate positive XP gains
        fc.array(
          fc.integer({ min: 1, max: 50 }),
          { minLength: 1, maxLength: 10 }
        ),
        (gains) => {
          const store = usePetStore.getState();
          store.reset();
          
          let expectedXP = 0;
          
          // Apply all gains
          gains.forEach(amount => {
            store.increaseXP(amount);
            expectedXP += amount;
            
            // Property: XP should match the sum of all gains
            const currentXP = usePetStore.getState().xp;
            expect(currentXP).toBe(expectedXP);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: For any XP value with health > 0, stage SHALL be derived correctly', () => {
    // **Validates: Requirements 4.1, 4.2, 4.3**
    
    fc.assert(
      fc.property(
        // Generate arbitrary XP values
        fc.integer({ min: 0, max: 1000 }),
        // Generate health > 0
        fc.integer({ min: 1, max: 100 }),
        (xp, health) => {
          const stage = calculateStage(xp, health);
          
          // Property: Stage must match XP thresholds
          if (xp <= 10) {
            expect(stage).toBe(Stage.EGG);
          } else if (xp <= 50) {
            expect(stage).toBe(Stage.LARVA);
          } else {
            expect(stage).toBe(Stage.BEAST);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Stage SHALL update correctly when XP increases in store', () => {
    // **Validates: Requirements 4.1, 4.2, 4.3**
    
    fc.assert(
      fc.property(
        // Generate XP gains that will cross thresholds
        fc.array(
          fc.integer({ min: 1, max: 10 }),
          { minLength: 1, maxLength: 20 }
        ),
        (xpGains) => {
          const store = usePetStore.getState();
          store.reset();
          
          let totalXP = 0;
          
          // Apply all XP gains
          xpGains.forEach(gain => {
            store.increaseXP(gain);
            totalXP += gain;
            
            const currentState = usePetStore.getState();
            
            // Property: Stage should match current XP (as long as health > 0)
            if (currentState.health > 0) {
              if (totalXP <= 10) {
                expect(currentState.stage).toBe(Stage.EGG);
              } else if (totalXP <= 50) {
                expect(currentState.stage).toBe(Stage.LARVA);
              } else {
                expect(currentState.stage).toBe(Stage.BEAST);
              }
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Stage boundaries SHALL be exact at thresholds', () => {
    // **Validates: Requirements 4.1, 4.2, 4.3**
    
    // Test exact boundary values
    expect(calculateStage(0, 100)).toBe(Stage.EGG);
    expect(calculateStage(10, 100)).toBe(Stage.EGG);
    expect(calculateStage(11, 100)).toBe(Stage.LARVA);
    expect(calculateStage(50, 100)).toBe(Stage.LARVA);
    expect(calculateStage(51, 100)).toBe(Stage.BEAST);
    expect(calculateStage(1000, 100)).toBe(Stage.BEAST);
  });

  it('Property 4: For any XP value, when health = 0, stage SHALL be GHOST and mood SHALL be DEAD', () => {
    // **Validates: Requirements 4.4, 4.5**
    
    fc.assert(
      fc.property(
        // Generate arbitrary XP values
        fc.integer({ min: 0, max: 1000 }),
        (xp) => {
          const stage = calculateStage(xp, 0);
          const mood = calculateMood(0);
          
          // Property: Death overrides all stage calculations
          expect(stage).toBe(Stage.GHOST);
          expect(mood).toBe(Mood.DEAD);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: When health reaches 0 in store, stage SHALL become GHOST regardless of XP', () => {
    // **Validates: Requirements 4.4, 4.5**
    
    fc.assert(
      fc.property(
        // Generate initial XP that could be at any stage
        fc.integer({ min: 0, max: 200 }),
        // Generate health decrease that will kill the pet
        fc.integer({ min: 100, max: 500 }),
        (initialXP, healthDecrease) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Set up the pet with some XP
          for (let i = 0; i < initialXP; i++) {
            store.increaseXP(1);
          }
          
          // Kill the pet
          store.decreaseHealth(healthDecrease);
          
          const finalState = usePetStore.getState();
          
          // Property: Death overrides stage
          expect(finalState.health).toBe(0);
          expect(finalState.stage).toBe(Stage.GHOST);
          expect(finalState.mood).toBe(Mood.DEAD);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Resurrection (health increase from 0) SHALL restore proper stage', () => {
    // **Validates: Requirements 4.4, 4.5**
    
    fc.assert(
      fc.property(
        // Generate XP for different stages
        fc.integer({ min: 0, max: 100 }),
        // Generate health restoration amount
        fc.integer({ min: 1, max: 100 }),
        (xp, healthRestore) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Set up XP
          for (let i = 0; i < xp; i++) {
            store.increaseXP(1);
          }
          
          // Kill the pet
          store.decreaseHealth(200);
          expect(usePetStore.getState().stage).toBe(Stage.GHOST);
          
          // Resurrect the pet
          store.increaseHealth(healthRestore);
          
          const finalState = usePetStore.getState();
          
          // Property: If health > 0, stage should be based on XP again
          if (finalState.health > 0) {
            if (xp <= 10) {
              expect(finalState.stage).toBe(Stage.EGG);
            } else if (xp <= 50) {
              expect(finalState.stage).toBe(Stage.LARVA);
            } else {
              expect(finalState.stage).toBe(Stage.BEAST);
            }
            expect(finalState.mood).not.toBe(Mood.DEAD);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: For any health value > 0, mood SHALL be derived correctly', () => {
    // **Validates: Requirements 6.1, 6.2, 6.3**
    
    fc.assert(
      fc.property(
        // Generate health values > 0
        fc.integer({ min: 1, max: 100 }),
        (health) => {
          const mood = calculateMood(health);
          
          // Property: Mood must match health thresholds
          if (health > 50) {
            expect(mood).toBe(Mood.HAPPY);
          } else {
            expect(mood).toBe(Mood.HUNGRY);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Mood SHALL update correctly when health changes in store', () => {
    // **Validates: Requirements 6.1, 6.2, 6.3**
    
    fc.assert(
      fc.property(
        // Generate health modifications
        fc.array(
          fc.record({
            amount: fc.integer({ min: 1, max: 30 }),
            isIncrease: fc.boolean()
          }),
          { minLength: 1, maxLength: 15 }
        ),
        (modifications) => {
          const store = usePetStore.getState();
          store.reset();
          
          // Apply all modifications
          modifications.forEach(({ amount, isIncrease }) => {
            if (isIncrease) {
              store.increaseHealth(amount);
            } else {
              store.decreaseHealth(amount);
            }
            
            const currentState = usePetStore.getState();
            
            // Property: Mood should match current health
            if (currentState.health === 0) {
              expect(currentState.mood).toBe(Mood.DEAD);
            } else if (currentState.health > 50) {
              expect(currentState.mood).toBe(Mood.HAPPY);
            } else {
              expect(currentState.mood).toBe(Mood.HUNGRY);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Mood boundaries SHALL be exact at thresholds', () => {
    // **Validates: Requirements 6.1, 6.2, 6.3**
    
    // Test exact boundary values
    expect(calculateMood(0)).toBe(Mood.DEAD);
    expect(calculateMood(1)).toBe(Mood.HUNGRY);
    expect(calculateMood(50)).toBe(Mood.HUNGRY);
    expect(calculateMood(51)).toBe(Mood.HAPPY);
    expect(calculateMood(100)).toBe(Mood.HAPPY);
  });

  it('Property 5: Mood transitions SHALL be consistent across health changes', () => {
    // **Validates: Requirements 6.1, 6.2, 6.3**
    
    const store = usePetStore.getState();
    store.reset();
    
    // Start HAPPY (health = 100)
    expect(usePetStore.getState().mood).toBe(Mood.HAPPY);
    
    // Decrease to HUNGRY threshold
    store.decreaseHealth(50);
    expect(usePetStore.getState().health).toBe(50);
    expect(usePetStore.getState().mood).toBe(Mood.HUNGRY);
    
    // Increase back to HAPPY
    store.increaseHealth(1);
    expect(usePetStore.getState().health).toBe(51);
    expect(usePetStore.getState().mood).toBe(Mood.HAPPY);
    
    // Decrease to DEAD
    store.decreaseHealth(100);
    expect(usePetStore.getState().health).toBe(0);
    expect(usePetStore.getState().mood).toBe(Mood.DEAD);
    
    // Resurrect to HUNGRY
    store.increaseHealth(25);
    expect(usePetStore.getState().health).toBe(25);
    expect(usePetStore.getState().mood).toBe(Mood.HUNGRY);
  });
