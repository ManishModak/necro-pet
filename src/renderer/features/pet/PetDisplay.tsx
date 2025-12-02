// The Pet Display - where our necromantic companion manifests...
import React, { useEffect, useState } from 'react';
import { usePetStore, Stage, Mood } from './petStore';

export interface PetDisplayProps {
  // No props - reads from the crypt directly
}

// The cursed stylesheet - injecting dark magic into the DOM
const necroStyles = `
@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes glitch {
  0% { clip-path: inset(0 0 0 0); }
  5% { clip-path: inset(10% 0 60% 0); }
  10% { clip-path: inset(40% 0 30% 0); }
  15% { clip-path: inset(80% 0 5% 0); }
  20% { clip-path: inset(0 0 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

@keyframes resurrect {
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0.3; filter: brightness(0.5); }
  20% { transform: scale(1.2) rotate(5deg); opacity: 1; filter: brightness(2); }
  40% { transform: scale(0.9) rotate(-3deg); filter: brightness(1.5); }
  60% { transform: scale(1.1) rotate(2deg); filter: brightness(1.8); }
  80% { transform: scale(0.95); filter: brightness(1.2); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
}

@keyframes flash-bg {
  0%, 100% { background-color: rgba(0, 0, 0, 0); }
  50% { background-color: rgba(0, 255, 65, 0.3); }
}

.animate-breathing {
  animation: breathing 2s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out infinite;
}

.animate-glitch {
  animation: glitch 0.3s steps(1) forwards;
}

.animate-resurrect {
  animation: resurrect 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.flash-bg {
  animation: flash-bg 1.5s ease-in-out forwards;
}
`;

// Injecting the dark styles into the mortal realm
const useNecroStyles = () => {
  useEffect(() => {
    const styleId = 'necro-pet-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = necroStyles;
      document.head.appendChild(styleEl);
    }
  }, []);
};

// Summoning the appropriate visual for each evolutionary stage
// Behold! The pixel art manifestations of our undead companion...

// The Egg - a cracked vessel awaiting resurrection
const EggSvg: React.FC<{ mood: Mood }> = ({ mood }) => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated">
    {/* The shell of dormant life */}
    <rect x="5" y="2" width="6" height="2" fill="#00ff41" />
    <rect x="4" y="4" width="8" height="2" fill="#00ff41" />
    <rect x="3" y="6" width="10" height="4" fill="#00ff41" />
    <rect x="4" y="10" width="8" height="2" fill="#00ff41" />
    <rect x="5" y="12" width="6" height="2" fill="#00ff41" />
    {/* The cracks - signs of awakening */}
    <rect x="6" y="3" width="1" height="3" fill="#003311" className={mood === Mood.HUNGRY ? 'animate-pulse' : ''} />
    <rect x="7" y="5" width="2" height="1" fill="#003311" />
    <rect x="9" y="6" width="1" height="4" fill="#003311" className={mood === Mood.HUNGRY ? 'animate-pulse' : ''} />
    <rect x="8" y="9" width="1" height="1" fill="#003311" />
    {/* Inner glow - the spark of unlife */}
    <rect x="6" y="7" width="2" height="2" fill="#00ff88" className="animate-pulse" />
  </svg>
);

// The Larva - a glitchy bug crawling from the grave
const LarvaSvg: React.FC<{ mood: Mood }> = ({ mood }) => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated">
    {/* The segmented body of corruption */}
    <rect x="2" y="8" width="3" height="3" fill="#00dd33" />
    <rect x="4" y="7" width="3" height="4" fill="#00ee44" />
    <rect x="6" y="6" width="4" height="5" fill="#00ff41" />
    <rect x="9" y="5" width="4" height="6" fill="#00ff55" />
    {/* The cursed eye */}
    <rect x="11" y="7" width="2" height="2" fill="#003311" />
    <rect x="12" y="7" width="1" height="1" fill="#ff4444" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    {/* Antennae - sensing the void */}
    <rect x="12" y="3" width="1" height="2" fill="#00ff41" />
    <rect x="13" y="2" width="1" height="2" fill="#00ff41" />
    <rect x="14" y="4" width="1" height="2" fill="#00ff41" />
    {/* Legs - skittering through shadows */}
    <rect x="3" y="11" width="1" height="2" fill="#006622" />
    <rect x="5" y="11" width="1" height="3" fill="#006622" />
    <rect x="7" y="11" width="1" height="2" fill="#006622" />
    <rect x="9" y="11" width="1" height="3" fill="#006622" />
    {/* Glitch artifacts */}
    <rect x="1" y="9" width="1" height="1" fill="#00ff41" className="animate-pulse" />
    <rect x="14" y="8" width="1" height="1" fill="#00ff41" className="animate-pulse" />
  </svg>
);

