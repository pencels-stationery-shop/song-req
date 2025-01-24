import { refreshAuthToken } from "../auth";

export const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export interface SpotifyUser {
  display_name: string;
  images: ImageData[];
}

export interface ImageData {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyPlayback {
  progress_ms?: number;
  item?: SpotifyTrack;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Artist[];
  duration_ms: number;
  album: Album;
}

export interface Album {
  images: ImageData[];
}

export interface Artist {
  name: string;
}

export class SpotifyClient {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(SPOTIFY_API_URL + endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...options?.headers,
      },
    });
    if (response.status == 401) {
      refreshAuthToken("spotify");
    }
    if (!response.ok) {
      const body = await response.json();
      throw new Error(
        `Spotify API call failed (${response.status}): ${JSON.stringify(body)}`
      );
    }
    return response;
  }

  public async getUserInfo(): Promise<SpotifyUser> {
    const response = await this.fetch("/me");
    return await response.json();
  }

  public async getPlayback(): Promise<SpotifyPlayback | null> {
    const response = await this.fetch("/me/player");
    if (response.status == 200) {
      return await response.json();
    } else {
      return null;
    }
  }

  async getTrackInfo(id: string): Promise<SpotifyTrack> {
    const response = await this.fetch(`/tracks/${id}`);
    return await response.json();
  }

  async queryToTrack(query: string): Promise<SpotifyTrack> {
    if (query.startsWith("https://open.spotify.com/track/")) {
      const url = new URL(query);
      return await this.getTrackInfo(url.pathname.split("/")[2]);
    }

    const response = await this.fetch(
      "/search?" + new URLSearchParams({ q: query, type: "track", limit: "1" })
    );
    const body = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to queue song: ${JSON.stringify(body)}`);
    }
    return body.tracks.items[0];
  }

  async appendTrackToQueue(trackId: string) {
    const response = await this.fetch(
      "/me/player/queue?" +
        new URLSearchParams({ uri: `spotify:track:${trackId}` }),
      { method: "POST" }
    );
    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Failed to queue song: ${JSON.stringify(body)}`);
    }
  }
}
