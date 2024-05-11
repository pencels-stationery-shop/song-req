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
    (state: RootState) => state.connections.twitch
  );
  const spotifyToken = useSelector(
    (state: RootState) => state.connections.spotify
  );

  const [listener, setListener] = useState<EventSubWsListener | null>(null);

  useEffect(() => {
    if (!(userId && rewardId && twitchToken && spotifyToken)) {
      setListener(null);
      return;
    }

    console.log(userId, rewardId, twitchToken, spotifyToken);

    const authProvider = new StaticAuthProvider(
      AUTH_PARAMS.twitch.clientId,
      twitchToken
    );
    const apiClient = new ApiClient({ authProvider });

    const listener = new EventSubWsListener({ apiClient });
    console.log(userId);
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
    <div className="p-3 rounded bg-gray-800 text-white flex justify-between">
      {listener ? "Active" : "Not Listening."}
    </div>
  );
}
