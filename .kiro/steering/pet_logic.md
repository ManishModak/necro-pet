# Steering Doc: Necro-Pet Personality & Tech Stack

## Project Goal

We are building "Necro-Pet," a desktop virtual pet (Tamagotchi style) that feeds on GitHub commits. It is a "Resurrection" category project.

## Tech Stack Rules

- **Framework:** Electron (with React for the renderer).
- **Styling:** Tailwind CSS (configured for pixel-art: `image-rendering: pixelated`).
- **State Management:** Zustand (for managing Pet Health/Hunger).
- **Icons:** Lucide-React (but styled to look retro).

## Design "Vibe"

- **Aesthetic:** Windows 95 meets Haunted House.
- **Colors:** Gameboy Green (#0f380f), Blood Red (#8b0000), Ghostly Blue (#e0ffff).
- **Tone:** The UI text should be passive-aggressive. If the user stops coding, the pet should threaten to delete files.

## Coding Constraints

- **Components:** Functional React components only.
- **Comments:** All code comments must be written in the voice of a "Crypt Keeper" (e.g., "// Summoning the window...", "// Burying the dead variables...").
- **Error Handling:** Never fail silently. If an error occurs, play a sound effect.
