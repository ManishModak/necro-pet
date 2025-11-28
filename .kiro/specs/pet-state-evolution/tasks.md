# Implementation Plan

- [x] 1. Create Pet Store with core state management

  - [x] 1.1 Create petStore.ts with Zustand store

    - Define Stage and Mood const objects with TypeScript types
    - Implement PetState interface (health, xp, stage, mood)
    - Implement pure functions: clampHealth, calculateStage, calculateMood
    - Create usePetStore with initial state (health: 100, xp: 0, stage: EGG, mood: HAPPY)
    - Implement actions: decreaseHealth, increaseHealth, increaseXP, reset
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3_
  - [x] 1.2 Write property test for health bounds


    - **Property 1: Health Bounds Invariant**
    - **Validates: Requirements 1.2, 3.3**
  - [x] 1.3 Write property test for XP non-negativity


    - **Property 2: XP Non-Negativity Invariant**
    - **Validates: Requirements 1.3**
  - [x] 1.4 Write property test for stage derivation


    - **Property 3: Stage Derivation from XP**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [x] 1.5 Write property test for death override


    - **Property 4: Death Overrides Stage**
    - **Validates: Requirements 4.4, 4.5**
  - [x] 1.6 Write property test for mood derivation


    - **Property 5: Mood Derivation from Health**
    - **Validates: Requirements 6.1, 6.2, 6.3**
-

- [x] 2. Checkpoint - Ensure store tests pass



  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement Game Loop hook



  - [x] 3.1 Create useGameLoop.ts hook


    - Implement decay timer using setInterval (60 second default)
    - Subscribe to 'file:changed' IPC events via window.electronAPI
    - Call increaseHealth(5) and increaseXP(1) on file events
    - Call decreaseHealth(1) on each decay interval
    - Clean up timer and listeners on unmount
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_
  - [x] 3.2 Write property test for growth mechanic



    - **Property 6: Growth Mechanic Consistency**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 3.3 Write property test for decay mechanic

    - **Property 7: Decay Mechanic Consistency**
    - **Validates: Requirements 2.1**

- [x] 4. Checkpoint - Ensure game loop tests pass







  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create Pet Display component







  - [x] 5.1 Create PetDisplay.tsx component


    - Subscribe to usePetStore for reactive updates
    - Render different visuals based on stage (EGG, LARVA, BEAST, GHOST)
    - Display health and XP values with pixel-art styling
    - Apply Gameboy Green color scheme and retro aesthetic
    - Show mood-appropriate visual feedback
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.4_
  - [x] 5.2 Write property test for display state reflection



    - **Property 8: Display State Reflection**
    - **Validates: Requirements 5.1, 5.2, 5.3, 6.4**

- [x] 6. Integrate into App component




  - [x] 6.1 Wire up Pet feature in App.tsx


    - Import and mount useGameLoop hook
    - Add PetDisplay component to the UI layout
    - Position pet display alongside existing ActivityLog
    - _Requirements: 3.1, 5.1_

- [x] 7. Final Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.
