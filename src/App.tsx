import TwitchPanel from "./TwitchPanel";
import SpotifyPanel from "./SpotifyPanel";
import Listener from "./Listener";

function App() {
  return (
    <div className="container lg:max-w-4xl md:max-w-2xl mx-auto p-2 flex flex-col gap-2">
      <Listener />
      <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-2">
        <TwitchPanel />
        <SpotifyPanel />
      </div>
      <div className="lg:mt-3 mx-auto p-3 prose prose-invert prose-sm">
        <h2>How do I use this?</h2>
        <ol>
          <li>
            Click "Connect with Twitch" and "Connect with Spotify" to connect
            and authorize this app.
          </li>
          <li>
            Select the Twitch channel point redeem to use for song requests.
          </li>
          <li>Leave this page open.</li>
          <li>You now have automatic song request redeems!</li>
        </ol>
        <h2>How it works</h2>
        <p>
          At a high level, this app listens for redemption events from your
          Twitch channel, looks up a song on Spotify based off the redemption
          input text, then adds that song to your Spotify queue.
        </p>
        <p>
          This all happens locally in your browser. There is no server
          component, so song redeem functionality goes away once you close this
          page.
        </p>
      </div>
    </div>
  );
}

export default App;
