import React, { useState } from 'react';
import { formatDuration, getBpmColor } from '../utils/color';

export default function TimelineBar({ playlist, onRemoveTrack, onReorderTrack }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const totalDuration = playlist.reduce((acc, track) => acc + track.duration_ms, 0);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data to drag
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderTrack(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <span className="timeline-title">Playlist Timeline</span>
        <span className="timeline-title" style={{ color: 'var(--text-primary)' }}>
          {formatDuration(totalDuration)}
        </span>
      </div>
      <div className="timeline-bar">
        {(() => {
          let currentSectionTime = 0;
          
          return playlist.map((track, i) => {
            const nextTrack = playlist[i + 1];
            const isNextSameSection = nextTrack && Math.abs(nextTrack.bpm - track.bpm) <= 5;
            
            currentSectionTime += track.duration_ms;
            
            const isEndOfSection = !isNextSameSection;
            const sectionDurationToDisplay = isEndOfSection ? currentSectionTime : null;
            
            if (isEndOfSection) {
              // reset for the next section
              currentSectionTime = 0;
            }

            // Calculate percentage width relative to total duration
            const widthPercent = totalDuration > 0 ? (track.duration_ms / totalDuration) * 100 : 0;
            const color = getBpmColor(track.bpm);
            
            return (
              <div 
                key={`${track.id}-${i}`}
                className={`timeline-segment group ${dragOverIndex === i ? 'drag-over' : ''} ${draggedIndex === i ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                style={{ 
                  width: `${widthPercent}%`, 
                  backgroundColor: color 
                }}
              >
                {sectionDurationToDisplay && (
                  <div 
                    className="timeline-section-duration"
                    style={{ backgroundColor: color }}
                  >
                    {formatDuration(sectionDurationToDisplay)}
                  </div>
                )}
                <span className="timeline-segment-bpm">{track.bpm}</span>
                <span className="timeline-segment-time">{formatDuration(track.duration_ms)}</span>

                <div className="timeline-tooltip">
                  <div className="tooltip-content">
                    <img 
                      src={track.album.images[2]?.url || track.album.images[0]?.url} 
                      alt="" 
                      className="tooltip-cover" 
                    />
                    <div className="tooltip-info">
                      <div className="tooltip-title">{track.name}</div>
                      <div className="tooltip-artist">{track.artists.map(a => a.name).join(', ')}</div>
                      <div className="tooltip-meta">
                        <span>{track.bpm} BPM</span>
                        <span>{formatDuration(track.duration_ms)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="tooltip-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(i);
                    }}
                  >
                    Remove from Playlist
                  </button>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
