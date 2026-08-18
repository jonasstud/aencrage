"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, FileText, AudioLines, Video } from "lucide-react";
import type { Fond } from "@/lib/fondsThemes";

const TYPE_LABELS: Record<"photo" | "ecrit" | "son" | "video", string> = {
  photo: "Photographie",
  ecrit: "Document écrit",
  son: "Enregistrement sonore",
  video: "Vidéo",
};

const DEFAULT_PEAKS = Array.from({ length: 50 }, (_, i) => {
  const x = i / 50;
  return Math.max(0.15, 0.2 + 0.65 * Math.abs(Math.sin(x * Math.PI * 5 + 1.2)) * (0.5 + 0.5 * Math.abs(Math.sin(x * Math.PI * 2))));
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
          maxWidth: fond.type === "photo" || fond.type === "video" ? 760 : 640,
          maxHeight: "90vh",
          borderTop: "3px solid #A88C5A",
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

function PhotoLayout({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <div
        className="hidden md:block bg-placeholder relative overflow-hidden"
        style={{
          minHeight: 400,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 60px 100%, 0 calc(100% - 26px))",
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

function VideoLayout({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
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
            style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}
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

function EcritLayout({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
  return (
    <>
      <div
        className="flex items-start"
        style={{ background: "#EEF1F5", padding: "24px 32px", gap: 24 }}
      >
        <div
          className="flex-none bg-papier relative overflow-hidden"
          style={{
            width: 104,
            height: 136,
            border: "1px solid #131417",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
          }}
        >
          {fond.documentThumbnailSrc && (
            <img
              src={fond.documentThumbnailSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <span
            className="font-mono text-encre"
            style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Document numérisé
          </span>
          <span className="font-mono text-gris" style={{ fontSize: 10.5 }}>
            Aperçu de la première page
          </span>
        </div>
      </div>
      <div style={{ padding: "32px 40px 40px" }}>
        <ModalContent fond={fond} chapitreName={chapitreName} />
        <div className="mt-6">
          <p
            className="font-mono text-gris mb-1"
            style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}
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
    </>
  );
}

function SonLayout({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
  return (
    <>
      <div style={{ background: "#EEF1F5", paddingTop: 24, paddingBottom: 20 }}>
        <AudioPlayer audioSrc={fond.audioSrc} audioPeaks={fond.audioPeaks} />
      </div>
      <div style={{ padding: "32px 40px 40px" }}>
        <ModalContent fond={fond} chapitreName={chapitreName} />
        <div className="mt-6">
          <p
            className="font-mono text-gris mb-1"
            style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}
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
      </div>
    </>
  );
}

function AudioPlayer({ audioSrc, audioPeaks }: { audioSrc?: string; audioPeaks?: number[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const peaks = audioPeaks && audioPeaks.length > 0 ? audioPeaks : DEFAULT_PEAKS;
  const progress = duration > 0 ? currentTime / duration : 0;
  const playedBars = Math.round(progress * peaks.length);
  const noAudio = !audioSrc;
  const disabled = noAudio || hasError;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    const onError = () => setHasError(true);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioSrc]);

  function togglePlayPause() {
    const audio = audioRef.current;
    if (!audio || disabled) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
    }
  }

  function seekTo(ratio: number) {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = Math.max(0, Math.min(1, ratio)) * duration;
  }

  function getProgressRatio(e: React.MouseEvent | MouseEvent): number {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width;
  }

  function handleProgressMouseDown(e: React.MouseEvent) {
    if (disabled || !duration) return;
    seekTo(getProgressRatio(e));
    const onMove = (ev: MouseEvent) => seekTo(getProgressRatio(ev));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div>
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      {/* Waveform — full width, no horizontal padding */}
      <div
        className="flex items-end"
        style={{ height: 56, gap: 2, padding: "4px 4px" }}
        aria-hidden="true"
      >
        {peaks.map((peak, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(4, Math.round(peak * 100))}%`,
              backgroundColor: i < playedBars ? "#38485C" : "#DCE3EC",
              opacity: disabled ? 0.4 : 1,
              borderRadius: 1,
              minWidth: 0,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center" style={{ padding: "8px 28px 0", gap: 12 }}>
        <button
          onClick={togglePlayPause}
          disabled={disabled}
          className="flex-none flex items-center justify-center"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid #131417",
            background: "#FFFFFF",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
          aria-label={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="3.5" height="13" rx="1" fill="#131417" />
              <rect x="7.5" y="0" width="3.5" height="13" rx="1" fill="#131417" />
            </svg>
          ) : (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
              <path d="M1 1L10 6.5L1 12V1Z" fill="#131417" />
            </svg>
          )}
        </button>

        <div
          ref={progressRef}
          onMouseDown={handleProgressMouseDown}
          className="flex-1 relative"
          style={{
            height: 3,
            background: "#DCE3EC",
            borderRadius: 2,
            cursor: disabled ? "default" : "pointer",
          }}
          role="slider"
          aria-label="Progression"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              background: "#38485C",
              borderRadius: 2,
            }}
          />
        </div>

        <span
          className="font-mono flex-none"
          style={{ fontSize: 11, color: "#8A8F98", whiteSpace: "nowrap" }}
        >
          {noAudio
            ? "—"
            : hasError
            ? "Erreur"
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    </div>
  );
}

function ModalContent({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
  return (
    <>
      <p
        className="font-mono text-gris mb-1"
        style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        {chapitreName} · {fond.dates}
      </p>
      <div className="flex items-center gap-1.5 mb-5">
        <FondTypeIcon type={fond.type} />
        <span
          className="font-mono text-gris"
          style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em" }}
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
        style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}
      >
        Provenance
      </p>
      <p className="font-body text-secondaire" style={{ fontSize: 14 }}>
        {fond.provenance}
      </p>
    </>
  );
}
