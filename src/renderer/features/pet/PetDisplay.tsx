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

.animate-breathing {
  animation: breathing 2s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out infinite;
}

.animate-glitch {
  animation: glitch 0.3s steps(1) forwards;
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
    <rect x="5" y="2" width="6" height="2" fill="#0f380f" />
    <rect x="4" y="4" width="8" height="2" fill="#0f380f" />
    <rect x="3" y="6" width="10" height="4" fill="#0f380f" />
    <rect x="4" y="10" width="8" height="2" fill="#0f380f" />
    <rect x="5" y="12" width="6" height="2" fill="#0f380f" />
    {/* The cracks - signs of awakening */}
    <rect x="6" y="3" width="1" height="3" fill="#081820" className={mood === Mood.HUNGRY ? 'animate-pulse' : ''} />
    <rect x="7" y="5" width="2" height="1" fill="#081820" />
    <rect x="9" y="6" width="1" height="4" fill="#081820" className={mood === Mood.HUNGRY ? 'animate-pulse' : ''} />
    <rect x="8" y="9" width="1" height="1" fill="#081820" />
    {/* Inner glow - the spark of unlife */}
    <rect x="6" y="7" width="2" height="2" fill="#0f380f" className="animate-pulse opacity-75" />
  </svg>
);

// The Larva - a glitchy bug crawling from the grave
const LarvaSvg: React.FC<{ mood: Mood }> = ({ mood }) => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated">
    {/* The segmented body of corruption */}
    <rect x="2" y="8" width="3" height="3" fill="#0f380f" />
    <rect x="4" y="7" width="3" height="4" fill="#0f380f" />
    <rect x="6" y="6" width="4" height="5" fill="#0f380f" />
    <rect x="9" y="5" width="4" height="6" fill="#0f380f" />
    {/* The cursed eye */}
    <rect x="11" y="7" width="2" height="2" fill="#081820" />
    <rect x="12" y="7" width="1" height="1" fill="#0f380f" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    {/* Antennae - sensing the void */}
    <rect x="12" y="3" width="1" height="2" fill="#0f380f" />
    <rect x="13" y="2" width="1" height="2" fill="#0f380f" />
    <rect x="14" y="4" width="1" height="2" fill="#0f380f" />
    {/* Legs - skittering through shadows */}
    <rect x="3" y="11" width="1" height="2" fill="#081820" />
    <rect x="5" y="11" width="1" height="3" fill="#081820" />
    <rect x="7" y="11" width="1" height="2" fill="#081820" />
    <rect x="9" y="11" width="1" height="3" fill="#081820" />
    {/* Glitch artifacts */}
    <rect x="1" y="9" width="1" height="1" fill="#081820" className="animate-pulse" />
    <rect x="14" y="8" width="1" height="1" fill="#081820" className="animate-pulse" />
  </svg>
);

// The Beast - a menacing pixel-art robot face of doom
const BeastSvg: React.FC<{ mood: Mood }> = ({ mood }) => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated">
    {/* The skull frame */}
    <rect x="2" y="2" width="12" height="2" fill="#0f380f" />
    <rect x="1" y="4" width="14" height="8" fill="#0f380f" />
    <rect x="2" y="12" width="12" height="2" fill="#0f380f" />
    {/* The hollow eye sockets */}
    <rect x="3" y="5" width="4" height="3" fill="#081820" />
    <rect x="9" y="5" width="4" height="3" fill="#081820" />
    {/* The burning pupils */}
    <rect x="4" y="6" width="2" height="2" fill="#0f380f" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    <rect x="10" y="6" width="2" height="2" fill="#0f380f" className={mood === Mood.HUNGRY ? 'animate-ping' : 'animate-pulse'} />
    {/* The nose cavity */}
    <rect x="7" y="8" width="2" height="2" fill="#081820" />
    {/* The jagged maw */}
    <rect x="4" y="10" width="8" height="2" fill="#081820" />
    <rect x="5" y="10" width="1" height="1" fill="#0f380f" />
    <rect x="7" y="10" width="1" height="1" fill="#0f380f" />
    <rect x="9" y="10" width="1" height="1" fill="#0f380f" />
    <rect x="6" y="11" width="1" height="1" fill="#0f380f" />
    <rect x="8" y="11" width="1" height="1" fill="#0f380f" />
    <rect x="10" y="11" width="1" height="1" fill="#0f380f" />
    {/* Horns of power */}
    <rect x="1" y="1" width="2" height="2" fill="#081820" />
    <rect x="13" y="1" width="2" height="2" fill="#081820" />
    <rect x="0" y="0" width="1" height="2" fill="#0f380f" />
    <rect x="15" y="0" width="1" height="2" fill="#0f380f" />
  </svg>
);

