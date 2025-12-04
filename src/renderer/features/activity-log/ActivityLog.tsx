// The Activity Log - where file spirits manifest in the séance chamber...
import React, { useEffect, useRef } from 'react';
import { useActivityLogStore } from './activityLogStore';

export interface ActivityLogProps {
  maxEntries?: number; // default: 50
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ maxEntries = 50 }) => {
  const entries = useActivityLogStore((state) => state.entries);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHistorical, setShowHistorical] = React.useState(false);

  // Auto-scroll to the top when new spirits arrive (newest first)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries]);

  // Format timestamp into a haunted readable format with date
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}:${seconds}`;
  };

  // Get spooky icon for event type
  const getEventIcon = (type: 'commit' | 'resurrection' | 'feed' | 'resurrect'): string => {
    switch (type) {
      case 'commit': return '🔮';
      case 'resurrection': return '⚡';
      case 'feed': return '🍖';
      case 'resurrect': return '⚡';
      default: return '🔮';
    }
  };

  // Get spooky label for event type
  const getEventLabel = (type: 'commit' | 'resurrection' | 'feed' | 'resurrect'): string => {
    switch (type) {
      case 'commit': return 'PET FED';
      case 'resurrection': return 'PET RESURRECTED';
      case 'feed': return 'PET FED';
      case 'resurrect': return 'PET RESURRECTED';
      default: return 'PET FED';
    }
  };

  // Get formatted path/message
  const getDisplayPath = (path: string): string => {
    // Remove prefixes
    return path.replace('HISTORY: ', '').replace('FED: ', '').replace('RESURRECTED: ', '');
  };

  // Separate current session entries from historical
  const currentSessionEntries = entries.filter(e => !e.path.startsWith('HISTORY:'));
  const historicalEntries = entries.filter(e => e.path.startsWith('HISTORY:'));

  // Display current session entries newest-first
  const displayCurrentEntries = [...currentSessionEntries].reverse();

  // Historical entries are ALREADY newest-first from store (don't reverse!)
  const displayHistoricalEntries = historicalEntries;

  return (
    <div className="flex flex-col h-full bg-crypt-dark border-2 border-terminal-green glow-border">
      {/* The crypt keeper's header */}
      <div className="px-2 py-1 border-b-2 border-terminal-green bg-panel-bg">
        <h2 className="text-terminal-green text-xs font-bold pixelated text-glow whitespace-nowrap">
          📜 ACTIVITY LOG
        </h2>
        <p className="text-terminal-green text-xs pixelated">
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
          <div className="text-terminal-green text-xs text-center py-8">
            The crypt is silent... awaiting disturbances...
          </div>
        ) : (
          <>
            {/* Display CURRENT SESSION entries (newest first) */}
            {displayCurrentEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-panel-bg border border-terminal-green border-opacity-50 p-2 hover:border-opacity-100 transition-all"
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
                      <span className="text-terminal-green text-xs">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                    <div className="text-terminal-green text-xs break-all">
                      {getDisplayPath(entry.path)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CLICKABLE BANNER for historical commits (at bottom) */}
            {historicalEntries.length > 0 && (
              <>
                <div
                  onClick={() => setShowHistorical(!showHistorical)}
                  className="text-terminal-green text-xs text-center py-3 px-2 border border-terminal-green border-opacity-50 bg-panel-bg hover:border-opacity-100 cursor-pointer transition-all mt-2"
                >
                  <div className="opacity-50">═══════════════════════════════</div>
                  <div className="py-1 flex items-center justify-center gap-2">
                    <span className="text-blood-red">📚</span>
                    <span>{historicalEntries.length} older commit{historicalEntries.length !== 1 ? 's' : ''} from history</span>
                    <span className="text-blood-red">{showHistorical ? '▼' : '▶'}</span>
                  </div>
                  <div className="opacity-50">═══════════════════════════════</div>
                  <div className="text-xs opacity-70 mt-1">
                    {showHistorical ? 'Click to collapse' : 'Click to expand'}
                  </div>
                </div>

                {/* Display HISTORICAL commits when expanded (newest first) */}
                {showHistorical && displayHistoricalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-panel-bg border border-terminal-green border-opacity-30 p-2 hover:border-opacity-60 transition-all opacity-80"
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
                          <span className="text-terminal-green text-xs">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>
                        <div className="text-terminal-green text-xs break-all">
                          {getDisplayPath(entry.path)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* The bottom border of the crypt */}
      <div className="px-3 py-1 border-t-2 border-terminal-green bg-panel-bg">
        <p className="text-terminal-green text-xs pixelated text-center">
          {entries.length >= maxEntries
            ? '⚠️ Crypt at capacity - oldest spirits will be exorcised'
            : 'Monitoring the veil between worlds...'}
        </p>
      </div>
    </div>
  );
};
