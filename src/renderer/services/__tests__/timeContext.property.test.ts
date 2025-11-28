// **Feature: world-context-weather-time, Property 2: Time Context Calculation**
// Divining the boundary between day and night through property-based sorcery...

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isNightTime } from '../timeContext';

describe('Time Context Property Tests', () => {
  it('Property 2: For any hour (0-23), isNightTime SHALL return true if and only if hour < 6 OR hour >= 18', () => {
    // **Validates: Requirements 2.2, 2.3**
    
    fc.assert(
      fc.property(
        // Generate valid hour values (0-23)
        fc.integer({ min: 0, max: 23 }),
        (hour) => {
          const result = isNightTime(hour);
          
          // Property: Night time is defined as hour < 6 OR hour >= 18
          const expectedIsNight = hour < 6 || hour >= 18;
          
          expect(result).toBe(expectedIsNight);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Day hours (6-17) SHALL always return false', () => {
    // **Validates: Requirements 2.2**
    
    fc.assert(
      fc.property(
        // Generate day hours (6 AM to 5:59 PM)
        fc.integer({ min: 6, max: 17 }),
        (dayHour) => {
          const result = isNightTime(dayHour);
          
          // Property: All day hours should return false
          expect(result).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Night hours (18-23 and 0-5) SHALL always return true', () => {
    // **Validates: Requirements 2.3**
    
    fc.assert(
      fc.property(
        // Generate night hours: either evening (18-23) or early morning (0-5)
        fc.oneof(
          fc.integer({ min: 18, max: 23 }),
          fc.integer({ min: 0, max: 5 })
        ),
        (nightHour) => {
          const result = isNightTime(nightHour);
          
          // Property: All night hours should return true
          expect(result).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Function SHALL be pure (same input produces same output)', () => {
    // **Validates: Requirements 2.2, 2.3**
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        (hour) => {
          const result1 = isNightTime(hour);
          const result2 = isNightTime(hour);
          
          // Property: Pure function must return same result for same input
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Boundary conditions at 6 AM and 6 PM SHALL be correct', () => {
    // **Validates: Requirements 2.2, 2.3**
    
    // 6 AM (hour 6) is the start of day - should be false
    expect(isNightTime(6)).toBe(false);
    
    // 5:59 AM (hour 5) is still night - should be true
    expect(isNightTime(5)).toBe(true);
    
    // 6 PM (hour 18) is the start of night - should be true
    expect(isNightTime(18)).toBe(true);
    
    // 5:59 PM (hour 17) is still day - should be false
    expect(isNightTime(17)).toBe(false);
  });
});
