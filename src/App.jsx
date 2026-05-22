import React, { useState, useEffect } from 'react';
import { authenticate, getRecommendations, createPlaylist, sdk } from './lib/spotify';
import SegmentBuilder from './components/SegmentBuilder';
import SongRecommendations from './components/SongRecommendations';
import TimelineBar from './components/TimelineBar';
import { Activity } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [pinnedGenres, setPinnedGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [playlistName, setPlaylistName] = useState('My Pacemakr Workout');

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Attempt authentication on mount
    authenticate()
      .then((authResponse) => {
        if (authResponse && authResponse.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error("Authentication failed:", err);
      });
  }, []);

  const handleSearch = async (bpm, genres, searchTerms) => {
    if (!genres || genres.length === 0) {
      showToast("Please select at least one genre.", "error");
      return;
    }
    try {
      const tracks = await getRecommendations(bpm, genres, searchTerms);
      setRecommendations(tracks);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch recommendations.", "error");
    }
  };

  const handleAddTrack = (track) => {
    setPlaylist([...playlist, track]);
  };

  const handleRemoveTrack = (indexToRemove) => {
    setPlaylist(playlist.filter((_, i) => i !== indexToRemove));
  };

  const handleReorderTrack = (dragIndex, dropIndex) => {
    const newPlaylist = [...playlist];
    const [draggedItem] = newPlaylist.splice(dragIndex, 1);
    newPlaylist.splice(dropIndex, 0, draggedItem);
    setPlaylist(newPlaylist);
  };

  const handleSavePlaylist = async () => {
    if (playlist.length === 0) return;
    setIsSaving(true);
    try {
      // Get current user profile if we don't have it
      // The SDK's authenticate method returns an auth object, but we need the user ID.
      // We can get the user ID using sdk.currentUser.profile()
      const profile = await sdk.currentUser.profile();

      const uris = playlist.map(t => t.uri);
      await createPlaylist(profile.id, playlistName, uris);

      showToast("Playlist saved successfully!", "success");
      setPlaylist([]); // Clear after saving
    } catch (err) {
      console.error(err);
      showToast("Failed to save playlist.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPlaylist([]);
    setRecommendations([]);
  };

  const DeprecationBanner = () => (
    <div className="deprecation-banner">
      Pacemakr is now running with mock up data,{' '}
      <a href="https://developer.spotify.com/documentation/web-api/reference/get-recommendations" target="_blank" rel="noreferrer">
        it is no longer working due to changes to the Spotify API in Feb 2026
      </a>.
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <DeprecationBanner />
        <div style={{ textAlign: 'center' }}>
          <Activity size={64} color="var(--accent-color)" style={{ marginBottom: 24 }} />
          <h1 className="header-title">Pacemakr</h1>
          <p style={{ marginBottom: 32, fontSize: '1.2rem' }}>Create dynamic workout playlists based on BPM.</p>
          <button className="btn btn-primary" onClick={() => {
            authenticate().then(res => {
              if (res.authenticated) setIsAuthenticated(true);
            });
          }}>
            Connect with <span style={{ textDecoration: 'line-through', margin: '0 4px' }}>Spotify</span> MockUp
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <DeprecationBanner />
        <header className="header" style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={handleLogout}
          >
            Logout
          </button>
          <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Activity size={40} color="var(--accent-color)" />
            Pacemakr
          </h1>
          <p>Build your perfect workout sequence.</p>
        </header>

        <div className="grid-layout">
          <div>
            <SegmentBuilder
              onSearch={handleSearch}
              pinnedGenres={pinnedGenres}
              setPinnedGenres={setPinnedGenres}
              onError={showToast}
            />

            {playlist.length > 0 && (
              <div className="glass-panel" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Save to Spotify</h3>
                <div className="input-group">
                  <label className="input-label">Playlist Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={handleSavePlaylist}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : `Save ${playlist.length} Tracks`}
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => setPlaylist([])}
                >
                  Clear Playlist
                </button>
              </div>
            )}
          </div>

          <div>
            <SongRecommendations
              tracks={recommendations}
              onAddTrack={handleAddTrack}
              playlistUris={playlist.map(t => t.uri)}
            />
          </div>
        </div>
      </div>

      {playlist.length > 0 && (
        <TimelineBar
          playlist={playlist}
          onRemoveTrack={handleRemoveTrack}
          onReorderTrack={handleReorderTrack}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;
