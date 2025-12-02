# Requirements Document

## Introduction

This feature transforms Necro-Pet from a file-save-based feeding system to a git-commit-based system. The pet will feed on git commits, encouraging developers to commit frequently. The pet's state persists globally across sessions and projects, with time-based health decay when commits are neglected. Dead pets can be revived through specific commit actions.

## Glossary

- **Necro-Pet**: The virtual pet application that feeds on developer activity
- **Health (HP)**: The pet's life force, ranging from 0-100
- **XP**: Experience points that determine the pet's evolutionary stage
- **Commit**: A git commit made by the user in any watched repository
- **Revival**: The process of bringing a dead pet (GHOST) back to life
- **Global Save**: Persistent storage in user's home directory (~/.necro-pet/)
- **Decay**: Health loss over time when no commits are made

## Requirements

### Requirement 1: Git Commit Detection

**User Story:** As a developer, I want my pet to be fed when I make git commits, so that I'm encouraged to commit my code frequently.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL begin monitoring for git commits in the current working directory
2. WHEN a new git commit is detected THEN the system SHALL increase the pet's health by 20 points
3. WHEN a new git commit is detected THEN the system SHALL increase the pet's XP by 15 points
4. WHEN a new git commit is detected THEN the system SHALL reset the "last commit timestamp" to the current time
5. WHEN a new git commit is detected THEN the system SHALL add an entry to the Activity Log with type "commit"

### Requirement 2: Global State Persistence

**User Story:** As a developer, I want my pet's progress to be saved globally, so that my pet persists across different projects and coding sessions.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL load the pet state from ~/.necro-pet/save.json if it exists
2. WHEN the application starts AND no save file exists THEN the system SHALL create a new pet with default values
3. WHEN the pet's state changes (health, XP, stage) THEN the system SHALL save the state to ~/.necro-pet/save.json within 5 seconds
4. WHEN saving state THEN the system SHALL include health, XP, stage, mood, lastCommitDate, and deathCount
5. WHEN the save file is corrupted or unreadable THEN the system SHALL create a new pet and log a warning

### Requirement 3: Time-Based Health Decay

**User Story:** As a developer, I want my pet's health to decay over time without commits, so that I'm motivated to commit regularly.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL calculate health decay based on time since last commit
2. WHEN 0-24 hours have passed since last commit THEN the system SHALL apply no health decay (grace period)
3. WHEN 24-48 hours have passed since last commit THEN the system SHALL apply 15 HP decay
4. WHEN 48-72 hours have passed since last commit THEN the system SHALL apply 25 HP additional decay
5. WHEN more than 72 hours have passed since last commit THEN the system SHALL apply 35 HP decay per additional 24-hour period
6. WHEN health reaches 0 from decay THEN the system SHALL transition the pet to GHOST stage

### Requirement 4: Pet Revival Mechanics

**User Story:** As a developer, I want to be able to revive my dead pet through commits, so that I can recover from periods of inactivity.

#### Acceptance Criteria

1. WHEN the pet is in GHOST stage AND a commit is detected THEN the system SHALL revive the pet at 50% health (50 HP)
2. WHEN the pet is in GHOST stage AND a commit message contains "resurrect" (case-insensitive) THEN the system SHALL revive the pet at 75% health (75 HP)
3. WHEN the pet is revived THEN the system SHALL preserve the pet's XP and evolutionary stage
4. WHEN the pet is revived THEN the system SHALL increment the deathCount in the save file
5. WHEN the pet is revived THEN the system SHALL display a "resurrection" animation or message

### Requirement 5: Activity Log Updates

**User Story:** As a developer, I want to see my git commits in the Activity Log, so that I can track my coding activity.

#### Acceptance Criteria

1. WHEN a git commit is detected THEN the system SHALL add an entry with type "commit" to the Activity Log
2. WHEN displaying a commit entry THEN the system SHALL show the commit message (truncated to 50 characters)
3. WHEN displaying a commit entry THEN the system SHALL show the timestamp of the commit
4. WHEN the pet is revived THEN the system SHALL add a special "resurrection" entry to the Activity Log

### Requirement 6: File Save Visual Feedback (Retained)

**User Story:** As a developer, I want visual feedback when I save files, so that I know the app is monitoring my activity.

#### Acceptance Criteria

1. WHEN a file is saved THEN the system SHALL add an entry to the Activity Log (existing behavior)
2. WHEN a file is saved THEN the system SHALL NOT increase health or XP (commits are the primary food source)
3. WHEN a file is saved THEN the system SHALL display a subtle visual indicator on the pet

### Requirement 7: Debug Panel Updates

**User Story:** As a developer testing the app, I want debug controls for the new commit-based system.

#### Acceptance Criteria

1. WHEN the debug panel is open THEN the system SHALL display the time since last commit
2. WHEN the debug panel is open THEN the system SHALL provide a "Simulate Commit" button
3. WHEN the debug panel is open THEN the system SHALL provide a "Simulate Day Pass" button to test decay
4. WHEN the debug panel is open THEN the system SHALL display the current save file path
