export type Fond = {
  id: string
  title: string
  desc: string
  dates: string
  provenance: string
  type: 'photo' | 'ecrit' | 'son'
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
      {
        id: 'inalpe',
        name: 'L\'inalpe',
        fonds: [
          {
            id: 'inalpe-1',
            title: 'Montée à l\'alpage, famille Aymon, 1962',
            desc: 'Portrait de famille lors de la montée à l\'alpage de Tracuit. Les enfants portent les ustensiles de cuisine tandis que les adultes guident le bétail sur le sentier.',
            dates: '1962',
            provenance: 'Don famille Aymon, 2018',
            type: 'photo',
          },
          {
            id: 'inalpe-2',
            title: 'Registre des fromages, 1947–1956',
            desc: 'Carnet manuscrit listant la production fromagère journalière avec annotations sur la qualité du lait et les conditions climatiques de chaque saison.',
            dates: '1947–1956',
            provenance: 'Archives communales de Mase',
            type: 'ecrit',
          },
          {
            id: 'inalpe-3',
            title: 'Chants de l\'inalpe enregistrés à Mase, 1978',
            desc: 'Enregistrement de chants traditionnels lors de la montée des troupeaux, recueillis par l\'abbé Berthouzoz lors de sa mission d\'inventaire du patrimoine oral.',
            dates: '1978',
            provenance: 'Phonothèque nationale suisse',
            type: 'son',
          },
        ],
      },
      {
        id: 'greni',
        name: 'Le Gréni',
        fonds: [
          {
            id: 'greni-1',
            title: 'Intérieur du gréni communal, 1955',
            desc: 'Vue intérieure montrant les étagères chargées de fromages en affinage et les outils traditionnels : racloirs, chaudrons de cuivre et moules en bois cerclé.',
            dates: '1955',
            provenance: 'Don anonyme, 2021',
            type: 'photo',
          },
          {
            id: 'greni-2',
            title: 'Plan du gréni de Mase, 1903',
            desc: 'Dessin architectural du bâtiment communal avec annotations sur les agrandissements prévus et les matériaux de construction employés.',
            dates: '1903',
            provenance: 'Archives bourgeoisiales de Mase',
            type: 'ecrit',
          },
        ],
      },
      {
        id: 'cabane',
        name: 'La Cabane',
        fonds: [
          {
            id: 'cabane-1',
            title: 'La cabane de Tracuit avant les travaux de 1971',
            desc: 'Façade de la cabane avec alpinistes posant devant l\'entrée à l\'été 1968. On distingue en arrière-plan la paroi nord du Zinalrothorn.',
            dates: '1968',
            provenance: 'Collection Section Monte Rosa CAS',
            type: 'photo',
          },
          {
            id: 'cabane-2',
            title: 'Journal de la cabane, 1965–1970',
            desc: 'Registre des passages avec noms des visiteurs, conditions météo quotidiennes et remarques des guides sur l\'état des voies d\'accès.',
            dates: '1965–1970',
            provenance: 'Archives CAS Valais',
            type: 'ecrit',
          },
          {
            id: 'cabane-3',
            title: 'Interview du gardien Alphonse Pont, 1982',
            desc: 'Témoignage oral du gardien retraité sur la vie à la cabane pendant les grandes décennies d\'alpinisme, les accidents et les moments de grâce.',
            dates: '1982',
            provenance: 'Fonds RTS archives',
            type: 'son',
          },
        ],
      },
      {
        id: 'autres',
        name: 'Autres',
        fonds: [
          {
            id: 'autres-1',
            title: 'Troupeau sur le plateau de Tracuit, 1959',
            desc: 'Vue panoramique du troupeau en pâture avec en arrière-plan les Dents de Morcles. Cliché pris lors d\'une excursion organisée par la commune.',
            dates: '1959',
            provenance: 'Collection Roger Favre',
            type: 'photo',
          },
          {
            id: 'autres-2',
            title: 'Contrat de location des herbages, 1938',
            desc: 'Document officiel fixant les droits de pâturage et les redevances dues à la commune pour la saison estivale, signé par les propriétaires de bétail.',
            dates: '1938',
            provenance: 'Archives communales de Mase',
            type: 'ecrit',
          },
        ],
      },
      {
        id: 'presse',
        name: 'Articles de presse',
        fonds: [
          {
            id: 'presse-1',
            title: 'L\'alpage de Tracuit en péril, Le Rhône, 1978',
            desc: 'Article décrivant les difficultés économiques de l\'alpage face à l\'exode rural et proposant des pistes de revitalisation soutenues par le canton.',
            dates: '1978',
            provenance: 'Médiathèque Valais, fonds presse',
            type: 'ecrit',
          },
          {
            id: 'presse-2',
            title: 'Retour des alpages, Le Nouvelliste, 1962',
            desc: 'Reportage photographique et témoignages sur la désalpe, tradition encore vivante à Mase, avec portraits des familles participantes.',
            dates: '1962',
            provenance: 'Médiathèque Valais, fonds presse',
            type: 'ecrit',
          },
        ],
      },
    ],
  },
  {
    slug: 'fetes',
    name: 'Les fêtes et les symboles religieux',
    intro:
      'Les célébrations religieuses et les symboles sacrés occupent une place centrale dans la vie de Mase. Ce fonds documente processions, bénédictions et offices qui rythment le calendrier villageois.',
    chapitres: [
      { id: 'fete-dieu', name: 'La Fête-Dieu', fonds: [{ id: 'fete-dieu-1', title: 'Procession de la Fête-Dieu (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'benedictions', name: 'Les bénédictions des symboles', fonds: [{ id: 'bened-1', title: 'Bénédiction des champs (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'messes', name: 'Les messes', fonds: [{ id: 'messes-1', title: 'Messe de Pâques (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
      { id: 'chapelle', name: 'La chapelle', fonds: [{ id: 'chapelle-1', title: 'Chapelle de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'fetes-autres', name: 'Autres', fonds: [{ id: 'fetes-autres-1', title: 'Autre document (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
      { id: 'fetes-presse', name: 'Articles de presse', fonds: [{ id: 'fetes-presse-1', title: 'Article de presse (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
    ],
  },
  {
    slug: 'quotidien',
    name: 'La vie quotidienne',
    intro:
      'Les gestes du quotidien, les objets et les activités forment la trame invisible de l\'histoire de Mase. Ce fonds en préserve la trace.',
    chapitres: [
      { id: 'activites', name: 'Les activités', fonds: [{ id: 'activites-1', title: 'Activité quotidienne (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'objets', name: 'Les objets', fonds: [{ id: 'objets-1', title: 'Objet du quotidien (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'quotidien-autres', name: 'Autres', fonds: [{ id: 'quotidien-autres-1', title: 'Autre document (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
      { id: 'quotidien-presse', name: 'Articles de presse', fonds: [{ id: 'quotidien-presse-1', title: 'Article de presse (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
    ],
  },
  {
    slug: 'societes',
    name: 'Les sociétés et associations',
    intro:
      'Brancardiers, fanfares, ski-club, chorales : les associations de Mase tissent le lien social du village depuis des générations. Ce fonds retrace leur histoire.',
    chapitres: [
      { id: 'brancardiers', name: 'Les brancardiers', fonds: [{ id: 'brancardiers-1', title: 'Brancardiers de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'fanfares', name: 'Les fanfares', fonds: [{ id: 'fanfares-1', title: 'Fanfare de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'ski-club', name: 'Le ski-club', fonds: [{ id: 'ski-1', title: 'Ski-club de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'chorale', name: 'La chorale', fonds: [{ id: 'chorale-1', title: 'Chorale de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'son' }] },
      { id: 'societes-autres', name: 'Autres', fonds: [{ id: 'societes-autres-1', title: 'Autre document (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
      { id: 'societes-presse', name: 'Articles de presse', fonds: [{ id: 'societes-presse-1', title: 'Article de presse (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
    ],
  },
  {
    slug: 'nature',
    name: 'La nature',
    intro:
      'Bisses, forêts et paysages d\'altitude : la nature de Mase est indissociable de son histoire humaine. Ce fonds en documente la beauté et les transformations.',
    chapitres: [
      { id: 'bisses', name: 'Les bisses', fonds: [{ id: 'bisses-1', title: 'Bisse de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'paysages', name: 'Les paysages', fonds: [{ id: 'paysages-1', title: 'Paysage de Mase (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'photo' }] },
      { id: 'nature-autres', name: 'Autres', fonds: [{ id: 'nature-autres-1', title: 'Autre document (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
      { id: 'nature-presse', name: 'Articles de presse', fonds: [{ id: 'nature-presse-1', title: 'Article de presse (contenu à renseigner)', desc: 'Contenu à renseigner par le client.', dates: '—', provenance: '—', type: 'ecrit' }] },
    ],
  },
]
