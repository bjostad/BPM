import React from 'react';
import { formatDuration, getBpmColor } from '../utils/color';
import { Plus, Check } from 'lucide-react';

export default function SongRecommendations({ tracks, onAddTrack, playlistUris }) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <p>No tracks found. Try adjusting your BPM or genre.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: 24 }}>Recommendations</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tracks.map(track => {
          // Use Math.round to make BPM a whole number
          const bpmDisplay = 120; // Default if API doesn't return audio features immediately, but wait: recommendations don't have tempo attached directly in standard track object unless requested via audio features. Wait, the Spotify recommendations API actually returns regular track objects without audio features. But they match the target tempo. 
          // So we don't know the exact tempo unless we fetch audio features. We will just use the target BPM from context or display an estimated tag, or fetch audio features.
          // For now, let's just show track duration and an add button.
          const isAdded = playlistUris.includes(track.uri);

          return (
            <div 
              key={track.id} 
              className={`song-card ${isAdded ? 'selected' : ''}`}
              onClick={() => !isAdded && onAddTrack(track)}
            >
              <img 
                src={track.album.images[2]?.url || track.album.images[0]?.url} 
                alt={track.name} 
                className="song-cover"
              />
              <div className="song-info">
                <div className="song-title">{track.name}</div>
                <div className="song-artist">{track.artists.map(a => a.name).join(', ')}</div>
              </div>
              <div className="song-meta">
                <div className="song-bpm">{track.bpm} BPM</div>
                <span>{formatDuration(track.duration_ms)}</span>
                {isAdded ? (
                  <Check size={20} color="var(--accent-color)" />
                ) : (
                  <Plus size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
