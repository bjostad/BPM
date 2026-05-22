// Mock SDK object to satisfy App.jsx dependencies
export const sdk = {
  currentUser: {
    profile: async () => ({ id: 'mock_user_123' })
  }
};

export const authenticate = async () => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 500));
  return { authenticated: true };
};

export const getRecommendations = async (bpm, genres) => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));
  
  // Generate 20 mock tracks
  const mockTracks = Array.from({ length: 20 }).map((_, i) => {
    const id = Math.random().toString(36).substring(7);
    const simulatedBpm = bpm + (Math.floor(Math.random() * 11) - 5);
    const duration = Math.floor(Math.random() * (240000 - 120000) + 120000); // 2 to 4 mins
    
    // Pick a random vibrant album cover from Unsplash
    const covers = [
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300&h=300'
    ];
    const coverUrl = covers[Math.floor(Math.random() * covers.length)];
    
    return {
      id: id,
      uri: `spotify:track:${id}`,
      name: `Mock Track ${Math.floor(Math.random() * 1000)}`,
      artists: [{ name: `Mock Artist ${Math.floor(Math.random() * 100)}` }],
      duration_ms: duration,
      bpm: simulatedBpm,
      album: {
        images: [
          { url: coverUrl },
          { url: coverUrl },
          { url: coverUrl }
        ]
      }
    };
  });
  
  return mockTracks;
};

// Expose a helper to get available genres
export const getAvailableGenres = async () => {
  return [
    "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal",
    "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop",
    "chicago-house", "children", "chill", "classical", "club", "comedy", "country",
    "dance", "dancehall", "death-metal", "deep-house", "disco", "disney", "drum-and-bass",
    "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french",
    "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge",
    "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop",
    "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial",
    "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin",
    "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno",
    "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm",
    "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock",
    "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock",
    "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes",
    "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish",
    "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop",
    "turkish", "work-out", "world-music"
  ];
};

// Create a playlist and add tracks
export const createPlaylist = async (userId, name, uris) => {
  await new Promise(r => setTimeout(r, 1000));
  console.log(`Created mock playlist "${name}" for user ${userId} with ${uris.length} tracks.`);
  return { id: 'mock_playlist_id' };
};
