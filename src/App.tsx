import { useDispatch, useSelector } from "react-redux";
import { getImplicitGrantUrl } from "./auth";
import { RootState } from "./store";
import { setToken } from "./store/connectionsSlice";

function App() {
  const connections = useSelector((state: RootState) => state.connections);
  const dispatch = useDispatch();
  return (
    <div className="container mx-auto h-full lg:h-1/2 p-2 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-2">
      <div className="bg-violet-900 p-3 rounded">
        {connections.twitch ? (
          <button
            className="rounded px-3 py-2 bg-violet-950/50"
            onClick={() => {
              dispatch(setToken({ service: "twitch", token: undefined }));
            }}
          >
            Disconnect
          </button>
        ) : (
          <a
            className="inline-block rounded px-3 py-2 bg-violet-700"
            href={getImplicitGrantUrl("twitch")}
          >
            Connect with Twitch
          </a>
        )}
      </div>
      <div className="bg-emerald-800 p-3 rounded">
        {connections.spotify ? (
          <button
            className="rounded px-3 py-2 bg-emerald-950/50"
            onClick={() => {
              dispatch(setToken({ service: "spotify", token: undefined }));
            }}
          >
            Disconnect
          </button>
        ) : (
          <a
            className="inline-block rounded px-3 py-2 bg-emerald-600"
            href={getImplicitGrantUrl("spotify")}
          >
            Connect with Spotify
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