// The Beast - a menacing pixel-art robot face of doom
const BeastSvg: React.FC<{ mood: Mood }> = ({ mood }) => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated">
    {/* The skull frame */}
    <rect x="2" y="2" width="12" height="2" fill="#00ff41" />
    <rect x="1" y="4" width="14" height="8" fill="#00ff41" />
    <rect x="2" y="12" width="12" height="2" fill="#00ff41" />
    {/* The hollow eye sockets */}
    <rect x="3" y="5" width="4" height="3" fill="#001a00" />
    <rect x="9" y="5" width="4" height="3" fill="#001a00" />
    {/* The burning pupils */}
    <rect x="4" y="6" width="2" height="2" fill="#ff4444" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    <rect x="10" y="6" width="2" height="2" fill="#ff4444" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    {/* The nose cavity */}
    <rect x="7" y="8" width="2" height="2" fill="#001a00" />
    {/* The jagged maw */}
    <rect x="4" y="10" width="8" height="2" fill="#001a00" />
    <rect x="5" y="10" width="1" height="1" fill="#00ff41" />
    <rect x="7" y="10" width="1" height="1" fill="#00ff41" />
    <rect x="9" y="10" width="1" height="1" fill="#00ff41" />
    <rect x="6" y="11" width="1" height="1" fill="#00ff41" />
    <rect x="8" y="11" width="1" height="1" fill="#00ff41" />
    <rect x="10" y="11" width="1" height="1" fill="#00ff41" />
    {/* Horns of power */}
    <rect x="1" y="1" width="2" height="2" fill="#ff4444" />
    <rect x="13" y="1" width="2" height="2" fill="#ff4444" />
    <rect x="0" y="0" width="1" height="2" fill="#00ff41" />
    <rect x="15" y="0" width="1" height="2" fill="#00ff41" />
  </svg>
);

// The Ghost - a floating skull, banished to the spectral realm
const GhostSvg: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated animate-bounce">
    {/* The ethereal skull */}
    <rect x="4" y="1" width="8" height="2" fill="#00ff41" opacity="0.6" />
    <rect x="3" y="3" width="10" height="6" fill="#00ff41" opacity="0.6" />
    <rect x="4" y="9" width="8" height="2" fill="#00ff41" opacity="0.6" />
    {/* Empty eye sockets - windows to the void */}
    <rect x="4" y="4" width="3" height="3" fill="#001a00" />
    <rect x="9" y="4" width="3" height="3" fill="#001a00" />
    {/* Fading pupils */}
    <rect x="5" y="5" width="1" height="1" fill="#ff4444" className="animate-pulse" opacity="0.8" />
    <rect x="10" y="5" width="1" height="1" fill="#ff4444" className="animate-pulse" opacity="0.8" />
    {/* The silent scream */}
    <rect x="6" y="8" width="4" height="2" fill="#001a00" />
    {/* Spectral wisps - fading into nothing */}
    <rect x="5" y="11" width="2" height="2" fill="#00ff41" className="animate-pulse" opacity="0.4" />
    <rect x="9" y="11" width="2" height="2" fill="#00ff41" className="animate-pulse" opacity="0.4" />
    <rect x="6" y="13" width="1" height="2" fill="#00ff41" className="animate-pulse" opacity="0.25" />
    <rect x="9" y="13" width="1" height="2" fill="#00ff41" className="animate-pulse" opacity="0.25" />
    <rect x="7" y="14" width="2" height="1" fill="#00ff41" opacity="0.2" />
  </svg>
);

// The ritual to summon the correct visual manifestation
const getStageVisual = (stage: Stage, mood: Mood): React.ReactNode => {
  if (stage === Stage.GHOST) {
    return <GhostSvg />;
  }

  switch (stage) {
    case Stage.EGG:
      return <EggSvg mood={mood} />;
    case Stage.LARVA:
      return <LarvaSvg mood={mood} />;
    case Stage.BEAST:
      return <BeastSvg mood={mood} />;
    default:
      return <span className="text-4xl">❓</span>;
  }
};

// Conjuring the stage name for display
const getStageName = (stage: Stage): string => {
  switch (stage) {
    case Stage.EGG:
      return 'EGG';
    case Stage.LARVA:
      return 'LARVA';
    case Stage.BEAST:
      return 'BEAST';
    case Stage.GHOST:
      return 'GHOST';
    default:
      return 'UNKNOWN';
  }
};

// Summoning the mood description
const getMoodDescription = (mood: Mood): string => {
  switch (mood) {
    case Mood.HAPPY:
      return 'Content in the darkness';
    case Mood.HUNGRY:
      return 'Craving life essence';
    case Mood.DEAD:
      return 'Banished to the void';
    default:
      return 'Unknown state';
  }
};

