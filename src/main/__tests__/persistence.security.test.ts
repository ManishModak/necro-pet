/**
 * Security Tests for Persistence Module
 * Tests file size validation and data sanitization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadSaveData, saveSaveData, MAX_SAVE_FILE_SIZE, MAX_ACTIVITY_LOG_ENTRIES } from '../persistence';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

describe('Persistence Security Tests', () => {
    const testSaveDir = path.join(app.getPath('home'), '.necro-pet-test');
    const testSavePath = path.join(testSaveDir, 'save.json');

    beforeEach(() => {
        // Clean up test files
        if (fs.existsSync(testSavePath)) {
            fs.unlinkSync(testSavePath);
        }
        if (fs.existsSync(testSaveDir)) {
            fs.rmdirSync(testSaveDir);
        }
    });

    describe('File Size Validation', () => {
        it('should reject oversized save files', () => {
            // Create an oversized file
            const largeData = 'x'.repeat(MAX_SAVE_FILE_SIZE + 100);
            fs.mkdirSync(testSaveDir, { recursive: true });
            fs.writeFileSync(testSavePath, largeData);

            const result = loadSaveData();
            expect(result).toBeNull();
        });

        it('should accept valid-sized save files', () => {
            const validData = JSON.stringify({
                version: 1,
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
                activityLog: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            fs.mkdirSync(testSaveDir, { recursive: true });
            fs.writeFileSync(testSavePath, validData);

            const result = loadSaveData();
            expect(result).not.toBeNull();
            expect(result?.health).toBe(50);
        });
    });

    describe('Activity Log Size Validation', () => {
        it('should truncate oversized activity logs', () => {
            const largeActivityLog = Array(MAX_ACTIVITY_LOG_ENTRIES + 100).fill({
                id: 'test',
                type: 'feed',
                path: 'test',
                timestamp: Date.now()
            });

            const saveData = {
                version: 1,
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
                activityLog: largeActivityLog,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            fs.mkdirSync(testSaveDir, { recursive: true });
            fs.writeFileSync(testSavePath, JSON.stringify(saveData));

            const result = loadSaveData();
            expect(result?.activityLog.length).toBeLessThanOrEqual(MAX_ACTIVITY_LOG_ENTRIES);
        });
    });

    describe('Data Validation', () => {
        it('should handle corrupted save files gracefully', () => {
            const corruptedData = 'this is not valid JSON {{}{';
            fs.mkdirSync(testSaveDir, { recursive: true });
            fs.writeFileSync(testSavePath, corruptedData);

            const result = loadSaveData();
            expect(result).toBeNull();
        });

        it('should validate required fields in save data', () => {
            const invalidData = JSON.stringify({
                version: 1,
                // Missing required fields like health, xp
                stage: 'EGG',
                mood: 'HAPPY',
                weather: 'CLEAR',
                isNight: false,
                lastCommitDate: new Date().toISOString(),
                lastCommitHash: 'abc123',
                deathCount: 0,
                watchedProjectPath: '/test/path',
                activityLog: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            fs.mkdirSync(testSaveDir, { recursive: true });
            fs.writeFileSync(testSavePath, invalidData);

            const result = loadSaveData();
            expect(result).toBeNull();
        });
    });
});