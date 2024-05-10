import { getImplicitGrantUrl } from "./auth";

function App() {
  return (
    <>
      <a href={getImplicitGrantUrl("twitch")}>Connect with Twitch</a>
      <a href={getImplicitGrantUrl("spotify")}>Connect with Spotify</a>
    </>
  );
}

export default App;
