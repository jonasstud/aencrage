import { Camera, FileText, AudioLines, Video, type LucideIcon } from "lucide-react";

export const TYPE_FOND_ICONS: Record<string, LucideIcon> = {
  Photo: Camera,
  "Écrit": FileText,
  Son: AudioLines,
  "Vidéo": Video,
};

export type MetaItem = { key: string; icon?: LucideIcon; label: string };

export function buildFondMetaItems(
  annee: number | undefined,
  typeFond: string | string[] | undefined,
  donateur: string | undefined,
): MetaItem[] {
  const types = Array.isArray(typeFond) ? typeFond : typeFond ? [typeFond] : [];

  return [
    annee ? { key: "annee", label: annee.toString() } : null,
    ...types.map((type) => ({
      key: `type-${type}`,
      icon: TYPE_FOND_ICONS[type],
      label: type,
    })),
    donateur ? { key: "donateur", label: donateur } : null,
  ].filter((item): item is MetaItem => item !== null);
}
