import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FileText, AudioLines, Download } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { ACTIVITE_QUERY } from "@/lib/sanity/queries";
import { PortableTextContent } from "@/components/sanity/PortableTextContent";
import ActiviteGallery from "@/components/ActiviteGallery";

export const metadata: Metadata = {
  title: "Activité — Fondation AEncrage",
};

const options = { next: { revalidate: 60 } };

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatFileSize(bytes?: number) {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

type SanityAsset = {
  url?: string;
  originalFilename?: string;
  extension?: string;
  size?: number;
};

type GalleryPhoto = { _key: string; alt?: string; asset?: SanityAsset };
type ActiviteDocument = { _key: string; title?: string; asset?: SanityAsset };
type ActiviteAudio = { _key: string; title?: string; duree?: string; asset?: SanityAsset };

export default async function ActivitePage() {
  const activite = await client.fetch(ACTIVITE_QUERY, {}, options);

  if (!activite) return notFound();

  const { title, date, horaires, lieu, chapo, couverture, content, gallery, documents, audioFiles } =
    activite;

  const metaParts = [formatDate(date), horaires, lieu].filter(Boolean) as string[];
  const hasCouverture = Boolean(couverture?.asset);
  const galleryPhotos = (Array.isArray(gallery) ? gallery : [])
    .filter((photo: GalleryPhoto) => photo.asset)
    .map((photo: GalleryPhoto) => ({
      key: photo._key,
      alt: photo.alt ?? "",
      thumbUrl: urlForImage(photo).width(800).fit("max").auto("format").url(),
      fullUrl: urlForImage(photo).width(1800).fit("max").auto("format").url(),
    }));

  return (
    <main className="px-6 md:px-14 max-w-350 mx-auto">
      {/* Hero */}
      <section
        className={
          hasCouverture
            ? "grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 md:gap-16 items-end pt-8 md:pt-12 pb-10 md:pb-16"
            : "pt-8 md:pt-12 pb-10 md:pb-16"
        }
      >
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-5">
            Activité
          </p>
          <h1 className="font-display font-normal text-[36px] md:text-[54px] leading-[1.1] text-encre max-w-155 mb-6.5">
            {title}
          </h1>
          {metaParts.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.14em] uppercase text-gris mb-5.5">
              {metaParts.map((part, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  {part}
                </span>
              ))}
            </div>
          )}
          {chapo && (
            <p className="font-body text-[17px] leading-[1.65] text-secondaire max-w-120 m-0">
              {chapo}
            </p>
          )}
        </div>

        {hasCouverture && (
          <div
            className="hidden md:block relative w-full self-stretch bg-placeholder h-110"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
            }}
          >
            <Image
              src={urlForImage(couverture).width(1200).fit("max").auto("format").url()}
              alt={couverture.alt ?? ""}
              fill
              sizes="(min-width: 768px) 45vw, 0px"
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Contenu riche */}
      <article className="max-w-175 mx-auto mt-22">
        <PortableTextContent value={content} />
      </article>

      {/* Galerie */}
      {galleryPhotos.length > 0 && (
        <section className="mt-24">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3">
            Galerie
          </p>
          <h2 className="font-display font-normal text-[28px] text-encre mb-7">
            Photos de la journée
          </h2>
          <ActiviteGallery photos={galleryPhotos} />
        </section>
      )}

      {/* Documents à télécharger */}
      {Array.isArray(documents) && documents.length > 0 && (
        <section id="documents" className="mt-24">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3">
            Ressources
          </p>
          <h2 className="font-display font-normal text-[28px] text-encre mb-7">
            Documents à télécharger
          </h2>
          <div className="flex flex-col gap-px bg-encre/12 border border-encre">
            {documents.map((doc: ActiviteDocument) => (
              <a
                key={doc._key}
                href={doc.asset?.url}
                download={doc.asset?.originalFilename}
                className="flex items-center gap-5 py-5 px-6 bg-papier no-underline"
                style={{ borderTop: "3px solid var(--color-laiton)" }}
              >
                <span className="shrink-0 text-gris flex items-center">
                  <FileText size={15} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[18px] text-encre">
                    {doc.title || doc.asset?.originalFilename}
                  </span>
                  <span className="block font-mono text-[11px] text-gris mt-1">
                    {[doc.asset?.extension?.toUpperCase(), formatFileSize(doc.asset?.size)]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 flex items-center gap-1.75 font-mono text-[11px] tracking-widest uppercase text-plume">
                  Télécharger
                  <Download size={12} />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Enregistrements audio */}
      {Array.isArray(audioFiles) && audioFiles.length > 0 && (
        <section className="mt-24 pb-24">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3">
            Écouter
          </p>
          <h2 className="font-display font-normal text-[28px] text-encre mb-7">
            Enregistrements audio
          </h2>
          <div className="flex flex-col gap-4">
            {audioFiles.map((audio: ActiviteAudio) => (
              <div
                key={audio._key}
                className="border border-encre py-6 px-6.5 bg-papier"
                style={{ borderTop: "3px solid var(--color-laiton)" }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 text-gris">
                    <AudioLines size={14} />
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
                      Enregistrement sonore
                    </span>
                  </div>
                  {audio.duree && (
                    <span className="font-mono text-[11px] text-gris">{audio.duree}</span>
                  )}
                </div>
                <div className="font-display text-[18px] text-encre mb-3.5">{audio.title}</div>
                <audio
                  controls
                  src={audio.asset?.url}
                  className="w-full h-8 accent-plume"
                >
                  Votre navigateur ne prend pas en charge la lecture audio.
                </audio>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