// The Ghost - a floating skull, banished to the spectral realm
const GhostSvg: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 16 16" className="pixelated animate-bounce">
    {/* The ethereal skull */}
    <rect x="4" y="1" width="8" height="2" fill="#0f380f" className="opacity-75" />
    <rect x="3" y="3" width="10" height="6" fill="#0f380f" className="opacity-75" />
    <rect x="4" y="9" width="8" height="2" fill="#0f380f" className="opacity-75" />
    {/* Empty eye sockets - windows to the void */}
    <rect x="4" y="4" width="3" height="3" fill="#081820" />
    <rect x="9" y="4" width="3" height="3" fill="#081820" />
    {/* Fading pupils */}
    <rect x="5" y="5" width="1" height="1" fill="#0f380f" className="animate-pulse opacity-50" />
    <rect x="10" y="5" width="1" height="1" fill="#0f380f" className="animate-pulse opacity-50" />
    {/* The silent scream */}
    <rect x="6" y="8" width="4" height="2" fill="#081820" />
    {/* Spectral wisps - fading into nothing */}
    <rect x="5" y="11" width="2" height="2" fill="#0f380f" className="opacity-50 animate-pulse" />
    <rect x="9" y="11" width="2" height="2" fill="#0f380f" className="opacity-50 animate-pulse" />
    <rect x="6" y="13" width="1" height="2" fill="#0f380f" className="opacity-25 animate-pulse" />
    <rect x="9" y="13" width="1" height="2" fill="#0f380f" className="opacity-25 animate-pulse" />
    <rect x="7" y="14" width="2" height="1" fill="#0f380f" className="opacity-25" />
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
  const { health, xp, stage, mood } = usePetStore();

  // The glitch state - random spectral interference for ghosts
  const [isGlitching, setIsGlitching] = useState(false);

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

  // Determining the visual manifestation
  const visual = getStageVisual(stage, mood);
  const stageName = getStageName(stage);
  const moodDesc = getMoodDescription(mood);

  // Conjuring the animation class based on the pet's state
  const getAnimationClass = (): string => {
    if (stage === Stage.GHOST && isGlitching) return 'animate-glitch';
    if (mood === Mood.HUNGRY) return 'animate-shake';
    if (mood !== Mood.DEAD) return 'animate-breathing';
    return '';
  };

  // Calculating health bar color based on vitality
  const getHealthColor = (): string => {
    if (health === 0) return 'bg-blood-red';
    if (health <= 50) return 'bg-blood-red';
    return 'bg-ghostly-blue';
  };

  return (
    <div className="flex flex-col h-full bg-gameboy-green border-2 border-ghostly-blue">
      {/* The crypt keeper's header */}
      <div className="px-3 py-2 border-b-2 border-ghostly-blue bg-black bg-opacity-30">
        <h2 className="text-ghostly-blue text-sm font-bold pixelated">
          💀 NECRO-PET STATUS 💀
        </h2>
        <p className="text-ghostly-blue text-xs opacity-75 pixelated">
          Stage: {stageName}
        </p>
      </div>

      {/* The manifestation chamber */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
        {/* The pet's visual form - pixel art summoned from the void */}
        <div 
          className={`flex items-center justify-center ${getAnimationClass()}`} 
          style={{ imageRendering: 'pixelated' }}
        >
          {visual}
        </div>

        {/* The mood whisper */}
        <div className="text-ghostly-blue text-xs text-center opacity-75 pixelated">
          {moodDesc}
        </div>

        {/* The vital statistics */}
        <div className="w-full max-w-xs space-y-3">
          {/* Health bar - the life force */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-ghostly-blue text-xs font-bold pixelated">
                ❤️ HEALTH
              </span>
              <span className="text-ghostly-blue text-xs pixelated">
                {health}/100
              </span>
            </div>
            <div className="w-full h-4 bg-black bg-opacity-40 border border-ghostly-blue border-opacity-50">
              <div
                className={`h-full ${getHealthColor()} transition-all duration-300`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          {/* XP bar - the accumulated essence */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-ghostly-blue text-xs font-bold pixelated">
                ✨ ESSENCE (XP)
              </span>
              <span className="text-ghostly-blue text-xs pixelated">
                {xp}
              </span>
            </div>
            <div className="w-full px-2 py-1 bg-black bg-opacity-40 border border-ghostly-blue border-opacity-50">
              <div className="text-ghostly-blue text-xs text-center pixelated">
                {xp <= 10 ? 'Embryonic' : xp <= 50 ? 'Growing' : 'Ascended'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The bottom whisper */}
      <div className="px-3 py-1 border-t-2 border-ghostly-blue bg-black bg-opacity-30">
        <p className="text-ghostly-blue text-xs opacity-50 pixelated text-center">
          {stage === Stage.GHOST
            ? '💀 Your companion has perished... 💀'
            : '🕯️ Feed it with your code... 🕯️'}
        </p>
      </div>
    </div>
  );
};
