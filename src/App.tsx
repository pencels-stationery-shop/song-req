import TwitchPanel from "./TwitchPanel";
import SpotifyPanel from "./SpotifyPanel";
import Listener from "./Listener";

function App() {
  return (
    <div className="container mx-auto p-2 grid gap-2">
      <Listener />
      <div className="h-full lg:h-1/2 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-2">
        <TwitchPanel />
        <SpotifyPanel />
      </div>
    </div>
  );
}

export default App;
