import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { clearRequests } from "./store/spotifySlice";

function HistoryPanel() {
  const pendingRequests = useSelector(
    (state: RootState) => state.settings.spotify.pendingRequests
  );
  const fulfilledRequests = useSelector(
    (state: RootState) => state.settings.spotify.fulfilledRequests
  );
  const dispatch = useDispatch();

  const reversedPending = pendingRequests.slice().reverse();
  const reversedFullfilled = fulfilledRequests.slice().reverse();

  return (
    <div className="flex flex-col p-4 gap-y-3 rounded bg-teal-800 text-white">
      <div>Request History</div>
      {reversedPending.length + reversedFullfilled.length > 0 ? (
        <button
          className="rounded px-3 py-2 bg-teal-950/50"
          onClick={() => {
            dispatch(clearRequests());
          }}
        >
          Clear History
        </button>
      ) : (
        <p className="text-white/40">Waiting for requests...</p>
      )}
      {reversedPending.length > 0 && (
        <div>
          <div className="grid grid-cols-5 justify-between items-center mb-2">
            <div className="text-right col-span-2 ">Request Text</div>
            <div className="col-span-1 "></div>
            <div className="col-span-2 ">Failed with Error Message</div>
          </div>
          {reversedPending.map((req) => {
            const { query, error } = req;
            return (
              <div
                className="grid grid-cols-5 mb-3 justify-between items-center"
                key={req.id}
              >
                <div className="truncate text-right col-span-2 rounded px-3 py-2 bg-black/10">
                  "{query}"
                </div>
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-8 col-span-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
                <div className="col-span-2 overflow-x-scroll rounded px-3 py-2 bg-red-900/50">
                  <pre className="flex flex-row gap-2 font-mono ">{error}</pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {reversedFullfilled.length > 0 && (
        <div>
          <div className="grid grid-cols-5 justify-between items-center mb-2">
            <div className="text-right col-span-2 ">Request Text</div>
            <div className="col-span-1 "></div>
            <div className="col-span-2 ">Queued Song</div>
          </div>
          {reversedFullfilled.map((req) => {
            const { result, query } = req;
            if (!result) {
              return;
            }

            const images = result.album.images;
            const imgUrl = images && images[images.length - 1]?.url;

            return (
              <div
                className="grid grid-cols-5 mb-3 justify-between items-center"
                key={req.id}
              >
                <div className="truncate col-span-2 text-right rounded px-3 py-2 bg-black/10">
                  "{query}"
                </div>
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-8 col-span-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
                <div className="flex flex-row gap-3 col-span-2 rounded px-3 py-2 bg-black/10">
                  {imgUrl && (
                    <img
                      src={images[images.length - 1].url}
                      className="rounded"
                    />
                  )}
                  <div className="overflow-hidden basis-3/4">
                    <div className="truncate">{result.name}</div>
                    <div className="truncate text-white/70 text-sm">
                      {result.artists
                        .map((a) => a.name)
                        .reduce((acc, x) => acc + ", " + x)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
