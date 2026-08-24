"use client";

import Image from "next/image";
import { Camera, FileText, AudioLines, Video, ChevronRight } from "lucide-react";
import { renderOrdinalTitle } from "@/lib/formatTitle";

const TYPE_LABELS: Record<"photo" | "ecrit" | "son" | "video", string> = {
  photo: "Photographie",
  ecrit: "Document écrit",
  son: "Enregistrement sonore",
  video: "Vidéo",
};

const TYPE_BORDER: Record<"photo" | "ecrit" | "son" | "video", string> = {
  photo:  "#A88C5A",
  ecrit:  "#758FB2",
  son:    "#7A9E87",
  video:  "#B07060",
};

function FondTypeIcon({ type }: { type: "photo" | "ecrit" | "son" | "video" }) {
  if (type === "photo") return <Camera size={14} />;
  if (type === "son") return <AudioLines size={14} />;
  if (type === "video") return <Video size={14} />;
  return <FileText size={14} />;
}
import type { Fond } from "@/lib/fondsThemes";
import { getYouTubeThumbnail } from "@/lib/video";

type Props = {
  fond: Fond;
  onOpen: (fond: Fond) => void;
};

export default function FondCard({ fond, onOpen }: Props) {
  const coverImage =
    fond.images?.[0] ??
    (fond.type === "video" && fond.videoUrl
      ? getYouTubeThumbnail(fond.videoUrl)
      : null) ??
    undefined;
  const isLogo = coverImage?.toLowerCase().endsWith(".svg") ?? false;

  return (
    <div
      className="border border-encre flex flex-col"
      style={{ borderTop: `3px solid ${TYPE_BORDER[fond.type]}` }}
    >
      {coverImage && (
        <div
          className={`w-full relative overflow-hidden ${isLogo ? "bg-papier" : "bg-placeholder"}`}
          style={{ aspectRatio: "16 / 9" }}
          aria-hidden="true"
        >
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
            className={isLogo ? "object-contain p-8" : "object-cover"}
            unoptimized={isLogo}
          />
        </div>
      )}
      <div
        className="flex flex-col flex-1"
        style={{ padding: coverImage ? "16px 22px 22px" : "24px 22px 22px" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-gris">
            <FondTypeIcon type={fond.type} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
              {TYPE_LABELS[fond.type]}
            </span>
          </div>
          <span className="font-mono text-[10px] text-gris">{fond.dates}</span>
        </div>

        <h3 className="font-display text-[19px] leading-[1.2] text-encre mb-2">
          {renderOrdinalTitle(fond.title)}
        </h3>

        <p className="font-body text-[14px] leading-[1.55] text-secondaire mb-4 flex-1">
          {fond.desc}
        </p>

        <button
          type="button"
          onClick={() => onOpen(fond)}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-plume self-start hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-1">
            Voir la fiche <ChevronRight size={14} />
          </div>
        </button>
      </div>
    </div>
  );
}
