// Summoning the spirits of file events into the séance chamber...
import { create } from 'zustand';

export interface ActivityLogEntry {
  id: string;
  type: 'commit' | 'resurrection' | 'feed' | 'resurrect';
  path: string;
  timestamp: number;
}

export interface ActivityLogState {
  entries: ActivityLogEntry[];
  addEntry: (event: Omit<ActivityLogEntry, 'id'>) => void;
  addHistoricalEntries: (events: Array<Omit<ActivityLogEntry, 'id'>>) => void;
  clearEntries: () => void;
}

// Generating a unique ID for each haunted entry
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// The crypt keeper's ledger of all file disturbances
export const useActivityLogStore = create<ActivityLogState>((set) => ({
  entries: [],

  // Inscribing a new event into the book of the dead
  addEntry: (event) => set((state) => {
    const newEntry: ActivityLogEntry = {
      ...event,
      id: generateId(),
    };

    const updatedEntries = [...state.entries, newEntry];

    // Burying the oldest spirits when the crypt overflows (FIFO)
    if (updatedEntries.length > 50) {
      return { entries: updatedEntries.slice(-50) };
    }

    return { entries: updatedEntries };
  }),

  // Loading historical commits from git history (prepended, marked with HISTORY: prefix)
  addHistoricalEntries: (events) => set((state) => {
    const historicalEntries: ActivityLogEntry[] = events.map(event => ({
      ...event,
      id: generateId(),
      path: event.path.startsWith('HISTORY:') ? event.path : `HISTORY: ${event.path}`,
    }));

    // Prepend historical entries (they're older, so they go to the beginning)
    return { entries: [...historicalEntries, ...state.entries] };
  }),

  // Exorcising all spirits from the log
  clearEntries: () => set({ entries: [] }),
}));
