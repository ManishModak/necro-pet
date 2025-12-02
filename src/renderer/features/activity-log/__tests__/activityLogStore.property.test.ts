// **Feature: necro-pet-core-skeleton, Property 5: Event Appending to Activity Log**
// **Feature: necro-pet-core-skeleton, Property 7: Activity Log Size Invariant**
// Testing the séance chamber's ability to record and manage spirits...

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useActivityLogStore } from '../activityLogStore';

describe('Activity Log Store Property Tests', () => {
  beforeEach(() => {
    // Exorcising all spirits before each test
    useActivityLogStore.getState().clearEntries();
  });

  it('Property 5: For any valid FileEvent, the store SHALL contain a matching entry after addEntry', () => {
    // **Validates: Requirements 3.1**

    fc.assert(
      fc.property(
        // Generate arbitrary file events
        fc.record({
          type: fc.constantFrom('commit' as const, 'resurrection' as const),
          path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md|txt|css)$/),
          timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
        }),
        (event) => {
          const store = useActivityLogStore.getState();
          const initialLength = store.entries.length;

          // Add the event to the store
          store.addEntry(event);

          const updatedEntries = useActivityLogStore.getState().entries;

          // Property: The store should now contain an entry with matching properties
          const matchingEntry = updatedEntries.find(
            entry =>
              entry.type === event.type &&
              entry.path === event.path &&
              entry.timestamp === event.timestamp
          );

          expect(matchingEntry).toBeDefined();
          expect(matchingEntry?.type).toBe(event.type);
          expect(matchingEntry?.path).toBe(event.path);
          expect(matchingEntry?.timestamp).toBe(event.timestamp);

          // Property: The entry should have a unique ID
          expect(matchingEntry?.id).toBeDefined();
          expect(typeof matchingEntry?.id).toBe('string');
          expect(matchingEntry!.id.length).toBeGreaterThan(0);

          // Property: The store should have grown by one entry (unless at limit)
          if (initialLength < 50) {
            expect(updatedEntries.length).toBe(initialLength + 1);
          }

          // Clean up for next iteration
          store.clearEntries();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: For any sequence of events, the entries array length SHALL never exceed 50', () => {
    // **Validates: Requirements 3.3**

    fc.assert(
      fc.property(
        // Generate a sequence of file events (potentially more than 50)
        fc.array(
          fc.record({
            type: fc.constantFrom('commit' as const, 'resurrection' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 1, maxLength: 100 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          store.clearEntries();

          // Add all events to the store
          events.forEach(event => store.addEntry(event));

          const finalEntries = useActivityLogStore.getState().entries;

          // Property: The store should never exceed 50 entries
          expect(finalEntries.length).toBeLessThanOrEqual(50);

          // Property: If we added more than 50 events, we should have exactly 50
          if (events.length > 50) {
            expect(finalEntries.length).toBe(50);
          } else {
            expect(finalEntries.length).toBe(events.length);
          }

          // Clean up
          store.clearEntries();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: When limit is reached, oldest entries SHALL be removed first (FIFO)', () => {
    // **Validates: Requirements 3.3**

    fc.assert(
      fc.property(
        // Generate more than 50 events to trigger FIFO removal
        fc.array(
          fc.record({
            type: fc.constantFrom('commit' as const, 'resurrection' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 51, maxLength: 75 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          store.clearEntries();

          // Add all events to the store
          events.forEach(event => store.addEntry(event));

          const finalEntries = useActivityLogStore.getState().entries;

          // Property: The store should contain exactly 50 entries
          expect(finalEntries.length).toBe(50);

          // Property: The final entries should be the LAST 50 events we added
          const expectedEvents = events.slice(-50);

          for (let i = 0; i < 50; i++) {
            expect(finalEntries[i].type).toBe(expectedEvents[i].type);
            expect(finalEntries[i].path).toBe(expectedEvents[i].path);
            expect(finalEntries[i].timestamp).toBe(expectedEvents[i].timestamp);
          }

          // Clean up
          store.clearEntries();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5 (Edge Case): Each entry SHALL have a unique ID', () => {
    // **Validates: Requirements 3.1**

    fc.assert(
      fc.property(
        // Generate multiple identical events
        fc.record({
          type: fc.constantFrom('commit' as const, 'resurrection' as const),
          path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts)$/),
          timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
        }),
        fc.integer({ min: 2, max: 20 }),
        (event, count) => {
          const store = useActivityLogStore.getState();
          store.clearEntries();

          // Add the same event multiple times
          for (let i = 0; i < count; i++) {
            store.addEntry(event);
          }

          const entries = useActivityLogStore.getState().entries;

          // Property: All entries should have unique IDs even if the event data is identical
          const ids = entries.map(entry => entry.id);
          const uniqueIds = new Set(ids);

          expect(uniqueIds.size).toBe(ids.length);

          // Clean up
          store.clearEntries();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7 (Edge Case): clearEntries SHALL remove all entries', () => {
    // **Validates: Requirements 3.3**

    fc.assert(
      fc.property(
        // Generate any number of events
        fc.array(
          fc.record({
            type: fc.constantFrom('commit' as const, 'resurrection' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 1, maxLength: 60 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          store.clearEntries();

          // Add all events
          events.forEach(event => store.addEntry(event));

          // Verify we have entries
          expect(useActivityLogStore.getState().entries.length).toBeGreaterThan(0);

          // Clear all entries
          store.clearEntries();

          // Property: After clearing, the store should be empty
          expect(useActivityLogStore.getState().entries.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5 & 7: Adding entries at exactly the 50-entry boundary SHALL maintain FIFO', () => {
    // **Validates: Requirements 3.1, 3.3**

    fc.assert(
      fc.property(
        // Generate exactly 50 initial events
        fc.array(
          fc.record({
            type: fc.constantFrom('commit' as const, 'resurrection' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: 1500000000000 })
          }),
          { minLength: 50, maxLength: 50 }
        ),
        // Generate one more event to push over the limit
        fc.record({
          type: fc.constantFrom('commit' as const, 'resurrection' as const),
          path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
          timestamp: fc.integer({ min: 1500000000001, max: Date.now() })
        }),
        (initialEvents, newEvent) => {
          const store = useActivityLogStore.getState();
          store.clearEntries();

          // Add exactly 50 events
          initialEvents.forEach(event => store.addEntry(event));

          expect(useActivityLogStore.getState().entries.length).toBe(50);

          // Add one more event
          store.addEntry(newEvent);

          const finalEntries = useActivityLogStore.getState().entries;

          // Property: Should still have exactly 50 entries
          expect(finalEntries.length).toBe(50);

          // Property: The first entry should be the second event we originally added
          expect(finalEntries[0].type).toBe(initialEvents[1].type);
          expect(finalEntries[0].path).toBe(initialEvents[1].path);

          // Property: The last entry should be the new event
          expect(finalEntries[49].type).toBe(newEvent.type);
          expect(finalEntries[49].path).toBe(newEvent.path);
          expect(finalEntries[49].timestamp).toBe(newEvent.timestamp);

          // Clean up
          store.clearEntries();
        }
      ),
      { numRuns: 100 }
    );
  });
});
