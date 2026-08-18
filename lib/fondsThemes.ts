export type Fond = {
  id: string
  title: string
  desc: string
  dates: string
  provenance: string
  type: 'photo' | 'ecrit' | 'son' | 'video'
  imageSrc?: string
  documentThumbnailSrc?: string
  documentFileUrl?: string
  audioSrc?: string
  audioPeaks?: number[]
}

export type Chapitre = {
  id: string
  name: string
  fonds: Fond[]
}

export type ThemePage = {
  slug: string
  name: string
  intro: string
  chapitres: Chapitre[]
}

export const themes: ThemePage[] = [
  {
    slug: 'alpage',
    name: 'La vie à l\'alpage',
    intro:
      'Les alpages de Mase constituent le cœur de la vie pastorale du village. Ce fonds rassemble photographies, écrits et enregistrements témoignant des pratiques et des hommes qui ont façonné ces pâturages d\'altitude.',
    chapitres: [
      { id: 'inalpe', name: 'L\'inalpe', fonds: [] },
      { id: 'greni', name: 'Le Gréni', fonds: [] },
      { id: 'cabane', name: 'La Cabane', fonds: [] },
      {
        id: 'autres',
        name: 'Autres',
        fonds: [
          {
            id: 'fusion-alpages-1957',
            title: 'La fusion des deux alpages de Mase',
            desc: 'Avant 1955, les alpages de la Louerre et de l\'Arpettaz situés au-dessus de Mase étaient gérés collectivement par des consortages pour exploiter le bétail, produire des laitages et entretenir les terrains. Ce système avait aussi un rôle écologique, car le pâturage limitait les risques d\'avalanches et préservait le paysage.',
            dates: '1957',
            provenance: 'PV et inscription au RF No 8845',
            type: 'ecrit',
            documentFileUrl: '/fonds/alpage/fusion-alpages-1957.pdf',
          },
        ],
      },
      { id: 'presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'fetes',
    name: 'Les fêtes et les symboles religieux',
    intro:
      'Les célébrations religieuses et les symboles sacrés occupent une place centrale dans la vie de Mase. Ce fonds documente processions, bénédictions et offices qui rythment le calendrier villageois.',
    chapitres: [
      { id: 'fete-dieu', name: 'La Fête-Dieu', fonds: [] },
      { id: 'benedictions', name: 'Les bénédictions des symboles', fonds: [] },
      { id: 'messes', name: 'Les messes', fonds: [] },
      { id: 'chapelle', name: 'La chapelle', fonds: [] },
      { id: 'fetes-autres', name: 'Autres', fonds: [] },
      { id: 'fetes-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'quotidien',
    name: 'La vie quotidienne',
    intro:
      'Les gestes du quotidien, les objets et les activités forment la trame invisible de l\'histoire de Mase. Ce fonds en préserve la trace.',
    chapitres: [
      { id: 'activites', name: 'Les activités', fonds: [] },
      { id: 'objets', name: 'Les objets', fonds: [] },
      { id: 'quotidien-autres', name: 'Autres', fonds: [] },
      { id: 'quotidien-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'societes',
    name: 'Les sociétés et associations',
    intro:
      'Brancardiers, fanfares, ski-club, chorales : les associations de Mase tissent le lien social du village depuis des générations. Ce fonds retrace leur histoire.',
    chapitres: [
      { id: 'brancardiers', name: 'Les brancardiers', fonds: [] },
      { id: 'fanfares', name: 'Les fanfares', fonds: [{ id: 'clairon-des-alpes', title: 'Histoire du Clairon des Alpes 1890–1990', desc: '100 ans d\'histoire d\'une fanfare de village, 100 ans de fidélité à la musique et de service à la communauté villageoise.', dates: '1890–1990', provenance: 'Plaquette de l\'inauguration du local de la fanfare (1975)', type: 'ecrit', documentFileUrl: '/fonds/societes/clairon-des-alpes-1960.pdf' }] },
      { id: 'ski-club', name: 'Le ski-club', fonds: [] },
      { id: 'chorale', name: 'La chorale', fonds: [] },
      { id: 'societes-autres', name: 'Autres', fonds: [] },
      { id: 'societes-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'nature',
    name: 'La nature',
    intro:
      'Bisses, forêts et paysages d\'altitude : la nature de Mase est indissociable de son histoire humaine. Ce fonds en documente la beauté et les transformations.',
    chapitres: [
      { id: 'bisses', name: 'Les bisses', fonds: [] },
      { id: 'paysages', name: 'Les paysages', fonds: [{ id: 'panoramas-mont-noble-2019', title: 'La Commune de Mont Noble vue du ciel', desc: 'Un panorama exceptionnel des trois villages et de leurs alentours montagneux.', dates: '2019', provenance: '[Ep.24] Le Valais depuis les Airs / Nax, Vernamiège et Mase en été – Shelduck Production', type: 'video', documentFileUrl: 'https://www.youtube.com/watch?v=k4RmOXYKk8s' }] },
      { id: 'nature-autres', name: 'Autres', fonds: [] },
      { id: 'nature-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'patrimoine-bati',
    name: 'Le patrimoine bâti',
    intro:
      'Maisons d\'habitation, raccards, greniers et écuries : le patrimoine bâti de Mase témoigne des techniques de construction traditionnelles et de l\'organisation de la vie villageoise. Ce fonds en retrace l\'histoire.',
    chapitres: [
      { id: 'maisons', name: 'Les maisons d\'habitation', fonds: [] },
      { id: 'raccards-greniers', name: 'Les raccards, les greniers', fonds: [] },
      { id: 'ecuries', name: 'les écuries', fonds: [] },
      { id: 'bati-autres', name: 'Autres', fonds: [
        { id: 'eglise-1910', title: 'L\'église de 1910', desc: 'En 1909, la voûte de l\'église de Nax s\'effondre. Ce tragique événement décide les gens de Mase à construire une nouvelle église.', dates: '1910', provenance: 'Photo anonyme · Expo SD Mase 1990', type: 'photo', imageSrc: '/fonds/patrimoine-bati/eglise-1910.jpg' },
        { id: 'eglise-projet-1978', title: 'Projet de la nouvelle église', desc: 'Plusieurs fissures et la désagrégation du revêtement de la voûte incitent le Conseil de paroisse à mandater des bureaux d\'ingénieurs afin d\'évaluer la situation.', dates: '1978', provenance: 'Photo anonyme · Expo SD Mase 1990', type: 'photo', imageSrc: '/fonds/patrimoine-bati/eglise-projet-1988.jpg' },
      ] },
      { id: 'bati-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'fetes-populaires',
    name: 'Les fêtes populaires',
    intro:
      'Inaugurations, émissions radiophoniques et télévisées : les fêtes populaires rythment la vie de Mase et renforcent les liens entre habitants. Ce fonds en garde la mémoire.',
    chapitres: [
      { id: 'inaugurations', name: 'Les inaugurations', fonds: [] },
      { id: 'emissions', name: 'Les émissions radio/TV', fonds: [] },
      { id: 'fetespop-autres', name: 'Autres', fonds: [] },
      { id: 'fetespop-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'contes-legendes',
    name: 'Les contes et légendes',
    intro:
      'Récits merveilleux et légendes transmises de génération en génération : les contes et légendes de Mase reflètent l\'imaginaire collectif du village. Ce fonds en rassemble les traces écrites et orales.',
    chapitres: [
      { id: 'recits', name: 'Les récits', fonds: [] },
      { id: 'ouvrages', name: 'Les ouvrages', fonds: [] },
      { id: 'contes-autres', name: 'Autres', fonds: [] },
      { id: 'contes-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'communes',
    name: 'Les communes',
    intro:
      'L\'histoire administrative et territoriale des communes valaisannes éclaire le développement de Mase au fil des siècles. Ce fonds en retrace les grandes étapes.',
    chapitres: [
      { id: 'historiques', name: 'Les historiques', fonds: [] },
      { id: 'communes-autres', name: 'Autres', fonds: [] },
      { id: 'communes-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
  {
    slug: 'portraits',
    name: 'Les portraits',
    intro:
      'Personnalités marquantes et enfants du village : les portraits rassemblés ici donnent un visage humain à l\'histoire de Mase.',
    chapitres: [
      { id: 'personnalites', name: 'Les personnalités', fonds: [{ id: 'portrait-werner-stappung', title: 'Werner Pietro Stappung', desc: 'De contrôleur CFF à exploitant des petites parcelles en terrasse, ce ressortissant zurichois s\'est engagé de manière extraordinaire pour la mise en valeur et la sauvegarde de notre patrimoine naturel. Un personnage inspiré par la nature et à plein d\'humour !', dates: '2026', provenance: 'Entretien avec Fabienne Degoumois · © Fabienne Degoumois', type: 'son', audioSrc: '/fonds/portraits/werner-stappung.wav' }] },
      { id: 'enfants', name: 'Les enfants', fonds: [] },
      { id: 'portraits-autres', name: 'Autres', fonds: [] },
      { id: 'portraits-presse', name: 'Articles de presse', fonds: [{ id: 'presse-otto-ossent', title: 'Bourgeois de Mase en Chine', desc: 'M. Otto Ossent, bourgeois de Mase, est assassiné en Chine durant son activité professionnelle d\'ingénieur.', dates: '1900', provenance: 'Gazette du Valais Nr. 47', type: 'ecrit' }] },
    ],
  },
  {
    slug: 'economie',
    name: 'L\'économie',
    intro:
      'Commerces et activités économiques ont façonné le développement de Mase. Ce fonds documente les magasins et acteurs de la vie économique villageoise.',
    chapitres: [
      { id: 'magasins', name: 'Les magasins', fonds: [] },
      { id: 'economie-autres', name: 'Autres', fonds: [{ id: 'memoire-pidoux-1991', title: 'Mémoire de science humaine réalisé par M. Christophe Pidoux', desc: 'L\'étudiant réalise un travail minutieux afin de faire émerger la réalité du village à l\'aide de questionnaires et d\'entretiens individuels.', dates: '1991', provenance: 'Mémoire de fin d\'étude de M. Pidoux', type: 'ecrit', documentFileUrl: '/fonds/economie/memoire-pidoux-1991.pdf' }] },
      { id: 'economie-presse', name: 'Articles de presse', fonds: [] },
    ],
  },
]
