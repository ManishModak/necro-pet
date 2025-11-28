# Implementation Plan

- [x] 1. Initialize Electron + React + Vite project structure





  - [x] 1.1 Create project with Vite and configure for Electron


    - Initialize npm project with Vite React-TS template
    - Install Electron, electron-builder, and vite-plugin-electron
    - Configure vite.config.ts for Electron main/preload/renderer builds
    - Set up package.json scripts for dev and build
    - _Requirements: 1.1, 1.3_
  - [x] 1.2 Set up Tailwind CSS with pixel-art configuration


    - Install Tailwind CSS and dependencies
    - Configure tailwind.config.js with Gameboy Green (#0f380f), Blood Red (#8b0000), Ghostly Blue (#e0ffff)
    - Add `image-rendering: pixelated` utility class
    - Create base styles in index.css
    - _Requirements: 4.3_
  - [x] 1.3 Create feature-based folder structure


    - Create `src/main/` for Electron main process
    - Create `src/preload/` for context bridge
    - Create `src/renderer/` for React app
    - Create `src/renderer/features/activity-log/` for activity log feature
    - _Requirements: 1.1_

- [x] 2. Implement Main Process window management





  - [x] 2.1 Create MainWindowManager module


    - Implement `createMainWindow()` with frameless, transparent, alwaysOnTop config
    - Implement `positionWindowBottomRight()` using screen dimensions
    - Export WindowConfig interface
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.4_
  - [x] 2.2 Write property test for window positioning


    - **Property 8: Window Bottom-Right Positioning**
    - **Validates: Requirements 4.4**
  - [x] 2.3 Create main process entry point (index.ts)


    - Import and initialize window manager
    - Handle app ready event
    - Configure app for single instance
    - _Requirements: 1.1_

- [x] 3. Implement secure IPC bridge




  - [x] 3.1 Create preload script with contextBridge


    - Define ElectronAPI interface with onFileChanged, onFileAdded, removeFileListeners
    - Expose only whitelisted channels via contextBridge.exposeInMainWorld
    - Implement secure ipcRenderer.on wrappers
    - _Requirements: 1.4_
  - [x] 3.2 Write property test for IPC whitelist enforcement


    - **Property 1: IPC Channel Whitelist Enforcement**
    - **Validates: Requirements 1.4**
  - [x] 3.3 Create IPC handler in main process


    - Implement registerIPCHandlers() for main process
    - Implement sendFileEvent() to broadcast to renderer
    - _Requirements: 1.4, 2.2, 2.3_

- [x] 4. Implement File Watcher service






  - [x] 4.1 Create FileWatcherService module

    - Install chokidar dependency
    - Implement initFileWatcher() with recursive watching
    - Configure ignored patterns (node_modules, .git, dist)
    - Emit FileEvent objects on 'change' and 'add' events
    - Implement error handling with visible logging
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.2 Write property test for directory filtering

    - **Property 4: Ignored Directory Filtering**
    - **Validates: Requirements 2.5**
  - [x] 4.3 Write property tests for file event emission
    - **Property 2: File Changed Event Emission**
    - **Property 3: File Added Event Emission**
    - **Validates: Requirements 2.2, 2.3**
- [x] 5. Checkpoint - Ensure main process tests pass



  - Ensure all tests pass, ask the user if questions arise.
-

- [x] 6. Implement Activity Log feature (Renderer)





  - [x] 6.1 Create ActivityLogStore with Zustand

    - Install zustand dependency
    - Implement ActivityLogState interface with entries array
    - Implement addEntry() action with 50-entry limit (FIFO removal)
    - Implement clearEntries() action
    - Generate unique IDs for entries
    - _Requirements: 3.1, 3.3_
  - [x] 6.2 Write property tests for activity log store


    - **Property 5: Event Appending to Activity Log**
    - **Property 7: Activity Log Size Invariant**
    - **Validates: Requirements 3.1, 3.3**
  - [x] 6.3 Create ActivityLog React component


    - Implement scrollable log container with auto-scroll
    - Display event type, file path, and formatted timestamp
    - Apply Gameboy Green styling with pixel-art aesthetic
    - Use spooky language for UI text
    - _Requirements: 3.2, 3.4, 4.3_

  - [x] 6.4 Write property test for display format

    - **Property 6: Activity Log Entry Display Format**
    - **Validates: Requirements 3.2**

- [x] 7. Wire up Renderer with IPC listeners





  - [x] 7.1 Create App component with IPC integration


    - Set up useEffect to register IPC listeners on mount
    - Connect onFileChanged and onFileAdded to ActivityLogStore
    - Clean up listeners on unmount
    - _Requirements: 2.2, 2.3, 3.1_
  - [x] 7.2 Create transparent window shell UI


    - Style App container with transparent background
    - Add minimal window chrome (drag region, close button)
    - Apply haunted house aesthetic
    - _Requirements: 4.1, 4.3_
-

- [x] 8. Final integration and wiring





  - [x] 8.1 Connect all main process modules


    - Wire FileWatcherService events to IPC handler
    - Initialize file watcher after window creation
    - Add startup logging with spooky messages

    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 8.2 Configure Electron security settings

    - Enable contextIsolation in webPreferences
    - Disable nodeIntegration in renderer
    - Set up CSP headers
    - _Requirements: 1.4_

- [x] 9. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
