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
  name: string;
  artists: Artist[];
  duration_ms: number;
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

  async queryToTrackId(query: string): Promise<string> {
    if (query.startsWith("https://open.spotify.com/track/")) {
      const url = new URL(query);
      return url.pathname.split("/")[2];
    }

    const response = await this.fetch(
      "/search?" + new URLSearchParams({ q: query, type: "track", limit: "1" })
    );
    const body = await response.json();
    return body.tracks.items[0]?.id;
  }

  async appendTrackToQueue(trackId: string) {
    await this.fetch(
      "/me/player/queue?" +
        new URLSearchParams({ uri: `spotify:track:${trackId}` }),
      { method: "POST" }
    );
  }
}
