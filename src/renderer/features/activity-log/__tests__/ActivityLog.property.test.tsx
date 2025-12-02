// **Feature: necro-pet-core-skeleton, Property 6: Activity Log Entry Display Format**
// Testing the séance chamber's ability to manifest spirits correctly...

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, act } from '@testing-library/react';
import { ActivityLog } from '../ActivityLog';
import { useActivityLogStore } from '../activityLogStore';

describe('Activity Log Display Format Property Tests', () => {
  beforeEach(() => {
    // Exorcising all spirits before each test
    useActivityLogStore.getState().clearEntries();
  });

  it('Property 6: For any ActivityLogEntry, the rendered output SHALL contain event type, file path, and timestamp', { timeout: 60000 }, () => {
    // **Validates: Requirements 3.2**
    
    fc.assert(
      fc.property(
        // Generate arbitrary activity log entries
        fc.array(
          fc.record({
            type: fc.constantFrom('file:changed' as const, 'file:added' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md|txt|css)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          
          act(() => {
            store.clearEntries();
            // Add all events to the store
            events.forEach(event => store.addEntry(event));
          });
          
          // Render the component
          const { container } = render(<ActivityLog />);
          
          // Get all entries from the store to verify rendering
          const entries = useActivityLogStore.getState().entries;
          
          // Property: For each entry, the rendered output must contain:
          // 1. Event type (as a label like "DISTURBED" or "SUMMONED")
          // 2. File path
          // 3. Formatted timestamp
          
          entries.forEach((entry) => {
            // Check that the file path is rendered
            expect(container.textContent).toContain(entry.path);
            
            // Check that the event type label is rendered
            const expectedLabel = entry.type === 'file:changed' ? 'DISTURBED' : 'SUMMONED';
            expect(container.textContent).toContain(expectedLabel);
            
            // Check that a timestamp is rendered (in HH:MM:SS format)
            const date = new Date(entry.timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}:${seconds}`;
            
            expect(container.textContent).toContain(formattedTime);
          });
          
          // Clean up
          act(() => {
            store.clearEntries();
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 6 (Edge Case): Empty log SHALL display appropriate message', () => {
    // **Validates: Requirements 3.2**
    
    const store = useActivityLogStore.getState();
    
    act(() => {
      store.clearEntries();
    });
    
    // Render with no entries
    const { container } = render(<ActivityLog />);
    
    // Property: When there are no entries, should display a message
    expect(container.textContent).toContain('The crypt is silent');
  });

  it('Property 6 (Edge Case): Each entry SHALL have a unique visual representation', { timeout: 30000 }, () => {
    // **Validates: Requirements 3.2**
    
    fc.assert(
      fc.property(
        // Generate multiple entries with different types
        fc.array(
          fc.record({
            type: fc.constantFrom('file:changed' as const, 'file:added' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          
          act(() => {
            store.clearEntries();
            // Add all events
            events.forEach(event => store.addEntry(event));
          });
          
          // Render the component
          const { container } = render(<ActivityLog />);
          
          // Get all entry elements
          const entries = useActivityLogStore.getState().entries;
          
          // Property: Each entry should be visually distinguishable
          // We verify this by checking that each entry's path appears in the rendered output
          entries.forEach((entry) => {
            expect(container.textContent).toContain(entry.path);
          });
          
          // Property: Different event types should have different labels
          const changedEntries = entries.filter(e => e.type === 'file:changed');
          const addedEntries = entries.filter(e => e.type === 'file:added');
          
          if (changedEntries.length > 0) {
            expect(container.textContent).toContain('DISTURBED');
          }
          
          if (addedEntries.length > 0) {
            expect(container.textContent).toContain('SUMMONED');
          }
          
          // Clean up
          act(() => {
            store.clearEntries();
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 6: Timestamp format SHALL be consistent (HH:MM:SS)', { timeout: 30000 }, () => {
    // **Validates: Requirements 3.2**
    
    fc.assert(
      fc.property(
        // Generate entries with various timestamps
        fc.array(
          fc.record({
            type: fc.constantFrom('file:changed' as const, 'file:added' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          
          act(() => {
            store.clearEntries();
            // Add all events
            events.forEach(event => store.addEntry(event));
          });
          
          // Render the component
          const { container } = render(<ActivityLog />);
          
          const entries = useActivityLogStore.getState().entries;
          
          // Property: All timestamps should be in HH:MM:SS format
          entries.forEach((entry) => {
            const date = new Date(entry.timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}:${seconds}`;
            
            // The formatted timestamp should appear in the rendered output
            expect(container.textContent).toContain(formattedTime);
            
            // Verify the format is correct (2 digits : 2 digits : 2 digits)
            expect(formattedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
          });
          
          // Clean up
          act(() => {
            store.clearEntries();
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 6: Entry count SHALL be displayed', { timeout: 30000 }, () => {
    // **Validates: Requirements 3.2**
    
    fc.assert(
      fc.property(
        // Generate varying numbers of entries
        fc.array(
          fc.record({
            type: fc.constantFrom('file:changed' as const, 'file:added' as const),
            path: fc.stringMatching(/^[a-zA-Z0-9_/-]+\.(js|ts|json|md)$/),
            timestamp: fc.integer({ min: 1000000000000, max: Date.now() })
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (events) => {
          const store = useActivityLogStore.getState();
          
          act(() => {
            store.clearEntries();
            // Add all events
            events.forEach(event => store.addEntry(event));
          });
          
          // Render the component
          const { container } = render(<ActivityLog />);
          
          const entries = useActivityLogStore.getState().entries;
          
          // Property: The component should display the count of entries
          expect(container.textContent).toContain(`${entries.length} souls recorded`);
          
          // Clean up
          act(() => {
            store.clearEntries();
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
