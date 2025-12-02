# Design Document

## Overview

This design transforms Necro-Pet from file-save-based feeding to git-commit-based feeding. The system will poll git repositories for new commits, persist pet state globally, apply time-based health decay, and support pet revival through commit actions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Process (Electron)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ Git Watcher │  │ File Watcher│  │ Persistence      │    │
│  │ (polling)   │  │ (chokidar)  │  │ Service          │    │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘    │
│         │                │                   │              │
│         └────────────────┼───────────────────┘              │
│                          │                                  │
│                    ┌─────▼─────┐                           │
│                    │    IPC    │                           │
│                    └─────┬─────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    Renderer Process                          │
├──────────────────────────┼──────────────────────────────────┤
│                    ┌─────▼─────┐                           │
│                    │ Pet Store │                           │
│                    │ (Zustand) │                           │
│                    └─────┬─────┘                           │
│         ┌────────────────┼────────────────┐                │
│   ┌─────▼─────┐   ┌─────▼─────┐   ┌──────▼──────┐        │
│   │PetDisplay │   │ActivityLog│   │DebugPanel   │        │
│   └───────────┘   └───────────┘   └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Git Watcher Service (Main Process)

**File:** `src/main/gitWatcher.ts`

```typescript
interface GitCommit {
  hash: string;
  message: string;
  timestamp: number;
  author: string;
}

interface GitWatcherConfig {
  pollInterval: number; // milliseconds, default 30000 (30 seconds)
  watchPath: string;    // directory to watch
}

// Functions
initGitWatcher(config: GitWatcherConfig): void
stopGitWatcher(): void
getLastCommit(): GitCommit | null
```

**Implementation approach:**
- Poll `git log -1 --format="%H|%s|%at|%an"` every 30 seconds
- Compare commit hash with last known hash
- Emit IPC event when new commit detected

### 2. Persistence Service (Main Process)

**File:** `src/main/persistence.ts`

```typescript
interface SaveData {
  health: number;
  xp: number;
  stage: string;
  mood: string;
  weather: string;
  isNight: boolean;
  lastCommitDate: string;    // ISO timestamp
  lastCommitHash: string;
  deathCount: number;
  createdAt: string;
  updatedAt: string;
}

// Functions
loadSaveData(): SaveData | null
saveSaveData(data: SaveData): void
getSavePath(): string  // Returns ~/.necro-pet/save.json
```

### 3. Updated IPC Interface

**File:** `src/main/ipc.ts` (updated)

```typescript
interface CommitEvent {
  type: 'commit';
  hash: string;
  message: string;
  timestamp: number;
}

// New IPC channels
'commit:detected' -> CommitEvent
'save:load' -> SaveData
'save:request' -> void (renderer requests save)
```

### 4. Updated Pet Store (Renderer)

**File:** `src/renderer/features/pet/petStore.ts` (updated)

```typescript
interface PetState {
  // Existing
  health: number;
  xp: number;
  stage: Stage;
  mood: Mood;
  weather: WeatherState;
  isNight: boolean;
  
  // New
  lastCommitDate: string | null;
  lastCommitHash: string | null;
  deathCount: number;
  isDead: boolean;
}

// New actions
feedFromCommit(commit: CommitEvent): void
applyTimeDecay(hoursSinceCommit: number): void
revivePet(healthPercent: number): void
loadFromSave(data: SaveData): void
```

### 5. Updated Activity Log Entry Types

```typescript
type ActivityType = 
  | 'file:changed' 
  | 'file:added' 
  | 'commit'        // New
  | 'resurrection'; // New
```

## Data Models

### Save File Structure

**Location:** `~/.necro-pet/save.json`

```json
{
  "version": 1,
  "health": 75,
  "xp": 120,
  "stage": "BEAST",
  "mood": "HAPPY",
  "weather": "CLEAR",
  "isNight": false,
  "lastCommitDate": "2025-12-02T10:30:00.000Z",
  "lastCommitHash": "abc123def456",
  "deathCount": 0,
  "createdAt": "2025-11-28T15:00:00.000Z",
  "updatedAt": "2025-12-02T10:30:00.000Z"
}
```

### Health Decay Formula

```typescript
function calculateDecay(hoursSinceCommit: number): number {
  if (hoursSinceCommit <= 24) return 0;           // Grace period
  if (hoursSinceCommit <= 48) return 15;          // Day 2
  if (hoursSinceCommit <= 72) return 40;          // Day 3 (15 + 25)
  
  // Day 4+: 40 + 35 per additional day
  const additionalDays = Math.floor((hoursSinceCommit - 72) / 24);
  return 40 + (additionalDays * 35);
}
```

### Revival Logic

```typescript
function calculateRevivalHealth(commitMessage: string): number {
  const lowerMessage = commitMessage.toLowerCase();
  
  if (lowerMessage.includes('resurrect')) {
    return 75; // Special resurrection commit
  }
  
  return 50; // Normal revival
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Health Bounds After Commit
*For any* commit event, the resulting health after feeding SHALL be within [0, 100]
**Validates: Requirements 1.2**

### Property 2: Decay Calculation Consistency
*For any* number of hours since last commit, the decay calculation SHALL be deterministic and monotonically increasing
**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

### Property 3: Save/Load Round Trip
*For any* valid pet state, saving then loading SHALL produce an equivalent state
**Validates: Requirements 2.3, 2.4**

### Property 4: Revival Health Bounds
*For any* revival event, the resulting health SHALL be either 50 or 75 based on commit message
**Validates: Requirements 4.1, 4.2**

### Property 5: Ghost State Consistency
*For any* pet with health = 0, the stage SHALL be GHOST and isDead SHALL be true
**Validates: Requirements 3.6, 4.3**

### Property 6: XP Preservation on Revival
*For any* revival event, the pet's XP SHALL remain unchanged from before death
**Validates: Requirements 4.3**

## Error Handling

1. **Git not installed:** Log warning, disable commit watching, fall back to file-save mode
2. **Not a git repository:** Log info, disable commit watching for that directory
3. **Save file corrupted:** Create new pet, log warning, backup corrupted file
4. **Save file permissions:** Log error, continue without persistence
5. **Git command timeout:** Skip poll cycle, retry next interval

## Testing Strategy

### Unit Tests
- Decay calculation function
- Revival health calculation
- Save/Load serialization

### Property-Based Tests
- Health bounds invariant
- Decay monotonicity
- Round-trip persistence
- Revival state consistency

### Integration Tests
- Git watcher detects commits
- IPC communication flow
- Full save/load cycle
