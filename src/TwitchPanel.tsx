import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { ApiClient, HelixCustomReward, HelixUser } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { setRewardId, setUserId } from "./store/twitchSlice";
import { AUTH_PARAMS, getImplicitGrantUrl } from "./auth";
import { disconnect } from "./store/connectionsSlice";

export default function TwitchPanel() {
  const token = useSelector(
    (state: RootState) => state.connections.twitch?.token
  );
  const rewardId = useSelector(
    (state: RootState) => state.settings.twitch.rewardId
  );
  const online = useSelector(
    (state: RootState) => state.settings.twitch.online
  );
  const dispatch = useDispatch();

  const [user, setUser] = useState<HelixUser | null>(null);
  const [rewards, setRewards] = useState<HelixCustomReward[] | null>(null);

  useEffect(() => {
    if (!token) return;
    const accessToken = token;

    async function updateUserInfo() {
      const authProvider = new StaticAuthProvider(
        AUTH_PARAMS.twitch.clientId,
        accessToken
      );
      const apiClient = new ApiClient({ authProvider });
      const tokenInfo = await apiClient.getTokenInfo();
      const user = await apiClient.users.getUserById(tokenInfo.userId!);
      if (!user) {
        console.error("User does not exist for twitch token");
        return;
      }
      setUser(user);
      dispatch(setUserId(user.id));

      const rewards = await apiClient.channelPoints.getCustomRewards(user.id);
      setRewards(rewards);
    }
    updateUserInfo();
  }, [dispatch, token]);

  return (
    <div className="flex flex-col p-4 rounded bg-violet-900 text-white">
      {token ? (
        <div className="flex flex-col h-full gap-3 justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-1">Connected to Twitch</div>
              {user && (
                <div className="flex gap-2 items-center">
                  <img
                    src={user.profilePictureUrl}
                    className="w-6 h-6 rounded-full"
                  />
                  <p>{user.name}</p>
                  {online ? (
                    <div className="rounded text-xs px-1 py-0.5  bg-red-800">
                      <span className="relative">LIVE</span>
                    </div>
                  ) : (
                    <div className="rounded text-xs p-1 bg-neutral-900/50">
                      OFFLINE
                    </div>
                  )}
                </div>
              )}
            </div>
            {rewards && (
              <div className="flex flex-col">
                <label htmlFor="redeem-select" className="text-sm mb-1">
                  Select Song Redeem
                </label>
                <select
                  id="redeem-select"
                  className="p-1 rounded bg-violet-950"
                  value={rewardId}
                  onChange={(e) => dispatch(setRewardId(e.target.value))}
                >
                  {rewards.map((reward) => (
                    <option key={reward.id} value={reward.id}>
                      {reward.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <button
              className="rounded px-3 py-2 bg-violet-950/70"
              onClick={() => {
                dispatch(disconnect("twitch"));
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div>
          <a
            className="rounded px-3 py-2 bg-violet-950/70"
            href={getImplicitGrantUrl("twitch")}
          >
            Connect with Twitch
          </a>
        </div>
      )}
    </div>
  );
}
