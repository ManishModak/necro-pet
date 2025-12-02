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

### 1. Spec-Driven Development
Three structured specs guided implementation:
- `necro-pet-core-skeleton` - Base Electron + React setup
- `pet-state-evolution` - Pet health, XP, and evolution logic
- `world-context-weather-time` - Weather and time integration

### 2. Steering Documents
Four steering docs maintain the haunted vibe:
- `vibe.md` - Digital Necromancy theme rules
- `tech.md` - Architecture constraints
- `product.md` - Product vision
- `pet_logic.md` - Pet personality guidelines

### 3. Agent Hooks
**Crypt Keeper's Chronicle** - Automatically logs every file save to `CRYPT_LOG.md` with spooky medieval commentary.

### 4. MCP Integration
Custom **Open-Meteo MCP server** fetches real weather data to affect the pet's environment.

---

## 📜 The Crypt Keeper's Chronicle

Every code change is recorded in `CRYPT_LOG.md` by the Crypt Keeper hook:

> *"The necromancer hath fed the beast with fresh souls — an entire Electron skeleton, risen from the void!"*

---

## 🏆 Hackathon Category

**Resurrection** — Bringing the 1996 Tamagotchi concept back to life as a developer productivity tool.

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

*🦇 May your commits be plentiful and your pet never perish... 🦇*
