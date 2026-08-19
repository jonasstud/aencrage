"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  FileText,
  AudioLines,
  Video,
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Loader,
} from "lucide-react";
import type { Fond } from "@/lib/fondsThemes";

const TYPE_BORDER: Record<"photo" | "ecrit" | "son" | "video", string> = {
  photo: "#A88C5A",
  ecrit: "#758FB2",
  son: "#7A9E87",
  video: "#B07060",
};

const TYPE_LABELS: Record<"photo" | "ecrit" | "son" | "video", string> = {
  photo: "Photographie",
  ecrit: "Document écrit",
  son: "Enregistrement sonore",
  video: "Vidéo",
};

const NUM_BARS = 150;

const DEFAULT_PEAKS = Array.from({ length: NUM_BARS }, (_, i) => {
  const x = i / NUM_BARS;
  return Math.max(
    0.05,
    0.2 +
      0.65 *
        Math.abs(Math.sin(x * Math.PI * 5 + 1.2)) *
        (0.5 + 0.5 * Math.abs(Math.sin(x * Math.PI * 2))),
  );
});

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function FondTypeIcon({ type }: { type: "photo" | "ecrit" | "son" | "video" }) {
  if (type === "photo") return <Camera size={14} color="#8A8F98" />;
  if (type === "son") return <AudioLines size={14} color="#8A8F98" />;
  if (type === "video") return <Video size={14} color="#8A8F98" />;
  return <FileText size={14} color="#8A8F98" />;
}

type Props = {
  fond: Fond | null;
  chapitreName: string;
  onClose: () => void;
};

