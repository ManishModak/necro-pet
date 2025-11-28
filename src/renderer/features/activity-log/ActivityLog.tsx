// The Activity Log - where file spirits manifest in the séance chamber...
import React, { useEffect, useRef } from 'react';
import { useActivityLogStore } from './activityLogStore';

export interface ActivityLogProps {
  maxEntries?: number; // default: 50
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ maxEntries = 50 }) => {
  const entries = useActivityLogStore((state) => state.entries);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new spirits arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  // Format timestamp into a haunted readable format
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Get spooky icon for event type
  const getEventIcon = (type: 'file:changed' | 'file:added'): string => {
    return type === 'file:changed' ? '👻' : '🦇';
  };

  // Get spooky label for event type
  const getEventLabel = (type: 'file:changed' | 'file:added'): string => {
    return type === 'file:changed' ? 'DISTURBED' : 'SUMMONED';
  };

  return (
    <div className="flex flex-col h-full bg-gameboy-green border-2 border-ghostly-blue">
      {/* The crypt keeper's header */}
      <div className="px-3 py-2 border-b-2 border-ghostly-blue bg-black bg-opacity-30">
        <h2 className="text-ghostly-blue text-sm font-bold pixelated">
          📜 SPIRIT ACTIVITY LOG 📜
        </h2>
        <p className="text-ghostly-blue text-xs opacity-75 pixelated">
          {entries.length} souls recorded
        </p>
      </div>

      {/* The scrollable crypt of file events */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 pixelated"
        style={{ scrollBehavior: 'smooth' }}
      >
        {entries.length === 0 ? (
          <div className="text-ghostly-blue text-xs opacity-50 text-center py-8">
            The crypt is silent... awaiting disturbances...
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-black bg-opacity-20 border border-ghostly-blue border-opacity-30 p-2 hover:border-opacity-60 transition-all"
            >
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">
                  {getEventIcon(entry.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blood-red text-xs font-bold">
                      {getEventLabel(entry.type)}
                    </span>
                    <span className="text-ghostly-blue text-xs opacity-60">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <div className="text-ghostly-blue text-xs break-all">
                    {entry.path}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* The bottom border of the crypt */}
      <div className="px-3 py-1 border-t-2 border-ghostly-blue bg-black bg-opacity-30">
        <p className="text-ghostly-blue text-xs opacity-50 pixelated text-center">
          {entries.length >= maxEntries
            ? '⚠️ Crypt at capacity - oldest spirits will be exorcised'
            : 'Monitoring the veil between worlds...'}
        </p>
      </div>
    </div>
  );
};
