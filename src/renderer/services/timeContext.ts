// The temporal veil between day and night...
// When the sun descends below the horizon, the necromantic energies grow stronger

/**
 * Determines if a given hour falls within the realm of night
 * Night reigns from 6 PM (18:00) until 6 AM (6:00)
 * 
 * @param hour - The hour of day (0-23)
 * @returns true if the hour is within night time, false otherwise
 */
export const isNightTime = (hour: number): boolean => {
  // The witching hours: before dawn (< 6) or after dusk (>= 18)
  return hour < 6 || hour >= 18;
};

/**
 * Divines the current time context from the mortal realm's system clock
 * 
 * @returns true if it is currently night time, false if day
 */
export const getCurrentTimeContext = (): boolean => {
  // Commune with the system clock to determine the current hour
  const now = new Date();
  const currentHour = now.getHours();
  
  // Consult the ancient wisdom of isNightTime
  return isNightTime(currentHour);
};
