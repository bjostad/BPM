import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';

// We use Authorization Code with PKCE Flow
// Ensure that http://localhost:5173 is added to the Redirect URIs in your Spotify Developer Dashboard.
export const sdk = SpotifyApi.withUserAuthorization(
  clientId,
  'http://localhost:5173',
  ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private']
);

export const authenticate = async () => {
  return await sdk.authenticate();
};

// Expose a helper to easily fetch recommendations
export const getRecommendations = async (bpm, genres) => {
  const result = await sdk.recommendations.get({
    seed_genres: genres.slice(0, 5), // Maximum 5 seed values allowed by Spotify API
    target_tempo: bpm,
    limit: 50,
  });
  return result.tracks;
};

// Expose a helper to get available genres
export const getAvailableGenres = async () => {
  const result = await sdk.recommendations.availableGenreSeeds();
  return result.genres;
};

// Create a playlist and add tracks
export const createPlaylist = async (userId, name, uris) => {
  const playlist = await sdk.playlists.createPlaylist(userId, {
    name,
    public: false,
  });

  if (uris.length > 0) {
    // Add tracks in chunks of 100 (Spotify API limit)
    for (let i = 0; i < uris.length; i += 100) {
      await sdk.playlists.addItemsToPlaylist(playlist.id, uris.slice(i, i + 100));
    }
  }

  return playlist;
};
