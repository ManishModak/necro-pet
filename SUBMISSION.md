# Necro-Pet: The Undead GitHub Companion

## Project Description

Necro-Pet is an interactive, "haunted" desktop pet that feeds on your coding activity. It bridges the gap between gamification and productivity by using your actual Git history as a life source. It doesn't just sit there; it evolves based on your commit frequency, reacts to real-time weather data, and dies if you stop coding. It re-imagines the classic "Tamagotchi" for the modern developer, powered by the dark arts of Kiro.

**Category:** **Resurrection**
*We brought the "dead" concept of 90s digital pets back to life, but this time, they don't eat virtual food—they eat code.*

**Bonus Category:** **Costume Contest** (If applicable? The UI is heavily themed/spooky)

---

## How We Used Kiro

Necro-Pet wasn't just written with Kiro; it is *alive* because of Kiro. We leveraged the full suite of agentic capabilities to build a complex system in record time.

### 1. Agent Hooks (The Heartbeat)

The core mechanic of Necro-Pet relies on the **Crypt Keeper Hook** (`crypt-keeper-log.kiro.hook`).

* **Workflow Automating:** Instead of manually entering data, we created a hook that listens for `git commit` history on a schedule.
* **The "Magic":** When a user commits, the hook wakes up, analyzes the diff using git command-line tools, and generates a "medieval fantasy" log entry in `CRYPT_LOG.md`. The app then watches this file to feed the pet. This automated the entire game loop without touching the app code.

### 2. Spec-Driven Development (The Blueprint)

We didn't just start coding. We used Kiro's **Spec-Driven Development** to define the game's soul before writing a single line of logic.

* **Structure:** We created a `specs/evolution.md` that defined the math behind Health decay and Evolution stages (Egg -> Larva -> Beast -> Ghost).
* **Impact:** Kiro read this spec and generated the `petStore.ts` logic, ensuring the math was perfectly balanced (e.g. Health +20 per feeding).

### 3. MCP (The Bridge to Reality)

We used the **Open-Meteo MCP Integration** to break the fourth wall.

* **Feature:** The pet's environment reacts to the real world. If it's raining in your location, it rains in the pet's crypt.
* **Why Kiro:** Manually integrating a weather API requires API keys, fetch logic, and error handling. With Kiro's MCP support, we just asked "Connect to weather MCP," and the agent handled the tool calling and data injection seamlessly, generating the necessary **TypeScript interfaces**.

### 4. Vibe Coding & Steering

* **Steering:** We used a `steering/persona.md` to ensure Kiro always wrote code comments and commit messages in the character of a "Necromancer Engineer." This kept the *vibe* consistent across the entire codebase, making the code itself feel like part of the lore.

---

## Repository

**URL:** [https://github.com/ManishModak/necro-pet](https://github.com/ManishModak/necro-pet)
*(Includes open-source license and .kiro directory)*

## Video Demo

**YouTube:** [https://youtu.be/VSRB3CIGBws](https://youtu.be/VSRB3CIGBws)

---

## Instructions for Judges

1. **Clone the Repo:** `git clone https://github.com/ManishModak/necro-pet.git`
2. **Install:** `npm install`
3. **Run:** `npm run dev`
4. **Feed the Beast:** Make a small change to any file and commit it. Watch the pet eat!
5. **Debug Mode:** Press the "Crystal Ball" (🔮) icon in the header to force weather states or kill the pet to see the Ghost form.
