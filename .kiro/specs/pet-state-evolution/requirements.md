# Requirements Document

## Introduction

The Pet State & Evolution feature brings the Necro-Pet to life by implementing the core game mechanics. This includes a Zustand store managing pet health, XP, evolutionary stages, and mood states. A game loop hook handles the decay mechanic (health decreases over time) and growth mechanic (health/XP increase on file changes). The evolution system transforms the pet through stages based on XP thresholds, with death occurring when health reaches zero. A PetDisplay component visualizes the pet's current state using pixel-art styled elements.

## Glossary

- **Pet_Store**: A Zustand store managing the pet's state including health, XP, stage, and mood
- **Health**: A numeric value (0-100) representing the pet's vitality, starting at 100
- **XP**: Experience points (0-infinity) accumulated through developer activity, starting at 0
- **Stage**: The pet's evolutionary form (EGG, LARVA, BEAST, or GHOST)
- **Mood**: The pet's emotional state (HAPPY, HUNGRY, or DEAD)
- **Game_Loop**: A React hook managing time-based decay and event-driven growth mechanics
- **Decay_Mechanic**: The automatic reduction of health by 1 point every 60 seconds
- **Growth_Mechanic**: The increase of health (+5, capped at 100) and XP (+1) when file changes occur
- **Evolution_System**: Logic determining the pet's stage based on XP thresholds and health status
- **Pet_Display**: A React component rendering the pet's visual representation based on current state

## Requirements

### Requirement 1

**User Story:** As a developer, I want a centralized store managing my pet's vital statistics, so that the pet's state persists and updates reactively across the application.

#### Acceptance Criteria

1. WHEN the Pet_Store initializes THEN the Pet_Store SHALL set health to 100, XP to 0, stage to EGG, and mood to HAPPY
2. WHEN health is modified THEN the Pet_Store SHALL clamp the value between 0 and 100 inclusive
3. WHEN XP is modified THEN the Pet_Store SHALL ensure the value remains non-negative
4. WHEN any state property changes THEN the Pet_Store SHALL notify all subscribed components

### Requirement 2

**User Story:** As a developer, I want my pet's health to decay over time, so that I am motivated to keep coding to keep it alive.

#### Acceptance Criteria

1. WHEN the Game_Loop is active THEN the Decay_Mechanic SHALL decrease health by 1 every 60 seconds
2. WHEN health reaches 0 through decay THEN the Game_Loop SHALL trigger the death condition
3. WHEN the component unmounts THEN the Game_Loop SHALL clean up the decay timer to prevent memory leaks

### Requirement 3

**User Story:** As a developer, I want my coding activity to feed my pet, so that saving files rewards me with a healthier pet.

#### Acceptance Criteria

1. WHEN a 'file:changed' IPC event is received THEN the Growth_Mechanic SHALL increase health by 5
2. WHEN a 'file:changed' IPC event is received THEN the Growth_Mechanic SHALL increase XP by 1
3. WHEN health is increased THEN the Growth_Mechanic SHALL cap the value at 100
4. WHEN the component unmounts THEN the Game_Loop SHALL remove the IPC event listeners

### Requirement 4

**User Story:** As a developer, I want my pet to evolve as I accumulate XP, so that I can see visual progress for my coding efforts.

#### Acceptance Criteria

1. WHEN XP is between 0 and 10 inclusive THEN the Evolution_System SHALL set stage to EGG
2. WHEN XP is between 11 and 50 inclusive THEN the Evolution_System SHALL set stage to LARVA
3. WHEN XP exceeds 50 THEN the Evolution_System SHALL set stage to BEAST
4. WHEN health reaches 0 THEN the Evolution_System SHALL set stage to GHOST regardless of XP value
5. WHEN stage changes THEN the Pet_Store SHALL update the mood accordingly (GHOST triggers DEAD mood)

### Requirement 5

**User Story:** As a developer, I want to see my pet's current state visually, so that I can quickly understand its health and evolution stage.

#### Acceptance Criteria

1. WHEN Pet_Display renders THEN the component SHALL display a visual representation based on the current stage
2. WHEN Pet_Display renders THEN the component SHALL show the current health value
3. WHEN Pet_Display renders THEN the component SHALL show the current XP value
4. WHEN Pet_Display renders THEN the component SHALL apply pixel-art styling consistent with the Gameboy Green aesthetic
5. WHEN stage is GHOST THEN the Pet_Display SHALL render a distinct death state visual

### Requirement 6

**User Story:** As a developer, I want the pet's mood to reflect its current condition, so that I receive emotional feedback about my coding habits.

#### Acceptance Criteria

1. WHEN health is above 50 THEN the Pet_Store SHALL set mood to HAPPY
2. WHEN health is between 1 and 50 inclusive THEN the Pet_Store SHALL set mood to HUNGRY
3. WHEN health is 0 THEN the Pet_Store SHALL set mood to DEAD
4. WHEN mood changes THEN the Pet_Display SHALL update the visual representation to reflect the new mood
