export type Action = { cat: string; text: string };
export type Space = { id: string; name: string; desc: string; image?: string };
export type ConseilMembre = { name: string; role: string };

export const actions: Action[] = [
  {
    cat: "Écrits",
    text: "Identifier et inventorier tous les écrits — officiels ou non — de la communauté masatte.",
  },
  {
    cat: "Archives",
    text: "Rechercher dans les archives bourgeoisiales, communales, paroissiales et cantonales les documents officiels.",
  },
  {
    cat: "Recherche",
    text: "Rassembler les travaux de recherche universitaires et les documents privés liés au village et à ses habitants.",
  },
  {
    cat: "Sonore",
    text: "Collecter tous les enregistrements en lien avec la vie communautaire du village.",
  },
  {
    cat: "Sonore",
    text: "Collaborer avec la Phonothèque nationale, les radios et télévisions afin de rassembler émissions et concerts.",
  },
  {
    cat: "Portraits",
    text: "Recueillir les traces orales et les portraits des habitantes et habitants de Mase.",
  },
  {
    cat: "Portraits",
    text: "Enregistrer les femmes et les hommes, personnalités du village.",
  },
];

export const filterOptions = [
  "Tous",
  "Écrits",
  "Archives",
  "Recherche",
  "Sonore",
  "Portraits",
] as const;
export type FilterOption = (typeof filterOptions)[number];

export const spaces: Space[] = [
  {
    id: "space-1",
    name: "Le Raccard : Maison des Êtres et des Lettres",
    desc: "Lieu dédié à la consultation, à la médiation, à la résidence. ",
    image: "/images/etre-et-des-lettres.webp",
  },
  {
    id: "space-2",
    name: "L'Écurie des Chèvres",
    desc: "Lieu d'exposition.",
    image: "/images/ecurie-des-chevres.webp",
  },
  {
    id: "space-3",
    name: "Le Moulin",
    desc: "Lieu d'accueil et d'ateliers thématiques.",
    image: "/images/moulin.jpg",
  },
];

export const conseil: ConseilMembre[] = [
  { name: "Annette Corbaz", role: "Fondatrice, présidente" },
  { name: "Anne Colyn", role: "Vice-présidente" },
  { name: "Michel Beytrison", role: "Secrétaire-trésorier" },
];

import { ScrollText, Clapperboard, Mic, type LucideIcon } from "lucide-react";

export type PatrimoineAction = {
  title: string;
  icon: LucideIcon;
  bullets: [string, string];
};

export const patrimoineActions: PatrimoineAction[] = [
  {
    title: "Patrimoine écrit",
    icon: ScrollText,
    bullets: [
      "Identifier et inventorier tous les écrits – officiels ou non – de la communauté de Mase.",
      "Rechercher dans les Archives bourgeoisiales, paroissiales, communales et cantonales les documents officiels, rassembler les travaux de recherche (université, etc.), collecter les articles de presse, offrir un espace de dépôt d'archives personnelles et familiales ayant trait au village et à ses habitants.",
    ],
  },
  {
    title: "Patrimoine audiovisuel",
    icon: Clapperboard,
    bullets: [
      "Collecter tous les enregistrements en lien avec la vie communautaire du village.",
      "Collaborer avec la Phonothèque nationale, les radios et télévisions nationales et locales afin de rassembler toutes les traces audios et visuelles (émissions, concerts, etc.), recueillir les photographies et films de la vie associative et communautaire de Mase.",
    ],
  },
  {
    title: "Patrimoine oral",
    icon: Mic,
    bullets: [
      "Recueillir les traces orales et les portraits de personnalités masattes.",
      "Brosser le portrait de personnages habitant le village par enregistrements de leur témoignage, identifier et illustrer des thématiques liées à leur parcours de vie et à leur implication dans le village.",
    ],
  },
];
