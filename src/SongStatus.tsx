import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { SpotifyPlayback } from "./SpotifyPanel";

dayjs.extend(duration);

export interface SongStatusProps {
  playback: SpotifyPlayback;
}

function format(duration?: number): string {
  if (!duration) return "--";
  return dayjs.duration(duration).format("mm:ss");
}

export default function SongStatus({ playback }: SongStatusProps) {
  return (
    <div className="px-3 py-2 rounded text-white bg-black/20">
      <div className="text-xs">Now Playing</div>
      <div className="flex flex-row gap-2 justify-between">
        <div className="overflow-hidden basis-3/4">
          <div className="truncate">{playback.item?.name}</div>
          <div className="truncate text-white/70 text-sm">
            {playback.item?.artists
              .map((a) => a.name)
              .reduce((acc, x) => acc + ", " + x)}
          </div>
        </div>
        <div className="text-sm">
          {format(playback.progress_ms)}/{format(playback.item?.duration_ms)}
        </div>
      </div>
    </div>
  );
}