export default function FondModal({ fond, chapitreName, onClose }: Props) {
  useEffect(() => {
    if (!fond) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [fond, onClose]);

  if (!fond) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(19,20,23,0.75)" }}
      onClick={onClose}
    >
      <div
        className="bg-papier w-full relative overflow-y-auto"
        style={{
          maxWidth:
            fond.type === "photo" ||
            fond.type === "video" ||
            (fond.type === "son" && fond.imageSrc)
              ? 760
              : 640,
          maxHeight: "90vh",
          borderTop: `3px solid ${TYPE_BORDER[fond.type]}`,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Détails du fonds"
      >
        <button
          onClick={onClose}
          className="absolute z-10 flex items-center justify-center"
          style={{
            top: 16,
            right: 16,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "1px solid #131417",
            fontSize: 14,
            cursor: "pointer",
          }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {fond.type === "photo" ? (
          <PhotoLayout fond={fond} chapitreName={chapitreName} />
        ) : fond.type === "video" ? (
          <VideoLayout fond={fond} chapitreName={chapitreName} />
        ) : fond.type === "ecrit" ? (
          <EcritLayout fond={fond} chapitreName={chapitreName} />
        ) : (
          <SonLayout fond={fond} chapitreName={chapitreName} />
        )}
      </div>
    </div>
  );
}

function PhotoLayout({
  fond,
  chapitreName,
}: {
  fond: Fond;
  chapitreName: string;
}) {
  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <div
        className="hidden md:block bg-placeholder relative overflow-hidden"
        style={{
          minHeight: 400,
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 60px 100%, 0 calc(100% - 26px))",
        }}
        aria-hidden="true"
      >
        {fond.imageSrc && (
          <img
            src={fond.imageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div style={{ padding: 40 }}>
        <ModalContent fond={fond} chapitreName={chapitreName} />
      </div>
    </div>
  );
}

function toYouTubeEmbedUrl(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function VideoLayout({
  fond,
  chapitreName,
}: {
  fond: Fond;
  chapitreName: string;
}) {
  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <div
        className="hidden md:flex items-center justify-center bg-encre relative overflow-hidden"
        style={{ minHeight: 400 }}
        aria-hidden="true"
      >
        {fond.documentFileUrl && (
          <iframe
            src={toYouTubeEmbedUrl(fond.documentFileUrl)}
            title={fond.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
          />
        )}
      </div>
      <div style={{ padding: 40 }}>
        <ModalContent fond={fond} chapitreName={chapitreName} />
        <div className="mt-6">
          <p
            className="font-mono text-gris mb-1"
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            Vidéo
          </p>
          {fond.documentFileUrl && (
            <a
              href={fond.documentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-plume hover:underline"
              style={{ fontSize: 12 }}
            >
              Ouvrir sur YouTube ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EcritLayout({
  fond,
  chapitreName,
}: {
  fond: Fond;
  chapitreName: string;
}) {
  return (
    <div style={{ padding: "32px 40px 40px" }}>
      <ModalContent fond={fond} chapitreName={chapitreName} />
      <div className="mt-6">
        <p
          className="font-mono text-gris mb-1"
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          Fichier
        </p>
        {fond.documentFileUrl ? (
          <a
            href={fond.documentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-plume hover:underline"
            style={{ fontSize: 12 }}
          >
            Ouvrir le document complet ↗
          </a>
        ) : (
          <span className="font-mono text-gris" style={{ fontSize: 12 }}>
            Document non disponible
          </span>
        )}
      </div>
    </div>
  );
}

function SonLayout({
  fond,
  chapitreName,
}: {
  fond: Fond;
  chapitreName: string;
}) {
  const downloadLink = (
    <div className="mt-6">
      <p
        className="font-mono text-gris mb-1"
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        Fichier
      </p>
      {fond.audioSrc ? (
        <a
          href={fond.audioSrc}
          download
          className="font-mono text-plume hover:underline"
          style={{ fontSize: 12 }}
        >
          Télécharger l'enregistrement ↓
        </a>
      ) : (
        <span className="font-mono text-gris" style={{ fontSize: 12 }}>
          Fichier non disponible
        </span>
      )}
    </div>
  );

  if (fond.imageSrc) {
    return (
      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div
          className="hidden md:block bg-placeholder relative overflow-hidden"
          style={{
            minHeight: 400,
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 60px 100%, 0 calc(100% - 26px))",
          }}
          aria-hidden="true"
        >
          <img
            src={fond.imageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div
            style={{ background: "#EEF1F5", paddingTop: 20, paddingBottom: 16 }}
          >
            <AudioPlayer
              audioSrc={fond.audioSrc}
              audioPeaks={fond.audioPeaks}
            />
          </div>
          <div style={{ padding: "32px 40px 40px", flex: 1 }}>
            <ModalContent fond={fond} chapitreName={chapitreName} />
            {downloadLink}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: "#EEF1F5", paddingTop: 24, paddingBottom: 20 }}>
        <AudioPlayer audioSrc={fond.audioSrc} audioPeaks={fond.audioPeaks} />
      </div>
      <div style={{ padding: "32px 40px 40px" }}>
        <ModalContent fond={fond} chapitreName={chapitreName} />
        {downloadLink}
      </div>
    </>
  );
}

function AudioPlayer({
  audioSrc,
  audioPeaks,
}: {
  audioSrc?: string;
  audioPeaks?: number[];
}) {
  const progressRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const startOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const hideVolumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [seekingRatio, setSeekingRatio] = useState<number | null>(null);

  const peaks =
    audioPeaks && audioPeaks.length > 0 ? audioPeaks : DEFAULT_PEAKS;
  const duration = audioBuffer?.duration ?? 0;
  const progress =
    seekingRatio !== null
      ? seekingRatio
      : duration > 0
        ? currentTime / duration
        : 0;
  const playedBars = Math.round(progress * peaks.length);
  const disabled = !audioSrc || hasError || !audioBuffer;

  function applyGain(vol: number, muted: boolean) {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = muted ? 0 : vol;
  }

  function stopRAF() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function stopSource() {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null;
      try {
        sourceNodeRef.current.stop();
      } catch {
        /* already stopped */
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    stopRAF();
  }

  useEffect(() => {
    stopSource();
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    setAudioBuffer(null);
    startOffsetRef.current = 0;

    if (!audioSrc) return;

    setIsLoading(true);

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current.connect(ctx.destination);
    }

    const ctx = audioCtxRef.current;
    const controller = new AbortController();

    fetch(audioSrc, { signal: controller.signal })
      .then((r) => r.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        setAudioBuffer(decoded);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      stopSource();
      if (hideVolumeTimeout.current) clearTimeout(hideVolumeTimeout.current);
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    };
  }, []);

  function playFrom(offset: number, buf: AudioBuffer) {
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;

    stopSource();
    if (ctx.state === "suspended") ctx.resume();

    const dur = buf.duration;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(gain);
    source.onended = () => {
      if (sourceNodeRef.current === source) {
        setIsPlaying(false);
        setCurrentTime(0);
        startOffsetRef.current = 0;
        stopRAF();
        sourceNodeRef.current = null;
      }
    };

    startTimeRef.current = ctx.currentTime;
    startOffsetRef.current = offset;
    source.start(0, offset);
    sourceNodeRef.current = source;
    setIsPlaying(true);

    const tick = () => {
      const next = Math.min(
        startOffsetRef.current + (ctx.currentTime - startTimeRef.current),
        dur,
      );
      setCurrentTime(next);
      if (next < dur) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function pausePlayback() {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    startOffsetRef.current = Math.min(
      startOffsetRef.current + (ctx.currentTime - startTimeRef.current),
      duration,
    );
    setCurrentTime(startOffsetRef.current);
    stopSource();
    setIsPlaying(false);
  }

  function togglePlayPause() {
    if (disabled || !audioBuffer) return;
    if (isPlaying) pausePlayback();
    else playFrom(startOffsetRef.current, audioBuffer);
  }

  function seekTo(ratio: number, buf: AudioBuffer, playing: boolean) {
    const offset = Math.max(0, Math.min(1, ratio)) * buf.duration;
    startOffsetRef.current = offset;
    setCurrentTime(offset);
    if (playing) playFrom(offset, buf);
  }

  function getRatio(
    e: React.MouseEvent | MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>,
  ): number {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }

  function handleSeekMouseDown(ref: React.RefObject<HTMLDivElement | null>) {
    return (e: React.MouseEvent) => {
      if (disabled || !audioBuffer) return;
      const buf = audioBuffer;
      const playing = isPlaying;
      setSeekingRatio(getRatio(e, ref));
      const onMove = (ev: MouseEvent) => setSeekingRatio(getRatio(ev, ref));
      const onUp = (ev: MouseEvent) => {
        seekTo(getRatio(ev, ref), buf, playing);
        setSeekingRatio(null);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    applyGain(volume, next);
  }

  function handleVolumeEnter() {
    if (hideVolumeTimeout.current) clearTimeout(hideVolumeTimeout.current);
    setShowVolume(true);
  }

  function handleVolumeLeave() {
    hideVolumeTimeout.current = setTimeout(() => setShowVolume(false), 150);
  }

  return (
    <div
      className="grid gap-x-3 gap-y-1.5 px-7 pt-5 pb-1.25"
      style={{
        gridTemplateColumns: "38px 1fr auto",
        gridTemplateRows: "auto auto auto",
      }}
    >
      <div
        ref={waveRef}
        onMouseDown={handleSeekMouseDown(waveRef)}
        className={`flex items-end ${disabled ? "cursor-default" : "cursor-pointer"}`}
        style={{ gridColumn: "1 / -1", gridRow: 1, height: 56, gap: 1 }}
        aria-hidden="true"
      >
        {peaks.map((peak: number, i: number) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: 4,
              height: `${Math.max(3, Math.round(peak * 100))}%`,
              backgroundColor: i < playedBars ? "#38485C" : "#DCE3EC",
              opacity: disabled ? 0.4 : 1,
              borderRadius: 1,
              transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        ))}
      </div>

      <div
        ref={progressRef}
        onMouseDown={handleSeekMouseDown(progressRef)}
        className={`relative mb-1 ${disabled ? "cursor-default" : "cursor-pointer"}`}
        style={{
          gridColumn: "1 / -1",
          gridRow: 2,
          height: 3,
          background: "#DCE3EC",
          borderRadius: 2,
        }}
        role="slider"
        aria-label="Progression"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{ width: `${progress * 100}%`, background: "#38485C" }}
        />
      </div>

      <button
        onClick={togglePlayPause}
        disabled={disabled || isLoading}
        className={`flex items-center justify-center shrink-0 rounded-full border border-encre bg-white ${disabled || isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        style={{ gridColumn: 1, gridRow: 3, width: 38, height: 38 }}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        {isLoading ? (
          <Loader
            size={14}
            color="#131417"
            aria-hidden="true"
            className="animate-spin"
            style={{ animationDuration: "2s" }}
          />
        ) : isPlaying ? (
          <Pause size={11} fill="#131417" color="#131417" aria-hidden="true" />
        ) : (
          <Play size={11} fill="#131417" color="#131417" aria-hidden="true" />
        )}
      </button>

      <span
        className="font-mono self-center text-center text-gris whitespace-nowrap"
        style={{ gridColumn: 2, gridRow: 3, fontSize: 11 }}
      >
        {!audioSrc
          ? "—"
          : hasError
            ? "Erreur"
            : isLoading
              ? "Chargement…"
              : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </span>

      <div
        className="flex items-center self-center relative"
        style={{ gridColumn: 3, gridRow: 3 }}
        onMouseEnter={handleVolumeEnter}
        onMouseLeave={handleVolumeLeave}
      >
        <div
          className={`absolute z-10 flex flex-col items-center rounded-lg bg-white shadow-lg transition-opacity duration-200 ${showVolume ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{
            top: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 8px",
          }}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              const newMuted = isMuted && v > 0 ? false : isMuted;
              setVolume(v);
              if (newMuted !== isMuted) setIsMuted(newMuted);
              applyGain(v, newMuted);
            }}
            className="cursor-pointer"
            style={{
              writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
              direction: "rtl",
              height: 72,
              width: 4,
              accentColor: "#38485C",
            }}
            aria-label="Volume"
          />
        </div>

        <button
          onClick={toggleMute}
          disabled={disabled}
          className={`bg-transparent border-0 p-0 flex items-center ${disabled ? "cursor-default opacity-40" : "cursor-pointer"}`}
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={14} color="#8A8F98" aria-hidden="true" />
          ) : volume < 0.5 ? (
            <Volume1 size={14} color="#8A8F98" aria-hidden="true" />
          ) : (
            <Volume2 size={14} color="#8A8F98" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

function ModalContent({
  fond,
  chapitreName,
}: {
  fond: Fond;
  chapitreName: string;
}) {
  return (
    <>
      <p
        className="font-mono text-gris mb-1"
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        {chapitreName} · {fond.dates}
      </p>
      <div className="flex items-center gap-1.5 mb-5">
        <FondTypeIcon type={fond.type} />
        <span
          className="font-mono text-gris"
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          {TYPE_LABELS[fond.type]}
        </span>
      </div>
      <h2
        className="font-display text-encre mb-4"
        style={{ fontSize: 28, lineHeight: 1.15 }}
      >
        {fond.title}
      </h2>
      <p
        className="font-body text-secondaire mb-6"
        style={{ fontSize: 15, lineHeight: 1.6 }}
      >
        {fond.desc}
      </p>
      <p
        className="font-mono text-gris mb-1"
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        Provenance
      </p>
      <p className="font-body text-secondaire" style={{ fontSize: 14 }}>
        {fond.provenance}
      </p>
    </>
  );
}
