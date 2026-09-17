import { urlForImage } from "./image";
import type { Fond, Chapitre, ThemePage } from "@/lib/fondsThemes";

type SanityAsset = { url?: string; originalFilename?: string };
type SanityImageRef = { alt?: string; asset?: SanityAsset; extension?: string };
type SanityFileRef = { _key: string; title?: string; asset?: SanityAsset };
type SanityAudioRef = {
  _key: string;
  title?: string;
  duree?: string;
  asset?: SanityAsset;
};

export type SanityFond = {
  _id: string;
  title: string;
  typeFond?: string[];
  donateur?: string;
  chapo?: string;
  chapitre?: string;
  dates?: string;
  videoUrl?: string;
  couverture?: SanityImageRef;
  content?: unknown[];
  gallery?: (SanityImageRef & { _key: string })[];
  documents?: SanityFileRef[];
  audioFiles?: SanityAudioRef[];
};

export type SanityTheme = {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  chapitres?: { id: string; name: string }[];
  fonds?: SanityFond[];
};

const TYPE_MAP: Record<string, Fond["type"]> = {
  "Photo": "photo",
  "Écrit": "ecrit",
  "Son": "son",
  "Vidéo": "video",
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // strip diacritics left by NFD normalization
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isSvg(extension?: string): boolean {
  return extension?.toLowerCase() === "svg";
}

function resolveImageUrl(image: SanityImageRef): string | undefined {
  if (!image.asset?.url) return undefined;
  if (isSvg(image.extension)) return image.asset.url;
  return urlForImage(image).width(1200).fit("max").auto("format").url();
}

function adaptFond(raw: SanityFond): Fond {
  const couvertureUrl = raw.couverture
    ? resolveImageUrl(raw.couverture)
    : undefined;

  const galleryUrls = (raw.gallery ?? [])
    .map((photo) => resolveImageUrl(photo))
    .filter((url): url is string => Boolean(url));

  const images = [couvertureUrl, ...galleryUrls].filter(
    (url): url is string => Boolean(url),
  );

  const audio = (raw.audioFiles ?? []).find((a) => a.asset?.url);

  return {
    id: raw._id,
    title: raw.title,
    desc: raw.chapo ?? "",
    content: raw.content,
    dates: raw.dates ?? "",
    provenance: raw.donateur ?? "",
    type: TYPE_MAP[raw.typeFond?.[0] ?? "Écrit"] ?? "ecrit",
    images: images.length > 0 ? images : undefined,
    videoUrl: raw.videoUrl,
    documents: (raw.documents ?? [])
      .filter((doc) => doc.asset?.url)
      .map((doc) => ({
        label: doc.title || doc.asset!.originalFilename || "Document",
        url: doc.asset!.url!,
      })),
    audioSrc: audio?.asset?.url,
  };
}

export function adaptTheme(raw: SanityTheme): ThemePage {
  const byChapitre = new Map<string, Fond[]>();
  for (const rawFond of raw.fonds ?? []) {
    const key = rawFond.chapitre?.trim() || "Autres";
    const list = byChapitre.get(key) ?? [];
    list.push(adaptFond(rawFond));
    byChapitre.set(key, list);
  }

  const knownNames = new Set((raw.chapitres ?? []).map((c) => c.name));
  const chapitres: Chapitre[] = (raw.chapitres ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    fonds: byChapitre.get(c.name) ?? [],
  }));

  const usedIds = new Set(chapitres.map((c) => c.id));
  for (const [name, fonds] of byChapitre) {
    if (knownNames.has(name)) continue;
    let id = slugify(name);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(name)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    chapitres.push({ id, name, fonds });
  }

  return {
    slug: raw.slug,
    name: raw.title,
    intro: raw.intro ?? "",
    chapitres,
  };
}
