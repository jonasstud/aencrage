"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryPhoto = {
  key: string;
  alt: string;
  thumbUrl: string;
  fullUrl: string;
};

export default function ActiviteGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cols = Math.min(4, Math.max(2, photos.length));

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
      }
      if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [openIndex, photos.length]);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-[repeat(var(--gallery-cols),1fr)] gap-6"
        style={{ ["--gallery-cols" as string]: cols }}
      >
        {photos.map((photo, i) => (
          <figure key={photo.key} className="m-0">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="relative block w-full bg-placeholder cursor-pointer overflow-hidden group"
              style={{ aspectRatio: "4 / 3" }}
              aria-label={photo.alt ? `Agrandir : ${photo.alt}` : "Agrandir la photo"}
            >
              <Image
                src={photo.thumbUrl}
                alt={photo.alt}
                fill
                sizes={`(min-width: 768px) ${100 / cols}vw, 50vw`}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
            {photo.alt && (
              <figcaption className="font-body text-[13px] text-gris mt-2">
                {photo.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          style={{ background: "rgba(19,20,23,0.9)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 md:top-8 md:right-8 text-texte-clair-1 hover:text-papier transition-colors duration-200"
            aria-label="Fermer"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-texte-clair-1 hover:text-papier transition-colors duration-200 p-2"
              aria-label="Photo précédente"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div
            className="flex flex-col items-center max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ maxWidth: "90vw", maxHeight: "78vh" }}>
              <Image
                src={current.fullUrl}
                alt={current.alt}
                width={1800}
                height={1200}
                sizes="90vw"
                className="w-auto h-auto object-contain"
                style={{ maxWidth: "90vw", maxHeight: "78vh" }}
              />
            </div>
            <div className="flex flex-col items-center gap-1.5 mt-4">
              {current.alt && (
                <p className="font-body text-[14px] text-texte-clair-2 text-center max-w-150">
                  {current.alt}
                </p>
              )}
              <p className="font-mono text-[11px] tracking-widest uppercase text-gris">
                {openIndex! + 1} / {photos.length}
              </p>
            </div>
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-texte-clair-1 hover:text-papier transition-colors duration-200 p-2"
              aria-label="Photo suivante"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
