# Implementation Plan

## Phase 1: Core Infrastructure

- [x] 1. Create Persistence Service

  - [x] 1.1 Create `src/main/persistence.ts` with SaveData interface

    - Define save file path (~/.necro-pet/save.json)
    - Implement loadSaveData() function
    - Implement saveSaveData() function
    - Handle directory creation if not exists
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 1.2 Write property test for save/load round trip
    - **Property 3: Save/Load Round Trip**
    - **Validates: Requirements 2.3, 2.4**

- [ ] 2. Create Git Watcher Service
  - [x] 2.1 Create `src/main/gitWatcher.ts` with polling mechanism

    - Implement git log parsing
    - Implement polling interval (30 seconds)
    - Detect new commits by comparing hashes
    - Handle non-git directories gracefully
    - _Requirements: 1.1, 1.4_
  
  - [ ] 2.2 Add IPC channel for commit events
    - Create 'commit:detected' channel
    - Emit CommitEvent with hash, message, timestamp
    - _Requirements: 1.5_

## Phase 2: Pet Store Updates

- [x] 3. Update Pet Store for Commit-Based Feeding

  - [x] 3.1 Add new state properties to petStore.ts

    - Add lastCommitDate, lastCommitHash, deathCount, isDead
    - _Requirements: 2.4_
  
  - [ ] 3.2 Implement feedFromCommit action
    - Increase health by 20, XP by 15
    - Update lastCommitDate and lastCommitHash
    - Handle revival if pet is dead
    - _Requirements: 1.2, 1.3, 1.4, 4.1, 4.2_
  
  - [ ] 3.3 Write property test for health bounds after commit
    - **Property 1: Health Bounds After Commit**
    - **Validates: Requirements 1.2**

- [ ] 4. Implement Time-Based Decay
  - [ ] 4.1 Create calculateDecay pure function
    - Implement decay formula based on hours since commit
    - 0-24h: 0, 24-48h: 15, 48-72h: 40, 72h+: 40 + 35/day
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 4.2 Implement applyTimeDecay action in store
    - Calculate hours since lastCommitDate
    - Apply decay to health
    - Transition to GHOST if health reaches 0
    - _Requirements: 3.1, 3.6_
  
  - [ ]* 4.3 Write property test for decay calculation
    - **Property 2: Decay Calculation Consistency**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

## Phase 3: Revival Mechanics

- [ ] 5. Implement Pet Revival
  - [ ] 5.1 Create calculateRevivalHealth pure function
    - Check for "resurrect" in commit message

    - Return 75 for resurrect, 50 for normal
    - _Requirements: 4.1, 4.2_
  
  - [ ] 5.2 Implement revivePet action in store
    - Set health to revival amount
    - Preserve XP and recalculate stage
    - Increment deathCount
    - Set isDead to false
    - _Requirements: 4.3, 4.4_
  
  - [ ]* 5.3 Write property tests for revival
    - **Property 4: Revival Health Bounds**
    - **Property 5: Ghost State Consistency**
    - **Property 6: XP Preservation on Revival**
    - **Validates: Requirements 4.1, 4.2, 4.3**

## Phase 4: Integration

- [ ] 6. Wire Up Main Process
  - [x] 6.1 Update src/main/index.ts

    - Initialize persistence service on app start
    - Load save data and send to renderer
    - Initialize git watcher
    - _Requirements: 2.1, 2.2, 1.1_
  
  - [ ] 6.2 Update src/preload/index.ts
    - Add IPC handlers for commit events
    - Add IPC handlers for save/load
    - _Requirements: 1.5, 2.3_

- [ ] 7. Wire Up Renderer
  - [ ] 7.1 Update App.tsx to handle commit events
    - Listen for 'commit:detected' IPC events
    - Call feedFromCommit on pet store
    - Add commit entries to Activity Log

    - _Requirements: 1.5, 5.1_
  
  - [ ] 7.2 Apply decay on app startup
    - Load save data on mount
    - Calculate and apply time decay
    - _Requirements: 3.1_

## Phase 5: UI Updates

- [ ] 8. Update Activity Log
  - [ ] 8.1 Add commit entry type to ActivityLog.tsx
    - Display commit icon and message
    - Show truncated commit message (50 chars)
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 8.2 Add resurrection entry type
    - Display special resurrection message

    - _Requirements: 5.4_

- [ ] 9. Update Debug Panel
  - [ ] 9.1 Add commit simulation controls

    - "Simulate Commit" button
    - "Simulate Day Pass" button
    - Display time since last commit
    - Display save file path
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

## Phase 6: Polish

- [ ] 10. Update File Watcher Behavior
  - [ ] 10.1 Modify file save handling
    - Keep Activity Log entries for file saves
    - Remove HP/XP gain from file saves
    - Add subtle visual feedback only
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 11. Add Revival Animation
  - [ ] 11.1 Create resurrection visual effect
    - Flash effect or animation when pet revives
    - Display "RESURRECTED" message
    - _Requirements: 4.5_

- [ ] 12. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: Hook Update (Optional)

- [ ] 13. Update Crypt Keeper Hook
  - [ ] 13.1 Modify hook to trigger on git commits
    - Change trigger from fileEdited to manual/scheduled
    - Parse git log for commit info
    - _Requirements: N/A (enhancement)_
