# Requirements Document

## Introduction

The Necro-Pet Core Skeleton establishes the foundational architecture for a desktop virtual pet application that feeds on developer activity. This foundation includes a secure Electron + React + Vite boilerplate, a file watcher system in the main process, and a transparent always-on-top UI shell that displays real-time file change events. The skeleton serves as the haunted vessel through which the pet will eventually be summoned.

## Glossary

- **Main_Process**: The Electron main process responsible for system-level operations including file watching and window management
- **Renderer_Process**: The Electron renderer process running the React application that displays the UI
- **File_Watcher**: A chokidar-based service that monitors filesystem changes in the current working directory
- **IPC_Bridge**: The Inter-Process Communication channel connecting Main_Process and Renderer_Process
- **Activity_Log**: A scrollable UI component displaying real-time file change events
- **Widget_Window**: A frameless, transparent, always-on-top Electron BrowserWindow

## Requirements

### Requirement 1

**User Story:** As a developer, I want a secure Electron + React + Vite application scaffold, so that I have a stable foundation for building the Necro-Pet.

#### Acceptance Criteria

1. WHEN the application starts THEN the Main_Process SHALL create a Widget_Window with frameless and transparent properties
2. WHEN the Widget_Window is created THEN the Main_Process SHALL configure the window to remain always-on-top of other applications
3. WHEN the Renderer_Process loads THEN the system SHALL display the React application with Tailwind CSS styling applied
4. WHEN IPC communication is attempted THEN the Main_Process SHALL expose only whitelisted channels through a preload script using contextBridge

### Requirement 2

**User Story:** As a developer, I want the application to watch for file changes in my working directory, so that the pet can eventually react to my coding activity.

#### Acceptance Criteria

1. WHEN the Main_Process initializes THEN the File_Watcher SHALL begin monitoring the current working directory recursively
2. WHEN a file is modified in the watched directory THEN the File_Watcher SHALL emit a 'file:changed' event via IPC_Bridge to the Renderer_Process
3. WHEN a file is added to the watched directory THEN the File_Watcher SHALL emit a 'file:added' event via IPC_Bridge to the Renderer_Process
4. WHEN the File_Watcher encounters an error THEN the Main_Process SHALL log the error visibly and continue operation without crashing
5. WHEN monitoring files THEN the File_Watcher SHALL ignore node_modules, .git, and dist directories to prevent excessive events

### Requirement 3

**User Story:** As a developer, I want to see a live feed of file changes in the UI, so that I can verify the file watcher connection is working.

#### Acceptance Criteria

1. WHEN a 'file:changed' or 'file:added' event is received THEN the Renderer_Process SHALL append the event to the Activity_Log
2. WHEN displaying file events THEN the Activity_Log SHALL show the event type, file path, and timestamp
3. WHEN the Activity_Log exceeds 50 entries THEN the Renderer_Process SHALL remove the oldest entries to maintain performance
4. WHEN new entries are added THEN the Activity_Log SHALL auto-scroll to show the most recent event

### Requirement 4

**User Story:** As a developer, I want the application window to behave like a desktop widget, so that it stays visible while I code without being intrusive.

#### Acceptance Criteria

1. WHEN the Widget_Window is displayed THEN the window SHALL have a transparent background allowing desktop visibility
2. WHEN the user interacts with other applications THEN the Widget_Window SHALL remain visible on top
3. WHEN the Widget_Window is rendered THEN the system SHALL apply the Gameboy Green (#0f380f) color scheme with pixel-art styling
4. WHEN the application launches THEN the Widget_Window SHALL position itself in the bottom-right corner of the screen
