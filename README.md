# 💀 NECRO-PET: The Undead Coding Companion

> *"Feed it with your code... or watch it perish."*

A haunted desktop virtual pet that feeds on your Git activity. Built for the **Kiroween Hackathon 2025** in the **Resurrection** category — bringing the beloved Tamagotchi back from the dead with modern tech.

![Necro-Pet](https://img.shields.io/badge/Category-Resurrection-8b0000?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-39.x-47848F?style=for-the-badge&logo=electron)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)

---

## 🎥 Demo

### Quick Preview

![Necro-Pet Demo](assets/demo-optimized.gif)

*30-second GIF showing pet evolution and weather integration*

### Full Demonstration

🎬 **[Watch Full Demo on YouTube](YOUR_YOUTUBE_URL_HERE)** | 🎥 **[Watch Full Demo on Loom](YOUR_LOOM_URL_HERE)**

*Complete 3-minute video showcasing all features*

---

## 🦇 Overview

Necro-Pet is a **desktop virtual pet** that gamifies your coding workflow:

- **Save files** → Feed the beast with life essence
- **Stop coding** → Watch your pet's health decay
- **Neglect it too long** → It dies and becomes a ghost 👻

The pet evolves through stages: **Egg → Larva → Beast → Ghost (death)**

### 🎮 Pet Evolution Stages

| Stage | Visual | Description |
|-------|--------|-------------|
| **Egg** | ![Egg Stage](assets/egg.gif) | The beginning of life - your pet awaits your first commit |
| **Larva** | ![Larva Stage](assets/larva.gif) | Growing stronger with each file save |
| **Beast** | ![Beast Stage](assets/beast.gif) | Fully grown and thriving on your code |
| **Ghost** | ![Ghost Stage](assets/ghost.gif) | The final form when neglected too long |

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

## 🎃 Kiro Integration

### How Kiro Powers Necro-Pet

Necro-Pet demonstrates comprehensive use of Kiro's capabilities:

#### 1. Spec-Driven Development 📜

- Used `.kiro/specs/` with `necro-pet-core-skeleton`, `pet-state-evolution`, and `world-context-weather-time` specs
- Separated requirements from implementation for robust game mechanics

#### 2. Agent Hooks 🤖

- **Crypt Keeper's Chronicle Hook** runs on git commits
- Analyzes code changes and generates medieval fantasy log entries in `CRYPT_LOG.md`

#### 3. Steering Documents 🧭

- `.kiro/steering/vibe.md` enforces 8-bit spooky aesthetic
- `pet_logic.md` balances game mechanics

#### 4. MCP (Model Context Protocol) 🌐

- Custom Open-Meteo MCP Server connects pet to real-world weather
- Weather conditions affect the pet's 8-bit environment in real-time

#### 5. Vibe Coding 🎨

- Generated Tailwind configurations and pixel-art components
- Maintained consistent "haunted Windows 95" aesthetic

---

## 🌦️ Weather Integration Showcase

Necro-Pet reacts to real-world weather conditions:

| Weather Type | Day Visual | Night Visual |
|--------------|------------|--------------|
| **Clear** | ![Clear Day](assets/clear-day.gif) | ![Clear Night](assets/clear-night.gif) |
| **Rain** | ![Rain Day](assets/rain-day.gif) | ![Rain Night](assets/rain-night.gif) |
| **Snow** | ![Snow Day](assets/snow-day.gif) | ![Snow Night](assets/snow-night.gif) |
| **Storm** | ![Storm Day](assets/storm-day.gif) | ![Storm Night](assets/storm-night.gif) |

---

## 📜 The Crypt Keeper's Chronicle

Every code change is recorded in `CRYPT_LOG.md`:

> *"The necromancer hath fed the beast with fresh souls — an entire Electron skeleton, risen from the void!"*

---

## 🏆 Hackathon Category: Resurrection

**Why Resurrection is the perfect fit:**

Necro-Pet resurrects the **Tamagotchi (1996)** and **Desktop Pets** era - classic obsolete technologies that have vanished from modern computing.

### The Reimagining

- **Old Way**: Random number generators, manual button presses, simple pixel art
- **New Way**: Powered by LLMs (Kiro), real-world data (Weather MCP), developer activity (Git hooks), modern tech stack

### Solving Modern Problems

- **Developer Motivation**: Encourages frequent commits through gamification
- **Burnout Prevention**: Visual feedback on coding patterns
- **Productivity Tracking**: Commit-based rewards
- **Cross-Project Persistence**: Pet state carries across projects

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

*🦇 May your commits be plentiful and your pet never perish... 🦇*
*💀 Resurrected for Kiroween 2025 - The Undead Coding Companion 💀*
