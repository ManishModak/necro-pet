# Technical Steering & Architecture Rules

## Code Structure Rules (Strict)
1.  **Modularity:** Follow "Feature-based" folder structure (e.g., `src/features/pet`, `src/features/weather`). Do not dump everything in `components/`.
2.  **Single Responsibility:** Each file should do one thing. If a component exceeds 100 lines, refactor it into sub-components.
3.  **No Redundancy:** Use shared hooks for logic that appears twice.
4.  **Exports:** Use named exports (`export const ...`) instead of default exports to simplify refactoring.

## Stack
- Electron (Main Process) + React (Renderer) + Vite.
- Tailwind CSS (Pixel Art Config).
- Zustand (Global State).

## Error Handling
- Never fail silently. If a watcher fails, log it to the app's visible console, not just the terminal.