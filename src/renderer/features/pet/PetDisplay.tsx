// The Pet Display - where our necromantic companion manifests...
import React from 'react';
import { usePetStore, Stage, Mood } from './petStore';

export interface PetDisplayProps {
  // No props - reads from the crypt directly
}

// Summoning the appropriate visual for each evolutionary stage
const getStageVisual = (stage: Stage, mood: Mood): string => {
  if (stage === Stage.GHOST) {
    return '👻';
  }
  
  switch (stage) {
    case Stage.EGG:
      return mood === Mood.HAPPY ? '🥚' : '🪺';
    case Stage.LARVA:
      return mood === Mood.HAPPY ? '🐛' : '🪱';
    case Stage.BEAST:
      return mood === Mood.HAPPY ? '🐉' : '🦎';
    default:
      return '❓';
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
  // Channeling the pet's essence from the store
  const { health, xp, stage, mood } = usePetStore();

  // Determining the visual manifestation
  const visual = getStageVisual(stage, mood);
  const stageName = getStageName(stage);
  const moodDesc = getMoodDescription(mood);

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
        {/* The pet's visual form */}
        <div className="text-8xl pixelated animate-pulse">
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
