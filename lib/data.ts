export type Action = { cat: string; text: string }
export type Space = { id: string; name: string; desc: string }
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
  { id: 'space-1', name: 'Maison des Êtres et des Lettres', desc: "Espace principal dédié à la consultation et à la mise en récit des fonds." },
  { id: 'space-2', name: 'Écurie des Chèvres',              desc: "Lieu d'exposition et d'ateliers en lien avec la vie rurale du village." },
  { id: 'space-3', name: 'Moulin',                          desc: "Parcours didactique autour des gestes et des saisons." },
]

export const conseil: ConseilMembre[] = [
  { name: 'Annette Corbaz',   role: 'Fondatrice, présidente' },
  { name: 'Anne Colyn',       role: 'Vice-présidente' },
  { name: 'Michel Beytrison', role: 'Secrétaire-trésorier' },
]
