export type Action = { cat: string; text: string }
export type Space = { id: string; name: string; desc: string; image?: string }
export type ConseilMembre = { name: string; role: string }

export const actions: Action[] = [
  { cat: 'Écrits',    text: "Identifier et inventorier tous les écrits — officiels ou non — de la communauté masatte." },
  { cat: 'Archives',  text: "Rechercher dans les archives bourgeoisiales, communales, paroissiales et cantonales les documents officiels." },
  { cat: 'Recherche', text: "Rassembler les travaux de recherche universitaires et les documents privés liés au village et à ses habitants." },
  { cat: 'Sonore',    text: "Collecter tous les enregistrements en lien avec la vie communautaire du village." },
  { cat: 'Sonore',    text: "Collaborer avec la Phonothèque nationale, les radios et télévisions afin de rassembler émissions et concerts." },
  { cat: 'Portraits', text: "Recueillir les traces orales et les portraits des habitantes et habitants de Mase." },
  { cat: 'Portraits', text: "Enregistrer les femmes et les hommes, personnalités du village." },
]

export const filterOptions = ['Tous', 'Écrits', 'Archives', 'Recherche', 'Sonore', 'Portraits'] as const
export type FilterOption = typeof filterOptions[number]

export const spaces: Space[] = [
  { id: 'space-1', name: 'Le Raccard : Maison des Êtres et des Lettres', desc: "Lieu dédié à la consultation, à la médiation, à la résidence. ", image: '/images/etre-et-des-lettres.jpg' },
  { id: 'space-2', name: 'L\'Écurie des Chèvres',              desc: "Lieu d'exposition." },
  { id: 'space-3', name: 'Le Moulin',                          desc: "Lieu d'accueil et d'ateliers thématiques.", image: '/images/moulin.jpg' },
]

export const conseil: ConseilMembre[] = [
  { name: 'Annette Corbaz',   role: 'Fondatrice, présidente' },
  { name: 'Anne Colyn',       role: 'Vice-présidente' },
  { name: 'Michel Beytrison', role: 'Secrétaire-trésorier' },
]
