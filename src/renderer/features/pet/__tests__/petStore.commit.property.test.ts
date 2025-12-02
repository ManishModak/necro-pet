// Property Test: Health Bounds After Commit
// Validates: Requirement 1.2 - Health increases by 20, capped at 100
// Testing that feedFromCommit properly manages health boundaries

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { usePetStore, clampHealth } from '../petStore';

describe('Pet Store Commit Property Tests', () => {
    beforeEach(() => {
        // Reset pet store to initial state
        usePetStore.getState().reset();
    });

    it('Property 1: Health Bounds After Commit - Health SHALL increase by 20 (capped at 100)', () => {
        fc.assert(
            fc.property(
                // Generate initial health state
                fc.integer({ min: 0, max: 100 }),
                // Generate initial XP
                fc.integer({ min: 0, max: 150 }),
                // Generate number of commits
                fc.integer({ min: 1, max: 10 }),
                (initialHealth, initialXP, numCommits) => {
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

                    // Simulate commits
                    for (let i = 0; i < numCommits; i++) {
                        store.feedFromCommit(
                            `test-hash-${i}`,
                            `Test commit message ${i}`,
                            Date.now() + i * 1000
                        );
                    }

                    const finalHealth = usePetStore.getState().health;
                    const finalXP = usePetStore.getState().xp;

                    // Property 1: Health increases by 20 per commit, capped at 100
                    const expectedHealth = Math.min(100, startHealth + (numCommits * 20));
                    expect(finalHealth).toBe(expectedHealth);

                    // Additional validation: Health must be in valid range
                    expect(finalHealth).toBeGreaterThanOrEqual(0);
                    expect(finalHealth).toBeLessThanOrEqual(100);

                    // Property 2: XP increases by 15 per commit (no cap)
                    const expectedXP = startXP + (numCommits * 15);
                    expect(finalXP).toBe(expectedXP);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1: Health bounds SHALL be respected even with health near cap', () => {
        fc.assert(
            fc.property(
                // Generate health near the cap
                fc.integer({ min: 85, max: 100 }),
                // Generate number of commits
                fc.integer({ min: 1, max: 5 }),
                (initialHealth, numCommits) => {
                    const store = usePetStore.getState();
                    store.reset();

                    // Set health near cap
                    if (initialHealth < 100) {
                        store.decreaseHealth(100 - initialHealth);
                    }

                    const startHealth = usePetStore.getState().health;

                    // Simulate multiple commits
                    for (let i = 0; i < numCommits; i++) {
                        store.feedFromCommit(
                            `test-hash-${i}`,
                            `Test commit ${i}`,
                            Date.now()
                        );
                    }

                    const finalHealth = usePetStore.getState().health;

                    // Property: Health must never exceed 100
                    expect(finalHealth).toBeLessThanOrEqual(100);

                    // Property: Health should be exactly 100 or start + increments
                    const expectedHealth = Math.min(100, startHealth + (numCommits * 20));
                    expect(finalHealth).toBe(expectedHealth);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1: clampHealth function SHALL always return valid health values', () => {
        fc.assert(
            fc.property(
                // Generate any integer (including negative and > 100)
                fc.integer({ min: -200, max: 300 }),
                (rawHealth) => {
                    const clamped = clampHealth(rawHealth);

                    // Property: Result must be in [0, 100]
                    expect(clamped).toBeGreaterThanOrEqual(0);
                    expect(clamped).toBeLessThanOrEqual(100);

                    // Property: If input is in range, output equals input
                    if (rawHealth >= 0 && rawHealth <= 100) {
                        expect(clamped).toBe(rawHealth);
                    }

                    // Property: If input < 0, output is 0
                    if (rawHealth < 0) {
                        expect(clamped).toBe(0);
                    }

                    // Property: If input > 100, output is 100
                    if (rawHealth > 100) {
                        expect(clamped).toBe(100);
                    }
                }
            ),
            { numRuns: 200 }
        );
    });
});