export const PetDisplay: React.FC<PetDisplayProps> = () => {
  // Summoning the dark styles into existence
  useNecroStyles();

  // Channeling the pet's essence from the store
  const { health, xp, stage, mood, deathCount } = usePetStore();

  // The glitch state - random spectral interference for ghosts
  const [isGlitching, setIsGlitching] = useState(false);

  // The resurrection state - triggers when pet comes back from GHOST
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [showResurrectMessage, setShowResurrectMessage] = useState(false);

  // Track previous stage to detect resurrection
  const [prevStage, setPrevStage] = useState<Stage>(stage);
  const [prevDeathCount, setPrevDeathCount] = useState<number>(deathCount);

  // The ghost glitch ritual - triggers randomly from beyond the veil
  useEffect(() => {
    if (stage !== Stage.GHOST) return;

    const summonGlitch = () => {
      // Random chance to glitch every 2-5 seconds
      const delay = 2000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setIsGlitching(true);
        // Glitch lasts 300ms then fades
        setTimeout(() => setIsGlitching(false), 300);
        summonGlitch();
      }, delay);
      return timeout;
    };

    const timeout = summonGlitch();
    return () => clearTimeout(timeout);
  }, [stage]);

  // Detect resurrection - when pet was GHOST and is no longer GHOST, or death count increased
  useEffect(() => {
    const wasGhost = prevStage === Stage.GHOST;
    const isAlive = stage !== Stage.GHOST && health > 0;
    const deathCountIncreased = deathCount > prevDeathCount;

    if ((wasGhost && isAlive) || deathCountIncreased) {
      console.log('🦇 RESURRECTION DETECTED!');
      setIsResurrecting(true);
      setShowResurrectMessage(true);

      // Animation lasts 1.5 seconds
      setTimeout(() => {
        setIsResurrecting(false);
      }, 1500);

      // Message lasts 3 seconds
      setTimeout(() => {
        setShowResurrectMessage(false);
      }, 3000);
    }

    setPrevStage(stage);
    setPrevDeathCount(deathCount);
  }, [stage, health, deathCount, prevStage, prevDeathCount]);

  // Determining the visual manifestation
  const visual = getStageVisual(stage, mood);
  const stageName = getStageName(stage);
  const moodDesc = getMoodDescription(mood);

  // Conjuring the animation class based on the pet's state
  const getAnimationClass = (): string => {
    if (isResurrecting) return 'animate-resurrect';
    if (stage === Stage.GHOST && isGlitching) return 'animate-glitch';
    if (mood === Mood.HUNGRY) return 'animate-shake';
    if (mood !== Mood.DEAD) return 'animate-breathing';
    return '';
  };

  // Calculating health bar color based on vitality
  const getHealthColor = (): string => {
    if (health === 0) return 'bg-blood-red';
    if (health <= 30) return 'bg-blood-red';
    if (health <= 60) return 'bg-yellow-500';
    return 'bg-terminal-green';
  };

  return (
    <div className={`flex flex-col h-full bg-crypt-dark border-2 border-terminal-green glow-border relative ${isResurrecting ? 'flash-bg' : ''}`}>
      {/* Resurrection message overlay */}
      {showResurrectMessage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 pointer-events-none">
          <div className="text-terminal-green text-2xl font-bold pixelated text-glow animate-pulse">
            ⚡ RESURRECTED ⚡
          </div>
        </div>
      )}

      {/* The crypt keeper's header */}
      <div className="px-2 py-1 border-b-2 border-terminal-green bg-panel-bg">
        <h2 className="text-terminal-green text-xs font-bold pixelated text-glow whitespace-nowrap">
          💀 PET STATUS
        </h2>
        <p className="text-terminal-green text-xs pixelated">
          Stage: {stageName}
        </p>
      </div>

      {/* The manifestation chamber */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
        {/* The pet's visual form - pixel art summoned from the void */}
        <div
          className={`flex items-center justify-center pet-glow ${getAnimationClass()}`}
          style={{ imageRendering: 'pixelated' }}
        >
          {visual}
        </div>

        {/* The mood whisper */}
        <div className="text-terminal-green text-sm text-center pixelated font-bold">
          {moodDesc}
        </div>

        {/* The vital statistics */}
        <div className="w-full px-2 space-y-2">
          {/* Health bar - the life force */}
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-terminal-green text-xs font-bold pixelated whitespace-nowrap">
                ❤️ HP
              </span>
              <span className="text-terminal-green text-xs pixelated whitespace-nowrap">
                {health}/100
              </span>
            </div>
            <div className="w-full h-3 bg-panel-bg border border-terminal-green">
              <div
                className={`h-full ${getHealthColor()} transition-all duration-300`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          {/* XP bar - the accumulated essence */}
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-terminal-green text-xs font-bold pixelated whitespace-nowrap">
                ✨ XP
              </span>
              <span className="text-terminal-green text-xs pixelated whitespace-nowrap">
                {xp}
              </span>
            </div>
            <div className="w-full h-3 bg-panel-bg border border-terminal-green">
              <div
                className="h-full bg-ghostly-blue transition-all duration-300"
                style={{ width: `${Math.min(xp, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* The bottom whisper */}
      <div className="px-3 py-1 border-t-2 border-terminal-green bg-panel-bg">
        <p className="text-terminal-green text-xs pixelated text-center">
          {stage === Stage.GHOST
            ? '💀 Your companion has perished... 💀'
            : '🕯️ Feed it with your code... 🕯️'}
        </p>
      </div>
    </div>
  );
};
