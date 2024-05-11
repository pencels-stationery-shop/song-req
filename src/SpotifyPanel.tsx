import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setToken } from "./store/connectionsSlice";
import { getImplicitGrantUrl } from "./auth";
import SongStatus from "./SongStatus";

interface SpotifyUser {
  display_name: string;
  images: ImageData[];
}

interface ImageData {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyPlayback {
  progress_ms?: number;
  item?: SpotifyTrack;
}

interface SpotifyTrack {
  name: string;
  artists: Artist[];
  duration_ms: number;
}

interface Artist {
  name: string;
}

function SpotifyPanel() {
  const token = useSelector((state: RootState) => state.connections.spotify);
  const dispatch = useDispatch();

  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null);

  useEffect(() => {
    async function updateUserInfo() {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await response.json();
      setUser(body);
    }
    updateUserInfo();
  }, [token]);

  useEffect(() => {
    async function getPlayback() {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await response.json();
      setPlayback(body);
    }

    if (token) {
      const intervalId = setInterval(() => {
        getPlayback();
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setPlayback(null);
    }
  }, [token]);

  const profile_url = user?.images?.[0]?.url;

  return (
    <div className="flex flex-col p-4 rounded bg-green-800 text-white">
      {token ? (
        <div className="flex flex-col gap-2">
          <div>Connected to Spotify</div>
          {user && (
            <div className="flex gap-2">
              {profile_url ? (
                <img src={profile_url} className="w-6 h-6 rounded-full" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <p>{user.display_name}</p>
            </div>
          )}
          {playback && <SongStatus playback={playback} />}
          <button
            className="rounded px-3 py-2 bg-emerald-950/50"
            onClick={() => {
              dispatch(setToken({ service: "spotify", token: undefined }));
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <a
          className="inline-block rounded px-3 py-2 bg-emerald-600"
          href={getImplicitGrantUrl("spotify")}
        >
          Connect with Spotify
        </a>
      )}
    </div>
  );
}

export default SpotifyPanel;
