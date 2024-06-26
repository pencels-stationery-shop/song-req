import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { RootState } from "./store";
import { AUTH_PARAMS } from "./auth";
import { setDisableWhenOffline, setOnline } from "./store/twitchSlice";
import { queueRequest, removeRequest } from "./store/spotifySlice";
import { SpotifyClient } from "./api/spotify";
import { TwitchAuthProvider } from "./auth/twitch";

export default function Listener() {
  const dispatch = useDispatch();
  const { userId, rewardId, disableWhenOffline, online } = useSelector(
    (state: RootState) => state.settings.twitch
  );
  const twitchToken = useSelector(
    (state: RootState) => state.connections.twitch?.token
  );
  const spotifyToken = useSelector(
    (state: RootState) => state.connections.spotify?.token
  );

  const spotifyClient = useMemo(
    () => (spotifyToken ? new SpotifyClient(spotifyToken) : null),
    [spotifyToken]
  );
  const twitchClient = useMemo(() => {
    if (!twitchToken) return null;
    const authProvider = new TwitchAuthProvider(
      AUTH_PARAMS.twitch.clientId,
      twitchToken
    );
    return new ApiClient({ authProvider });
  }, [twitchToken]);

  const [listener, setListener] = useState<EventSubWsListener | null>(null);

  useEffect(() => {
    if (!(userId && twitchClient)) {
      return;
    }

    const listener = new EventSubWsListener({ apiClient: twitchClient });
    const onlineListener = listener.onStreamOnline(userId, () =>
      dispatch(setOnline(true))
    );
    const offlineListener = listener.onStreamOffline(userId, () =>
      dispatch(setOnline(false))
    );
    let redeemListener:
      | ReturnType<EventSubWsListener["onChannelRedemptionAddForReward"]>
      | undefined;

    if (
      userId &&
      rewardId &&
      spotifyClient &&
      (online || !disableWhenOffline)
    ) {
      redeemListener = listener.onChannelRedemptionAddForReward(
        userId,
        rewardId,
        async (data) => {
          // Persist our request in case we need to replay it
          dispatch(
            queueRequest({
              id: data.id,
              query: data.input,
            })
          );

          const trackId = await spotifyClient.queryToTrackId(data.input);
          await spotifyClient.appendTrackToQueue(trackId);
          dispatch(removeRequest(data.id));
        }
      );
    }

    listener.start();
    setListener(listener);
    return () => {
      onlineListener.stop();
      offlineListener.stop();
      redeemListener?.stop();
      listener.stop();
    };
  }, [
    disableWhenOffline,
    dispatch,
    online,
    rewardId,
    spotifyClient,
    twitchClient,
    userId,
  ]);

  const enabled = !!listener && (online || !disableWhenOffline);
  return (
    <div className="p-3 rounded bg-gray-800 text-white grid gap-2">
      <div>
        {enabled ? (
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="red"
              className="w-6 h-6 animate-pulse"
            >
              <path d="M9 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              <path
                fillRule="evenodd"
                d="M9.68 5.26a.75.75 0 0 1 1.06 0 3.875 3.875 0 0 1 0 5.48.75.75 0 1 1-1.06-1.06 2.375 2.375 0 0 0 0-3.36.75.75 0 0 1 0-1.06Zm-3.36 0a.75.75 0 0 1 0 1.06 2.375 2.375 0 0 0 0 3.36.75.75 0 1 1-1.06 1.06 3.875 3.875 0 0 1 0-5.48.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M11.89 3.05a.75.75 0 0 1 1.06 0 7 7 0 0 1 0 9.9.75.75 0 1 1-1.06-1.06 5.5 5.5 0 0 0 0-7.78.75.75 0 0 1 0-1.06Zm-7.78 0a.75.75 0 0 1 0 1.06 5.5 5.5 0 0 0 0 7.78.75.75 0 1 1-1.06 1.06 7 7 0 0 1 0-9.9.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            Enabled
          </div>
        ) : (
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="gray"
              className="w-6 h-6"
            >
              <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l4.782 4.783a1 1 0 0 0 .935.935l4.783 4.782a.75.75 0 1 0 1.06-1.06L8.998 7.937a1 1 0 0 0-.935-.935L3.28 2.22ZM3.05 12.95a7.003 7.003 0 0 1-1.33-8.047L2.86 6.04a5.501 5.501 0 0 0 1.25 5.849.75.75 0 1 1-1.06 1.06ZM5.26 10.74a3.87 3.87 0 0 1-1.082-3.38L5.87 9.052c.112.226.262.439.45.627a.75.75 0 1 1-1.06 1.061ZM12.95 3.05a7.003 7.003 0 0 1 1.33 8.048l-1.14-1.139a5.501 5.501 0 0 0-1.25-5.848.75.75 0 0 1 1.06-1.06ZM10.74 5.26a3.87 3.87 0 0 1 1.082 3.38L10.13 6.948a2.372 2.372 0 0 0-.45-.627.75.75 0 0 1 1.06-1.061Z" />
            </svg>
            Disabled
          </div>
        )}
      </div>
      <div className="flex gap-2 text-sm">
        <input
          type="checkbox"
          id="disable-when-offline"
          checked={disableWhenOffline}
          onChange={(e) => {
            dispatch(setDisableWhenOffline(e.target.checked));
          }}
        />
        <label htmlFor="disable-when-offline">Disable when offline</label>
      </div>
    </div>
  );
}
