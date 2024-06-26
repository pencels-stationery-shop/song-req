import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { disconnect } from "./store/connectionsSlice";
import { getImplicitGrantUrl } from "./auth";
import SongStatus from "./SongStatus";
import { SpotifyClient, SpotifyPlayback, SpotifyUser } from "./api/spotify";

function SpotifyPanel() {
  const token = useSelector(
    (state: RootState) => state.connections.spotify?.token
  );
  const dispatch = useDispatch();

  const client = useMemo(
    () => (token ? new SpotifyClient(token) : null),
    [token]
  );

  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null);

  useEffect(() => {
    if (client) {
      client.getUserInfo().then(setUser);
      const playbackTimer = setInterval(() => {
        client.getPlayback().then(setPlayback);
      }, 1000);

      return () => {
        clearInterval(playbackTimer);
      };
    } else {
      setUser(null);
      setPlayback(null);
    }
  }, [client]);

  const profile_url = user?.images?.[0]?.url;

  return (
    <div className="flex flex-col p-4 rounded bg-green-800 text-white">
      {token ? (
        <div className="flex flex-col h-full justify-between gap-3">
          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-2">Connected to Spotify</div>
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
            </div>
            {<SongStatus playback={playback} />}
          </div>
          <div>
            <button
              className="rounded px-3 py-2 bg-emerald-950/50"
              onClick={() => {
                dispatch(disconnect("spotify"));
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div>
          <a
            className="rounded px-3 py-2 bg-emerald-950/50"
            href={getImplicitGrantUrl("spotify")}
          >
            Connect with Spotify
          </a>
        </div>
      )}
    </div>
  );
}

export default SpotifyPanel;
