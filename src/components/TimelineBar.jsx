import React from 'react';
import { formatDuration, getBpmColor } from '../utils/color';

export default function TimelineBar({ playlist }) {
  const totalDuration = playlist.reduce((acc, track) => acc + track.duration_ms, 0);

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <span className="timeline-title">Playlist Timeline</span>
        <span className="timeline-title" style={{ color: 'var(--text-primary)' }}>
          {formatDuration(totalDuration)}
        </span>
      </div>
      <div className="timeline-bar">
        {playlist.map((track, i) => {
          // Calculate percentage width relative to total duration
          const widthPercent = totalDuration > 0 ? (track.duration_ms / totalDuration) * 100 : 0;
          const color = getBpmColor(track.bpm);
          
          return (
            <div 
              key={`${track.id}-${i}`}
              className="timeline-segment"
              style={{ 
                width: `${widthPercent}%`, 
                backgroundColor: color 
              }}
              title={`${track.name} - ${track.bpm} BPM`}
            />
          );
        })}
      </div>
    </div>
  );
}
