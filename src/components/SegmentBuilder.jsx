import React, { useState, useEffect } from 'react';
import { getAvailableGenres } from '../lib/spotify';
import { Search, Pin } from 'lucide-react';

export default function SegmentBuilder({ onSearch, onError }) {
  const [bpm, setBpm] = useState(120);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('edm');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [song, setSong] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Fetch available genres on mount
    getAvailableGenres()
      .then(fetchedGenres => {
        if (Array.isArray(fetchedGenres)) {
          setGenres(fetchedGenres);
        } else {
          setErrorMsg('Invalid genres response: ' + JSON.stringify(fetchedGenres));
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(err.message || 'Error fetching genres');
      });
  }, []);

  const triggerSearch = (showWarning = true) => {
    const activeGenres = [selectedGenre].filter(Boolean);
    if (activeGenres.length === 0) {
      if (showWarning && onError) onError("Please select at least one genre.");
      return;
    }
    onSearch(bpm, activeGenres, { artist, album, song });
  };

  const handleSearch = () => triggerSearch(true);
  const handleSliderRelease = () => triggerSearch(false);

  return (
    <div className="glass-panel">
      <h2>Build Segment</h2>
      <p style={{ marginBottom: 24 }}>Set your target BPM and genre to find the right tracks.</p>

      <div className="input-group">
        <label className="input-label">Target BPM: {bpm}</label>
        <input
          type="range"
          min="50"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          style={{ accentColor: 'var(--accent-color)' }}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Seed Track / Song</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Enter Sandman"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Seed Artist</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Metallica"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Seed Album</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Black Album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Select Genre</label>
        {errorMsg && <div style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="input-field"
            style={{ flex: 1 }}
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">-- Choose a Genre --</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={handleSearch}>
        <Search size={18} /> Find Tracks
      </button>
    </div>
  );
}
