/**
 * Validation Tests for Pet Store
 * Tests runtime validation and type safety improvements
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { usePetStore } from '../petStore';

describe('Pet Store Validation Tests', () => {
    beforeEach(() => {
        // Reset the pet to its primordial state before each test
        usePetStore.getState().reset();
    });

    describe('Runtime Validation in loadFromSave', () => {
        it('should handle invalid stage values gracefully', () => {
            const invalidData = {
                health: 50,
                xp: 100,
                stage: 'INVALID_STAGE',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(invalidData);
            const state = usePetStore.getState();

            // Should default to EGG for invalid stage
            expect(state.stage).toBe('EGG');
        });

        it('should handle invalid mood values gracefully', () => {
            const invalidData = {
                health: 50,
                xp: 100,
                stage: 'EGG',
                mood: 'INVALID_MOOD',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(invalidData);
            const state = usePetStore.getState();

            // Should default to HAPPY for invalid mood
            expect(state.mood).toBe('HAPPY');
        });

        it('should handle invalid weather values gracefully', () => {
            const invalidData = {
                health: 50,
                xp: 100,
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'INVALID_WEATHER',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(invalidData);
            const state = usePetStore.getState();

            // Should default to CLEAR for invalid weather
            expect(state.weather).toBe('CLEAR');
        });
    });

    describe('Data Sanitization', () => {
        it('should sanitize invalid health values', () => {
            const invalidData = {
                health: -50, // Invalid negative health
                xp: 100,
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(invalidData);
            const state = usePetStore.getState();

            // Should clamp to minimum 0
            expect(state.health).toBe(0);
        });

        it('should sanitize invalid XP values', () => {
            const invalidData = {
                health: 50,
                xp: -100, // Invalid negative XP
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(invalidData);
            const state = usePetStore.getState();

            // Should clamp to minimum 0
            expect(state.xp).toBe(0);
        });

        it('should handle missing required fields with defaults', () => {
            const incompleteData = {
                // Missing health, xp, etc. - intentionally incomplete
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            } as any; // Cast to any to test validation

            usePetStore.getState().loadFromSave(incompleteData);
            const state = usePetStore.getState();

            // Should use default values for missing fields
            expect(state.health).toBe(100); // Default health
            expect(state.xp).toBe(0); // Default XP
        });
    });

    describe('Edge Cases', () => {
        it('should handle NaN values in numeric fields', () => {
            const nanData = {
                health: NaN,
                xp: NaN,
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path'
            };

            usePetStore.getState().loadFromSave(nanData);
            const state = usePetStore.getState();

            // Should handle NaN gracefully
            expect(state.health).toBe(100); // Default for NaN
            expect(state.xp).toBe(0); // Default for NaN
        });

        it('should handle extreme evolution level values', () => {
            const extremeData = {
                health: 50,
                xp: 100,
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path',
                evolutionLevel: 999 // Extreme value
            };

            usePetStore.getState().loadFromSave(extremeData);
            const state = usePetStore.getState();

            // Should clamp evolution level to maximum 2
            expect(state.evolutionLevel).toBe(2);
        });
    });
});