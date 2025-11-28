// Summoning the atmospheric effects from the digital ether...
import React from 'react';
import { usePetStore } from '../pet/petStore';

// The WeatherOverlay - a spectral layer that manifests weather phenomena
export const WeatherOverlay: React.FC = () => {
  // Subscribing to the world's atmospheric conditions
  const weather = usePetStore((state) => state.weather);
  const isNight = usePetStore((state) => state.isNight);

  // Rendering rain droplets - tears from the digital heavens
  const renderRain = () => {
    const droplets = [];
    for (let i = 0; i < 50; i++) {
      droplets.push(
        <div
          key={`rain-${i}`}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`
          }}
        />
      );
    }
    return droplets;
  };

  // Rendering snowflakes - frozen souls descending
  const renderSnow = () => {
    const flakes = [];
    for (let i = 0; i < 30; i++) {
      flakes.push(
        <div
          key={`snow-${i}`}
          className="snow-flake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      );
    }
    return flakes;
  };

  // Rendering storm effects - rain with lightning flashes
  const renderStorm = () => {
    return (
      <>
        {renderRain()}
        <div className="lightning-flash" />
      </>
    );
  };

  return (
    <div className="weather-overlay">
      {/* The night veil - darkness descends */}
      {isNight && <div className="night-overlay" />}
      
      {/* Weather manifestations */}
      {weather === 'RAIN' && <div className="rain-container">{renderRain()}</div>}
      {weather === 'SNOW' && <div className="snow-container">{renderSnow()}</div>}
      {weather === 'STORM' && <div className="storm-container">{renderStorm()}</div>}
      
      {/* Embedded CSS for weather animations */}
      <style>{`
        .weather-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }

        /* Night overlay - the darkness that falls */
        .night-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: brightness(0.7);
        }

        /* Rain container */
        .rain-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Rain droplet - a single tear from the sky */
        .rain-drop {
          position: absolute;
          top: -10px;
          width: 2px;
          height: 20px;
          background: linear-gradient(to bottom, transparent, #4a9eff);
          animation: rain-fall linear infinite;
        }

        @keyframes rain-fall {
          to {
            transform: translateY(100vh);
          }
        }

        /* Snow container */
        .snow-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Snowflake - a frozen soul */
        .snow-flake {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.8;
          animation: snow-fall linear infinite;
        }

        @keyframes snow-fall {
          to {
            transform: translateY(100vh) translateX(20px);
          }
        }

        /* Storm container */
        .storm-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Lightning flash - the storm gods' fury */
        .lightning-flash {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          opacity: 0;
          animation: lightning 4s infinite;
        }

        @keyframes lightning {
          0%, 100% {
            opacity: 0;
          }
          10%, 12% {
            opacity: 0.8;
          }
          11% {
            opacity: 0;
          }
          50%, 52% {
            opacity: 0.6;
          }
          51% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
