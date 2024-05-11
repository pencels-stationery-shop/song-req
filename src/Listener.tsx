import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { RootState } from "./store";
import { AUTH_PARAMS } from "./auth";

async function queryToTrackId(token: string, query: string): Promise<string> {
  if (query.startsWith("https://open.spotify.com/track/")) {
    const url = new URL(query);
    return url.pathname.split("/")[2];
  }

  const response = await fetch(
    "https://api.spotify.com/v1/search?" +
      new URLSearchParams({ q: query, type: "track", limit: "1" }),
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const body = await response.json();
  return body.tracks.items[0]?.id;
}

async function appendTrackToQueue(token: string, trackId: string) {
  await fetch(
    "https://api.spotify.com/v1/me/player/queue?" +
      new URLSearchParams({ uri: `spotify:track:${trackId}` }),
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
}

export default function Listener() {
  const { userId, rewardId } = useSelector(
    (state: RootState) => state.settings.twitch
  );
  const twitchToken = useSelector(
    (state: RootState) => state.connections.twitch?.token
  );
  const spotifyToken = useSelector(
    (state: RootState) => state.connections.spotify?.token
  );

  const [listener, setListener] = useState<EventSubWsListener | null>(null);

  useEffect(() => {
    if (!(userId && rewardId && twitchToken && spotifyToken)) {
      setListener(null);
      return;
    }

    const authProvider = new StaticAuthProvider(
      AUTH_PARAMS.twitch.clientId,
      twitchToken
    );
    const apiClient = new ApiClient({ authProvider });

    const listener = new EventSubWsListener({ apiClient });
    listener.onChannelRedemptionAddForReward(userId, rewardId, async (data) => {
      console.log(data);
      try {
        const trackId = await queryToTrackId(spotifyToken, data.input);
        await appendTrackToQueue(spotifyToken, trackId);
      } catch (e) {
        console.error(e);
      }
    });
    setListener(listener);

    listener.start();

    return () => {
      listener.stop();
    };
  }, [rewardId, spotifyToken, twitchToken, userId]);

  return (
    <div className="p-3 rounded bg-gray-800 text-white">
      {listener ? (
        <div className="flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M5.636 4.575a.75.75 0 0 1 0 1.061 9 9 0 0 0 0 12.728.75.75 0 1 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.75 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM9.879 8.818a.75.75 0 0 1 0 1.06 3 3 0 0 0 0 4.243.75.75 0 1 1-1.061 1.061 4.5 4.5 0 0 1 0-6.364.75.75 0 0 1 1.06 0Zm4.242 0a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 0 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.061ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
          Enabled
        </div>
      ) : (
        <div className="flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M2.47 2.47a.75.75 0 0 1 1.06 0l8.407 8.407a1.125 1.125 0 0 1 1.186 1.186l1.462 1.461a3.001 3.001 0 0 0-.464-3.645.75.75 0 1 1 1.061-1.061 4.501 4.501 0 0 1 .486 5.79l1.072 1.072a6.001 6.001 0 0 0-.497-7.923.75.75 0 0 1 1.06-1.06 7.501 7.501 0 0 1 .505 10.05l1.064 1.065a9 9 0 0 0-.508-12.176.75.75 0 0 1 1.06-1.06c3.923 3.922 4.093 10.175.512 14.3l1.594 1.594a.75.75 0 1 1-1.06 1.06l-2.106-2.105-2.121-2.122h-.001l-4.705-4.706a.747.747 0 0 1-.127-.126L2.47 3.53a.75.75 0 0 1 0-1.061Zm1.189 4.422a.75.75 0 0 1 .326 1.01 9.004 9.004 0 0 0 1.651 10.462.75.75 0 1 1-1.06 1.06C1.27 16.12.63 11.165 2.648 7.219a.75.75 0 0 1 1.01-.326ZM5.84 9.134a.75.75 0 0 1 .472.95 6 6 0 0 0 1.444 6.159.75.75 0 0 1-1.06 1.06A7.5 7.5 0 0 1 4.89 9.606a.75.75 0 0 1 .95-.472Zm2.341 2.653a.75.75 0 0 1 .848.638c.088.62.37 1.218.849 1.696a.75.75 0 0 1-1.061 1.061 4.483 4.483 0 0 1-1.273-2.546.75.75 0 0 1 .637-.848Z"
              clipRule="evenodd"
            />
          </svg>
          Disabled
        </div>
      )}
    </div>
  );
}
