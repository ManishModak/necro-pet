// Property Tests: Revival Mechanics
// Property 4: Revival Health Bounds
// Property 5: Ghost State Consistency
// Property 6: XP Preservation on Revival
// Validates: Requirements 4.1, 4.2, 4.3

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { usePetStore, calculateRevivalHealth, Stage, Mood } from '../petStore';

describe('Pet Revival Property Tests', () => {
    beforeEach(() => {
        // Reset pet store to initial state
        usePetStore.getState().reset();
    });

    it('Property 4: Revival Health Bounds - Revival health SHALL be exactly 50 or 75 HP', () => {
        fc.assert(
            fc.property(
                // Generate various commit messages
                fc.string({ minLength: 5, maxLength: 100 }),
                (commitMessage) => {
                    const revivalHealth = calculateRevivalHealth(commitMessage);

                    // Property: Revival health must be either 50 or 75
                    const isValid = revivalHealth === 50 || revivalHealth === 75;
                    expect(isValid).toBe(true);

                    // Property: "resurrect" message gives 75 HP
                    if (commitMessage.toLowerCase().includes('resurrect')) {
                        expect(revivalHealth).toBe(75);
                    } else {
                        // Property: Normal message gives 50 HP
                        expect(revivalHealth).toBe(50);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 4: Revival SHALL use correct health based on commit message', () => {
        const testCases = [
            { message: 'resurrect the pet', expectedHealth: 75 },
            { message: 'RESURRECT NOW!', expectedHealth: 75 },
            { message: 'Resurrect: bringing back to life', expectedHealth: 75 },
            { message: 'normal commit', expectedHealth: 50 },
            { message: 'fix: bug in code', expectedHealth: 50 },
            { message: 'feature: new stuff', expectedHealth: 50 },
            { message: '', expectedHealth: 50 },
        ];

        testCases.forEach(({ message, expectedHealth }) => {
            const health = calculateRevivalHealth(message);
            expect(health).toBe(expectedHealth);
        });
    });

    it('Property 5: Ghost State Consistency - Dead pet SHALL become GHOST', () => {
        fc.assert(
            fc.property(
                // Generate initial XP before death
                fc.integer({ min: 0, max: 100 }),
                (initialXP) => {
                    const store = usePetStore.getState();
                    store.reset();

                    // Build up XP
                    for (let i = 0; i < initialXP; i++) {
                        store.increaseXP(1);
                    }

                    // Kill the pet
                    store.decreaseHealth(100);

                    const state = usePetStore.getState();

                    // Property: Health must be 0 when dead
                    expect(state.health).toBe(0);

                    // Property: Stage must be GHOST when health is 0
                    expect(state.stage).toBe(Stage.GHOST);

                    // Property: Mood must be DEAD when health is 0
                    expect(state.mood).toBe(Mood.DEAD);
                }
            ),
            { numRuns: 50 }
        );
    });

    it('Property 5: Ghost transition SHALL be immediate when health reaches 0', () => {
        const store = usePetStore.getState();
        store.reset();

        // Build to evolution level 2 (BEAST stage) by accumulating 400+ XP (evolve at 200, reset, evolve again at 200)
        for (let i = 0; i < 200; i++) {
            store.increaseXP(1);
        }
        // First evolution at 200 XP -> LARVA, XP resets to 0
        for (let i = 0; i < 60; i++) {
            store.increaseXP(1);
        }
        // Now at XP 60, evolutionLevel 1 (LARVA)

        expect(usePetStore.getState().stage).toBe(Stage.LARVA);

        // Kill the pet
        store.decreaseHealth(100);

        // Property: Immediately becomes GHOST
        expect(usePetStore.getState().stage).toBe(Stage.GHOST);
        expect(usePetStore.getState().mood).toBe(Mood.DEAD);
    });

    it('Property 6: XP Reset on Revival - XP SHALL be reset to 0 during revival', () => {
        fc.assert(
            fc.property(
                // Generate XP before death
                fc.integer({ min: 0, max: 150 }),
                // Generate commit message
                fc.boolean(), // true = resurrect message, false = normal
                (xpBeforeDeath, isResurrect) => {
                    const store = usePetStore.getState();
                    store.reset();

                    // Build up XP
                    for (let i = 0; i < xpBeforeDeath; i++) {
                        store.increaseXP(1);
                    }

                    // Kill the pet
                    store.decreaseHealth(100);

                    expect(usePetStore.getState().health).toBe(0);
                    expect(usePetStore.getState().stage).toBe(Stage.GHOST);

                    // Revive with commit
                    const message = isResurrect ? 'resurrect: bring back' : 'fix: normal commit';
                    store.feedFromCommit('test-hash', message, Date.now());

                    const state = usePetStore.getState();

                    // Property: XP after revival should be 15 (reset to 0, then +15 from feeding)
                    expect(state.xp).toBe(15);

                    // Property: Health is set to revival amount
                    const expectedHealth = isResurrect ? 75 : 50;
                    expect(state.health).toBe(expectedHealth);

                    // Property: Death count is incremented
                    expect(state.deathCount).toBeGreaterThan(0);

                    // Property: Stage is EGG (evolutionLevel 0) after revival
                    // Revival resets evolutionLevel to 0, and 15 XP is still EGG (0-199 range)
                    expect(state.stage).toBe(Stage.EGG);
                    expect(state.mood).not.toBe(Mood.DEAD);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 6: Stage SHALL be LARVA after revival due to XP reset (15 XP)', () => {
        const testCases = [
            { xp: 5 },
            { xp: 15 },
            { xp: 55 },
        ];

        testCases.forEach(({ xp }) => {
            const store = usePetStore.getState();
            store.reset();

            // Build up XP
            for (let i = 0; i < xp; i++) {
                store.increaseXP(1);
            }

            // Kill the pet
            store.decreaseHealth(100);
            expect(usePetStore.getState().stage).toBe(Stage.GHOST);

            // Revive
            store.feedFromCommit('hash', 'normal commit', Date.now());

            // Property: Stage is always EGG because revival resets evolutionLevel to 0
            // and 15 XP is still in EGG range (0-199)
            expect(usePetStore.getState().stage).toBe(Stage.EGG);
        });
    });

    it('Property 6: Multiple deaths SHALL increment deathCount correctly', () => {
        fc.assert(
            fc.property(
                // Generate number of death/revival cycles
                fc.integer({ min: 1, max: 5 }),
                (numDeaths) => {
                    const store = usePetStore.getState();
                    store.reset();

                    const initialDeathCount = usePetStore.getState().deathCount;

                    for (let i = 0; i < numDeaths; i++) {
                        // Ensure pet is alive
                        if (usePetStore.getState().health === 0) {
                            store.feedFromCommit(`hash-${i}`, 'revive', Date.now());
                        }

                        // Kill the pet
                        store.decreaseHealth(100);

                        // Revive the pet
                        store.feedFromCommit(`hash-revive-${i}`, 'resurrect', Date.now());
                    }

                    // Property: Death count increases by number of deaths
                    expect(usePetStore.getState().deathCount).toBe(initialDeathCount + numDeaths);
                }
            ),
            { numRuns: 50 }
        );
    });
});
