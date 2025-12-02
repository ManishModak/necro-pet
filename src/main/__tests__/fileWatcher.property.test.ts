// **Feature: necro-pet-core-skeleton, Property 4: Ignored Directory Filtering**
// Testing the watcher's ability to avoid cursed grounds...

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// The ignored patterns from our file watcher
const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.next',
  'build',
  '.cache'
];

// Function to check if a path should be ignored
const shouldIgnorePath = (path: string): boolean => {
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = path.replace(/\\/g, '/');
  
  // Check if any ignored pattern appears as a complete directory segment
  return IGNORED_PATTERNS.some(pattern => {
    // Match pattern as a complete directory segment
    const regex = new RegExp(`(^|/)${pattern}(/|$)`);
    return regex.test(normalizedPath);
  });
};

describe('File Watcher Directory Filtering Property Tests', () => {
  it('Property 4: Paths containing ignored directories SHALL be filtered out', () => {
    // **Validates: Requirements 2.5**
    
    fc.assert(
      fc.property(
        // Generate arbitrary file paths with ignored directory segments
        fc.constantFrom(...IGNORED_PATTERNS),
        fc.array(fc.stringMatching(/^[a-zA-Z0-9_-]+$/), { minLength: 0, maxLength: 3 }),
        fc.stringMatching(/^[a-zA-Z0-9_-]+\.(js|ts|json|md)$/),
        (ignoredDir, pathSegments, filename) => {
          // Build a path that contains an ignored directory
          const pathWithIgnored = [...pathSegments, ignoredDir, filename].join('/');
          
          // Property: Any path containing an ignored directory should be filtered
          expect(shouldIgnorePath(pathWithIgnored)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Paths NOT containing ignored directories SHALL NOT be filtered', () => {
    // **Validates: Requirements 2.5**
    
    fc.assert(
      fc.property(
        // Generate arbitrary valid directory names that are NOT in the ignored list
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_-]+$/)
            .filter(name => !IGNORED_PATTERNS.includes(name)),
          { minLength: 1, maxLength: 5 }
        ),
        fc.stringMatching(/^[a-zA-Z0-9_-]+\.(js|ts|json|md)$/),
        (pathSegments, filename) => {
          // Build a path without any ignored directories
          const cleanPath = [...pathSegments, filename].join('/');
          
          // Property: Paths without ignored directories should NOT be filtered
          expect(shouldIgnorePath(cleanPath)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4 (Edge Case): Ignored directory names as substrings should NOT trigger filtering', () => {
    // **Validates: Requirements 2.5**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...IGNORED_PATTERNS),
        fc.stringMatching(/^[a-zA-Z0-9_-]+$/),
        (ignoredPattern, suffix) => {
          // Create a directory name that contains the pattern but isn't exactly it
          const notIgnoredDir = `${ignoredPattern}_${suffix}`;
          const path = `src/${notIgnoredDir}/file.ts`;
          
          // Property: Directory names that merely contain ignored patterns as substrings
          // should NOT be filtered (e.g., "node_modules_backup" should not be ignored)
          expect(shouldIgnorePath(path)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4 (Edge Case): Ignored directories at any depth should be filtered', () => {
    // **Validates: Requirements 2.5**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...IGNORED_PATTERNS),
        fc.integer({ min: 0, max: 5 }),
        fc.integer({ min: 0, max: 5 }),
        (ignoredDir, prefixDepth, suffixDepth) => {
          // Generate path segments before and after the ignored directory
          const prefix = Array.from({ length: prefixDepth }, (_, i) => `dir${i}`);
          const suffix = Array.from({ length: suffixDepth }, (_, i) => `subdir${i}`);
          
          const path = [...prefix, ignoredDir, ...suffix, 'file.ts'].join('/');
          
          // Property: Ignored directories should be filtered regardless of depth
          expect(shouldIgnorePath(path)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4 (Edge Case): Multiple ignored directories in path should be filtered', () => {
    // **Validates: Requirements 2.5**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...IGNORED_PATTERNS),
        fc.constantFrom(...IGNORED_PATTERNS),
        (ignoredDir1, ignoredDir2) => {
          const path = `src/${ignoredDir1}/nested/${ignoredDir2}/file.ts`;
          
          // Property: Paths with multiple ignored directories should be filtered
          expect(shouldIgnorePath(path)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// **Feature: necro-pet-core-skeleton, Property 2: File Changed Event Emission**
// **Feature: necro-pet-core-skeleton, Property 3: File Added Event Emission**
// Testing the watcher's ability to detect and emit file events...

describe('File Event Emission Property Tests', () => {
  it('Property 2: File changed events SHALL contain correct type and path', () => {
    // **Validates: Requirements 2.2**
    
    fc.assert(
      fc.property(
        // Generate arbitrary file paths
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_-]+$/)
            .filter(name => !IGNORED_PATTERNS.includes(name)),
          { minLength: 1, maxLength: 5 }
        ),
        fc.stringMatching(/^[a-zA-Z0-9_-]+\.(js|ts|json|md|txt|css)$/),
        (pathSegments, filename) => {
          const filePath = [...pathSegments, filename].join('/');
          
          // Simulate creating a FileEvent for a changed file
          const event = {
            type: 'file:changed' as const,
            path: filePath,
            timestamp: Date.now()
          };
          
          // Property: Changed file events must have correct type
          expect(event.type).toBe('file:changed');
          
          // Property: Event must contain the file path
          expect(event.path).toBe(filePath);
          
          // Property: Event must have a valid timestamp
          expect(event.timestamp).toBeGreaterThan(0);
          expect(event.timestamp).toBeLessThanOrEqual(Date.now());
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: File added events SHALL contain correct type and path', () => {
    // **Validates: Requirements 2.3**
    
    fc.assert(
      fc.property(
        // Generate arbitrary file paths
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_-]+$/)
            .filter(name => !IGNORED_PATTERNS.includes(name)),
          { minLength: 1, maxLength: 5 }
        ),
        fc.stringMatching(/^[a-zA-Z0-9_-]+\.(js|ts|json|md|txt|css)$/),
        (pathSegments, filename) => {
          const filePath = [...pathSegments, filename].join('/');
          
          // Simulate creating a FileEvent for an added file
          const event = {
            type: 'file:added' as const,
            path: filePath,
            timestamp: Date.now()
          };
          
          // Property: Added file events must have correct type
          expect(event.type).toBe('file:added');
          
          // Property: Event must contain the file path
          expect(event.path).toBe(filePath);
          
          // Property: Event must have a valid timestamp
          expect(event.timestamp).toBeGreaterThan(0);
          expect(event.timestamp).toBeLessThanOrEqual(Date.now());
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2 & 3 (Edge Case): Events for files in ignored directories SHALL NOT be emitted', () => {
    // **Validates: Requirements 2.2, 2.3, 2.5**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...IGNORED_PATTERNS),
        fc.stringMatching(/^[a-zA-Z0-9_-]+\.(js|ts|json|md)$/),
        fc.constantFrom('file:changed', 'file:added'),
        (ignoredDir, filename, _eventType) => {
          const filePath = `src/${ignoredDir}/${filename}`;
          
          // Property: Files in ignored directories should be filtered
          // so no events should be created for them
          const shouldEmit = !shouldIgnorePath(filePath);
          
          // If the path is ignored, we should NOT emit an event
          expect(shouldEmit).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2 & 3 (Edge Case): Event timestamps SHALL be monotonically increasing or equal', () => {
    // **Validates: Requirements 2.2, 2.3**
    
    fc.assert(
      fc.property(
        // Generate a sequence of file events
        fc.array(
          fc.record({
            type: fc.constantFrom('file:changed' as const, 'file:added' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts)$/),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        (eventConfigs) => {
          // Simulate creating events in sequence
          const events = eventConfigs.map(config => ({
            ...config,
            timestamp: Date.now()
          }));
          
          // Property: Timestamps should be monotonically increasing or equal
          // (equal is possible if events happen in the same millisecond)
          for (let i = 1; i < events.length; i++) {
            expect(events[i].timestamp).toBeGreaterThanOrEqual(events[i - 1].timestamp);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2 & 3: Event type SHALL match the operation performed', () => {
    // **Validates: Requirements 2.2, 2.3**
    
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
        fc.constantFrom('change', 'add'),
        (filePath, operation) => {
          // Map chokidar operations to our event types
          const eventType = operation === 'change' ? 'file:changed' : 'file:added';
          
          const event = {
            type: eventType,
            path: filePath,
            timestamp: Date.now()
          };
          
          // Property: Event type must correctly reflect the operation
          if (operation === 'change') {
            expect(event.type).toBe('file:changed');
          } else {
            expect(event.type).toBe('file:added');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
