# 💀 NECRO-PET: The Undead Coding Companion

> *"Feed it with your code... or watch it perish."*

A haunted desktop virtual pet that feeds on your Git activity. Built for the **Kiroween Hackathon 2025** in the **Resurrection** category — bringing the beloved Tamagotchi back from the dead with modern tech.

![Necro-Pet](https://img.shields.io/badge/Category-Resurrection-8b0000?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-39.x-47848F?style=for-the-badge&logo=electron)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)

---

## 🦇 What is Necro-Pet?

Necro-Pet is a **desktop virtual pet** that gamifies your coding workflow:

- **Save files** → Feed the beast with life essence
- **Stop coding** → Watch your pet's health decay
- **Neglect it too long** → It dies and becomes a ghost 👻

The pet evolves through stages: **Egg → Larva → Beast → Ghost (death)**

### Features

- 🎮 **8-bit pixel art** aesthetic with scanline effects
- 🌦️ **Real-time weather integration** via Open-Meteo MCP
- 📜 **Activity log** showing file changes as "spirit disturbances"
- ⚡ **File watcher** that detects saves in your project
- 🎨 **Windows 95 Haunted House** visual theme

---

## 🕯️ Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron 39 |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS (pixel-art config) |
| State | Zustand |
| Build | Vite |
| Weather | MCP Server (Open-Meteo API) |

---

## 🚀 Quick Start

```bash
# Clone the crypt
git clone https://github.com/ManishModak/necro-pet.git
cd necro-pet

# Summon the dependencies
npm install

# Resurrect the pet
npm run dev
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📁 Project Structure

```
necro-pet/
├── .kiro/                    # Kiro AI configuration
│   ├── hooks/                # Agent hooks (Crypt Keeper's Chronicle)
│   ├── settings/             # MCP server config
│   ├── specs/                # Feature specifications
│   └── steering/             # AI steering documents
├── mcp-servers/              # Custom MCP server for weather
├── src/
│   ├── main/                 # Electron main process
│   ├── preload/              # Context bridge
│   └── renderer/             # React UI
│       └── features/
│           ├── pet/          # Pet display & state
│           ├── weather/      # Weather overlay
│           └── activity-log/ # File change log
└── package.json
```

---

## 🎃 Kiro Features Used

### 1. Spec-Driven Development 📜

The project demonstrates excellent spec-driven development with comprehensive specifications in `.kiro/specs/`. We defined the `necro-pet-core-skeleton`, `pet-state-evolution`, and `world-context-weather-time` specs to strictly guide the AI. This allowed us to separate the "what" (requirements) from the "how" (implementation), ensuring the complex evolution logic was robust before writing a single line of code.

### 2. Agent Hooks 🤖

We used Kiro hooks to automate the core mechanic: "Feeding" the pet. The `Crypt Keeper's Chronicle Hook` (`.kiro/hooks/crypt-keeper-log.kiro.hook`) runs on every git commit. It analyzes the diff and uses an agent prompt to generate a dramatic, medieval fantasy log entry in `CRYPT_LOG.md`, turning mundane work into a story.

### 3. Steering Docs 🧭

Steering documents were critical for maintaining the specific "Digital Necromancy" vibe. `.kiro/steering/vibe.md` ensured that every piece of generated text—from commit messages to UI copy—adhered to the 8-bit spooky aesthetic. `pet_logic.md` guided the AI in balancing the game mechanics so the pet wasn't too needy or too passive.

### 4. MCP (Model Context Protocol) 🌐

We extended Kiro's capabilities with a custom **Open-Meteo MCP Server**. This allows the pet to react to the *real world*. If it's raining outside (via the MCP tool), it rains in the pet's 8-bit house. This connects the isolated desktop environment to the physical world, something impossible with standard context.

### 5. Vibe Coding 🎨

Kiro's "Vibe Coding" capability helped us nail the 8-bit aesthetic without getting bogged down in CSS details. We simply described the "haunted Windows 95" look, and Kiro generated the Tailwind configurations and pixel-art component structures to match.

---

## 🎥 Demo Video

[Link to Demo Video](YOUR_VIDEO_URL_HERE)
*(Video must be < 3 minutes and show the pet evolving, the Crypt Keeper hook, and weather integration)*

---

## 📜 The Crypt Keeper's Chronicle

Every code change is recorded in `CRYPT_LOG.md` by the Crypt Keeper hook:

> *"The necromancer hath fed the beast with fresh souls — an entire Electron skeleton, risen from the void!"*

---

## 🏆 Hackathon Category: Resurrection

**Why Resurrection is the perfect fit:**

Necro-Pet resurrects the **Tamagotchi (1996)** and **Desktop Pets** era - classic obsolete technologies that have vanished from modern computing.

### The Reimagining

- **Old Way**: Random number generators, manual button presses, simple pixel art with no real functionality
- **New Way**: Powered by LLMs (Kiro), real-world data (Weather MCP), developer activity (Git hooks), modern tech stack (Electron+React+Vite)

### Solving Modern Problems

- **Developer Motivation**: Encourages frequent commits and coding activity through gamification
- **Burnout Prevention**: Visual feedback on coding patterns helps maintain healthy work habits
- **Productivity Tracking**: Commit-based rewards create positive reinforcement loops
- **Cross-Project Persistence**: Pet state carries across different coding projects for continuous engagement

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## 🎯 How It Works

### 1. Spec-Driven Core 📜

The project's foundation was built using Kiro's **Spec-Driven Development** with three comprehensive specifications:

- `necro-pet-core-skeleton`: Base Electron + React architecture with file watching
- `pet-state-evolution`: Pet health, XP, and evolutionary stage mechanics
- `world-context-weather-time`: Weather and time integration system

These specs provided clear requirements and correctness properties that guided the entire implementation, ensuring robust game mechanics from the start.

### 2. The Crypt Keeper (Agent Hooks) 🤖

The core "feeding" mechanic is powered by a **Kiro Agent Hook** (`crypt-keeper-log.kiro.hook`). This hook:

- Runs on a schedule (every 6 hours) to check recent git commits
- Analyzes commit changes using `git log` commands
- Generates dramatic medieval fantasy log entries in `CRYPT_LOG.md`
- Turns mundane development work into an entertaining narrative

### 3. Real-World Connection (MCP) 🌐

Using the **Model Context Protocol (MCP)**, Necro-Pet connects to real-world data:

- Custom **Open-Meteo MCP Server** (`mcp-servers/open-meteo-server.py`)
- Fetches current weather and forecasts based on user location
- Weather conditions affect the pet's environment in real-time
- Connects the isolated desktop app to physical world conditions

### 4. Vibe Coding & Steering 🎨

The "Haunted Windows 95" aesthetic was achieved through:

- **Steering Documents** (`vibe.md`) enforcing 8-bit spooky theme rules
- **Vibe Coding** generating creative UI elements with consistent Halloween theme
- All generated text follows medieval fantasy language patterns
- Visual design maintains 8-bit green/black/red palette with pixel-art styling

---

## 🎥 Demo Video

[Watch the Necro-Pet in Action](YOUR_VIDEO_URL_HERE)

---

*🦇 May your commits be plentiful and your pet never perish... 🦇*
*💀 Resurrected for Kiroween 2025 - The Undead Coding Companion 💀*
