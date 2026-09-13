import { useEffect, useId, useRef, useState } from "react";
import "./audio-player.css";

/** On-demand playback with a compact trigger and native seeking/volume controls. */
export function AudioPlayer({ src, label, startAt = 0 }: {
  src: string;
  label: string;
  startAt?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStarted = useRef(false);
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const pauseForOtherMedia = (event: Event) => {
      if (event.target instanceof HTMLMediaElement && event.target !== audio && audio && !audio.paused) audio.pause();
    };
    document.addEventListener("play", pauseForOtherMedia, true);
    return () => {
      document.removeEventListener("play", pauseForOtherMedia, true);
      if (audio && !audio.paused) audio.pause();
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    setExpanded(true);
    setError(false);
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      setError(true);
    }
  }

  const actionLabel = `${playing ? "Pause" : "Play"} ${label}`;
  return <>
    <button
      type="button"
      className="article-audio__trigger"
      aria-label={actionLabel}
      title={actionLabel}
      aria-controls={panelId}
      aria-expanded={expanded}
      aria-pressed={playing}
      onClick={togglePlayback}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
        {playing ? <path d="M9 5v14M15 5v14" strokeWidth="3" /> : <>
          <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
          <rect x="3" y="12" width="4" height="8" rx="2" />
          <rect x="17" y="12" width="4" height="8" rx="2" />
        </>}
      </svg>
    </button>
    <div id={panelId} className="article-audio__player" hidden={!expanded}>
      <div className="article-audio__label">{label}</div>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        controls
        aria-label={label}
        onLoadedMetadata={() => {
          const audio = audioRef.current;
          if (audio && !hasStarted.current) {
            audio.currentTime = startAt < audio.duration ? startAt : 0;
            hasStarted.current = true;
          }
        }}
        onPlay={() => { setPlaying(true); setError(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => { setPlaying(false); setError(true); }}
      />
      {error && <p role="status">Audio could not play. Try the controls or <a href={src} target="_blank" rel="noopener noreferrer">open the recording</a>.</p>}
    </div>
  </>;
}
