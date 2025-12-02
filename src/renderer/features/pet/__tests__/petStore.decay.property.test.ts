// Property Test: Decay Calculation Consistency
// Validates: Requirements 3.2, 3.3, 3.4, 3.5
// Testing time-based decay formula correctness

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateDecay } from '../petStore';

describe('Decay Calculation Property Tests', () => {
    it('Property 2: Decay calculation SHALL follow the specified formula', () => {
        fc.assert(
            fc.property(
                // Generate hours since commit (0 to 30 days)
                fc.float({ min: 0, max: 720, noNaN: true }),
                (hoursSinceCommit) => {
                    const decay = calculateDecay(hoursSinceCommit);

                    // Property: Decay must be non-negative
                    expect(decay).toBeGreaterThanOrEqual(0);

                    // Property: Decay follows the correct formula based on time ranges
                    if (hoursSinceCommit <= 24) {
                        // Grace period - Day 1: No decay
                        expect(decay).toBe(0);
                    } else if (hoursSinceCommit <= 48) {
                        // Day 2: 15 HP decay
                        expect(decay).toBe(15);
                    } else if (hoursSinceCommit <= 72) {
                        // Day 3: 40 HP decay (15 + 25)
                        expect(decay).toBe(40);
                    } else {
                        // Day 4+: 40 + 35 per additional day
                        const additionalDays = Math.floor((hoursSinceCommit - 72) / 24);
                        const expected = 40 + (additionalDays * 35);
                        expect(decay).toBe(expected);
                    }
                }
            ),
            { numRuns: 200 }
        );
    });

    it('Property 2: Decay SHALL be monotonically increasing over time', () => {
        fc.assert(
            fc.property(
                // Generate two timestamps where second > first
                fc.float({ min: 0, max: 500, noNaN: true }),
                fc.float({ min: 1, max: 200, noNaN: true }),
                (hours1, hoursIncrement) => {
                    const hours2 = hours1 + hoursIncrement;

                    const decay1 = calculateDecay(hours1);
                    const decay2 = calculateDecay(hours2);

                    // Property: Decay at later time >= decay at earlier time
                    expect(decay2).toBeGreaterThanOrEqual(decay1);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2: Specific decay milestones SHALL be exact', () => {
        // Test exact boundaries
        const testCases = [
            { hours: 0, expected: 0 },
            { hours: 23.99, expected: 0 },
            { hours: 24, expected: 0 }, // Exactly 24 hours
            { hours: 24.01, expected: 15 },
            { hours: 48, expected: 15 }, // Exactly 48 hours
            { hours: 48.01, expected: 40 },
            { hours: 72, expected: 40 }, // Exactly 72 hours
            { hours: 72.01, expected: 40 }, // Just past 72
            { hours: 96, expected: 75 }, // 4 days: 40 + 35
            { hours: 120, expected: 110 }, // 5 days: 40 + 70
            { hours: 144, expected: 145 }, // 6 days: 40 + 105
            { hours: 168, expected: 180 }, // 7 days: 40 + 140
        ];

        testCases.forEach(({ hours, expected }) => {
            const decay = calculateDecay(hours);
            expect(decay).toBe(expected);
        });
    });

    it('Property 2: Grace period edge cases SHALL be handled correctly', () => {
        fc.assert(
            fc.property(
                // Generate hours in first day
                fc.float({ min: 0, max: 24, noNaN: true }),
                (hours) => {
                    const decay = calculateDecay(hours);

                    // Property: No decay during first 24 hours
                    expect(decay).toBe(0);
                }
            ),
            { numRuns: 50 }
        );
    });

    it('Property 2: Extreme time values SHALL not cause errors', () => {
        fc.assert(
            fc.property(
                // Test edge cases and extreme values
                fc.float({ min: 0, max: 8760, noNaN: true }), // Up to 1 year
                (hours) => {
                    const decay = calculateDecay(hours);

                    // Property: Function should not throw and return valid value
                    expect(decay).toBeGreaterThanOrEqual(0);
                    expect(decay).toBeLessThan(Infinity);
                    expect(Number.isNaN(decay)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });
});
