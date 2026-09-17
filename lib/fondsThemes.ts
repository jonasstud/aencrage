import audioPeaksCache from "./audio-peaks.json";

export type FondDocument = {
  label: string;
  url: string;
};

export type Fond = {
  id: string;
  title: string;
  /** Texte résumé — affiché sur la carte du fonds. */
  desc: string;
  /** Texte long — affiché dans la modale (repli sur `desc` si absent). */
  fullText?: string;
  /** Contenu riche Portable Text (fonds Sanity) — préféré à `fullText` quand présent. */
  content?: unknown[];
  dates: string;
  provenance: string;
  type: "photo" | "ecrit" | "son" | "video";
  images?: string[];
  videoUrl?: string;
  documents?: FondDocument[];
  audioSrc?: string;
  audioPeaks?: number[];
};

export type Chapitre = {
  id: string;
  name: string;
  fonds: Fond[];
};

export type ThemePage = {
  slug: string;
  name: string;
  intro: string;
  chapitres: Chapitre[];
};

const _themes: ThemePage[] = [
  {
    slug: "alpage",
    name: "La vie à l'alpage",
    intro:
      "Les alpages de Mase constituent le cœur de la vie pastorale du village. Ce fonds rassemble photographies, écrits et enregistrements témoignant des pratiques et des hommes qui ont façonné ces pâturages d'altitude.",
    chapitres: [
      { id: "inalpe", name: "L'inalpe", fonds: [] },
      { id: "greni", name: "Le Gréni", fonds: [] },
      { id: "cabane", name: "La Cabane", fonds: [] },
      {
        id: "autres",
        name: "Autres",
        fonds: [
          {
            id: "fusion-alpages-1957",
            title: "La fusion des deux alpages de Mase",
            desc: "Avant 1955, les alpages de la Louerre et de l'Arpettaz situés au-dessus de Mase étaient gérés collectivement par des consortages pour exploiter le bétail, produire des laitages et entretenir les terrains. Ce système avait aussi un rôle écologique, car le pâturage limitait les risques d'avalanches et préservait le paysage.",
            dates: "1957",
            provenance: "PV et inscription au RF No 8845",
            type: "ecrit",
            documents: [
              {
                label: "Procès-verbal de fusion (PDF)",
                url: "/fonds/alpage/fusion-alpages-1957.pdf",
              },
            ],
          },
        ],
      },
      { id: "presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "fetes",
    name: "Les fêtes et les symboles religieux",
    intro:
      "Les célébrations religieuses et les symboles sacrés occupent une place centrale dans la vie de Mase. Ce fonds documente processions, bénédictions et offices qui rythment le calendrier villageois.",
    chapitres: [
      { id: "fete-dieu", name: "La Fête-Dieu", fonds: [] },
      { id: "benedictions", name: "Les bénédictions des symboles", fonds: [] },
      { id: "messes", name: "Les messes", fonds: [] },
      { id: "chapelle", name: "La chapelle", fonds: [] },
      {
        id: "fetes-autres",
        name: "Autres",
        fonds: [
          {
            id: "premiere-communion-1973",
            title: "1re Communion à Mase",
            desc: "Héritière de la tradition chrétienne, la communauté de Mase célèbre la 1re communion. C'est un moment clé de l'initiation chrétienne, marquant la première fois qu'un enfant reçoit le pain eucharistique. Elle se déroule généralement à l'issue de deux ans de catéchisme. La première communion est l'un des sept sacrements de l'église catholique, et elle représente un engagement personnel et une intégration complète dans la communauté chrétienne.",
            fullText:
              "Première communion : sens, place dans l'initiation et guide complet pour comprendre\n\nLa première communion est le sacrement de l'Eucharistie reçu pour la première fois. Elle s'inscrit dans le triptyque de l'initiation chrétienne — baptême, confirmation, Eucharistie — et devient souvent pour l'enfant le moment où la foi devient expérience personnelle. Pour les parents comme pour les catéchistes, il s'agit d'accompagner avec clarté : compréhension des gestes, des paroles et des symboles religieux (hostie, calice, croix, encens). Le sens se construit par la préparation catéchétique, les rencontres de groupe, et les temps de prière familiale.\n\nAvant la messe, la préparation sur place inclut l'accueil des invités, la vérification des enfants (tenues, couronnes, boutonnières), et la présence des personnes qui accompagnent : parrain et marraine, catéchiste, famille proche. Le prêtre et l'équipe liturgique organisent souvent une répétition rapide des gestes (s'agenouiller, recevoir la main du prêtre ou aller à la chaise du ministre).\n\nLa liturgie de la Parole est préparée : on choisit parfois une lecture ou un évangile en lien avec l'Eucharistie. Un temps de catéchèse brève peut précéder la messe pour rappeler le sens du sacrement aux enfants et aux invités. À la fraction du pain, le prêtre prononce la prière de consécration ; la communauté répond et se prépare à la communion — moment central.\n\nChoix et symbolique de la tenue première communion : traditions et modernité\n\nLa tenue première communion est riche de sens. Traditionnellement blanche pour symboliser la pureté et la nouvelle vie dans le Christ, la robe ou le costume, la couronne de fleurs et le voile pour les filles renvoient à des siècles de tradition liturgique. Aujourd'hui, les familles mettent souvent l'accent sur la dignité et la simplicité : vêtements sobres, matières naturelles et, lorsque cela est demandé, habits adaptés aux usages locaux ou culturels.\n\nSelon la paroisse, la tenue peut être précisée : robe longue, voile, petit gant, ou costume sombre pour les garçons. Le choix d'objets liturgiques offerts en cadeau (chapelet, médaille) est un prolongement symbolique de la tenue.\n\nTextes religieux, prières et ressources pour la préparation enfants et parents\n\nLa préparation spirituelle passe par la lecture, la prière et la participation active au catéchisme. On privilégie des textes accessibles et des rituels familiers.\n\nParmi les prières incontournables :\nLe Notre Père — prière communautaire par excellence.\nLe Je vous salue Marie — mémoire de l'incarnation et de la demande d'aide.\nLa prière avant la communion — courte invocation demandant la grâce de recevoir.\nUne action de grâce après la messe — parole spontanée pour remercier.\n\nSource : [https://www.eglise-catholique.com/](https://www.eglise-catholique.com/)",
            dates: "Env 1973",
            provenance: "Diapositive Abbé Moix",
            type: "photo",
            images: [
              "/fonds/fetes/premiere-communion-1973.jpg",
              "/fonds/fetes/premiere-communion-1973-02.jpg",
            ],
          },
        ],
      },
      { id: "fetes-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "quotidien",
    name: "La vie quotidienne",
    intro:
      "Les gestes du quotidien, les objets et les activités forment la trame invisible de l'histoire de Mase. Ce fonds en préserve la trace.",
    chapitres: [
      { id: "activites", name: "Les activités", fonds: [] },
      {
        id: "objets",
        name: "Les objets",
        fonds: [
          {
            id: "banc-ane",
            title: "Le banc d'âne",
            desc: "Le texte présente le banc d'âne, un banc de travail en bois servant à bloquer une pièce avec les pieds pour pouvoir la tailler à deux mains. Utilisé par les artisans, paysans et vignerons, c'était un outil simple et pratique pour le travail du bois.",
            fullText:
              "Malgré son nom, il n'a rien à voir avec les punitions scolaires d'autrefois ! Il s'agit d'une sorte de chevalet ou banc de travail façonné avec plus ou moins de soins par les artisans du bois, plus particulièrement peut-être par les vanniers, les fabricants de hottes et les boisseliers. Mais on trouvait aussi dans de nombreuses fermes, car tout paysan consacrait les saisons creuses à des travaux artisanaux. On le trouvait aussi dans le vignoble, car le banc d'âne était par excellence l'établi pour l'échalassier (échalas : pieu planté en terre pour soutenir certaines plantes).\n\nConstitué d'un banc sommaire de 2 m de long posé sur 4 pieds, il porte une entaille longitudinale à une extrémité. Elle laisse passer la queue d'une sorte de massue, « l'âne », souvent taillée dans une branche ou un nœud de bois dur et susceptible de basculer sur une cheville qui tient lieu d'axe. Une seconde cheville traversant la base de la queue ou une sorte de bâti en planches faisant office de pédale permet d'actionner la mâchoire avec les pieds. Plus la pression du pied est forte et plus la mâchoire serre la pièce de bois à travailler. Pièce assez rare sur les bancs d'âne, le ressort permet de libérer plus aisément la mâchoire et maintenir le dispositif ouvert en position de repos. L'artisan a de ce fait les mains libres pour manipuler la « plâne » ou couteau à deux mains.",
            dates: "Début du 20e siècle",
            provenance: "Objet exposé Ecurie de Joseph",
            type: "photo",
            images: ["/fonds/quotidien/banc-ane.jpg"],
          },
        ],
      },
      { id: "quotidien-autres", name: "Autres", fonds: [] },
      { id: "quotidien-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "societes",
    name: "Les sociétés et associations",
    intro:
      "Brancardiers, fanfares, ski-club, chorales : les associations de Mase tissent le lien social du village depuis des générations. Ce fonds retrace leur histoire.",
    chapitres: [
      { id: "brancardiers", name: "Les brancardiers", fonds: [] },
      {
        id: "fanfares",
        name: "Les fanfares",
        fonds: [
          {
            id: "clairon-des-alpes",
            title: "Histoire du Clairon des Alpes 1890–1990",
            desc: "100 ans d'histoire d'une fanfare de village, 100 ans de fidélité à la musique et de service à la communauté villageoise.",
            dates: "1890–1990",
            provenance:
              "Plaquette de l'inauguration du local de la fanfare (1975)",
            type: "ecrit",
            documents: [
              {
                label: "Histoire du Clairon des Alpes 1890–1990 (PDF)",
                url: "/fonds/societes/clairon-des-alpes-1960.pdf",
              },
            ],
          },
        ],
      },
      { id: "ski-club", name: "Le ski-club", fonds: [] },
      { id: "chorale", name: "La chorale", fonds: [] },
      { id: "societes-autres", name: "Autres", fonds: [] },
      { id: "societes-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "nature",
    name: "La nature",
    intro:
      "Bisses, forêts et paysages d'altitude : la nature de Mase est indissociable de son histoire humaine. Ce fonds en documente la beauté et les transformations.",
    chapitres: [
      { id: "bisses", name: "Les bisses", fonds: [] },
      {
        id: "paysages",
        name: "Les paysages",
        fonds: [
          {
            id: "panoramas-mont-noble-2019",
            title: "La Commune de Mont Noble vue du ciel",
            desc: "Un panorama exceptionnel des trois villages et de leurs alentours montagneux.",
            dates: "2019",
            provenance:
              "[Ep.24] Le Valais depuis les Airs / Nax, Vernamiège et Mase en été – Shelduck Production",
            type: "video",
            videoUrl: "https://www.youtube.com/watch?v=k4RmOXYKk8s",
          },
        ],
      },
      { id: "nature-autres", name: "Autres", fonds: [] },
      { id: "nature-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "patrimoine-bati",
    name: "Le patrimoine bâti",
    intro:
      "Maisons d'habitation, raccards, greniers et écuries : le patrimoine bâti de Mase témoigne des techniques de construction traditionnelles et de l'organisation de la vie villageoise. Ce fonds en retrace l'histoire.",
    chapitres: [
      { id: "maisons", name: "Les maisons d'habitation", fonds: [] },
      {
        id: "raccards-greniers",
        name: "Les raccards, les greniers",
        fonds: [],
      },
      {
        id: "ecuries",
        name: "les écuries",
        fonds: [
          {
            id: "ecurie-chevres",
            title: "Ecurie des chèvres",
            desc: "Ancien lieu central de la vie rurale, ce bâtiment accueille aujourd'hui la culture et le patrimoine. Autrefois, les chèvres du village y étaient gardées chaque jour par un chevrier, permettant aux habitants de travailler aux champs.",
            fullText:
              "Située au centre de l'agglomération, cette bâtisse est chargée d'histoire. Aujourd'hui ce bâtiment aménagé sur deux niveaux, voit son affectation exclusivement dédiée à la promotion du patrimoine et de la culture. Jusque vers les années 1960, la chèvre faisait partie de la vie communautaire du village, au même titre que la vache. La vie s'organisait en autarcie, les produits de l'agriculture étaient essentiels à la survie des populations de montagne. Deux écuries étaient organisées pour faire paître les chèvres du village. Le matin, après la traite, les chèvres étaient amenées à l'écurie puis prises en charge par le chevrier qui se chargeait de faire paître les bêtes dans les prairies et pâturages jusqu'en fin de journée. Le soir venu, chaque propriétaire venait à l'écurie retrouver son cheptel pour l'amener chez lui pour la traite du soir. Cette situation permettait alors aux propriétaires du bétail de vaquer à d'autres occupations, généralement dans les champs, tout en ayant la certitude que leurs protégées étaient bien gardées et bien nourries. Ainsi, entre autres, s'organisait la vie du village.",
            dates: "1960",
            provenance: "Amis de Mase",
            type: "video",
            images: ["/images/ecurie-des-chevres.webp"],
            videoUrl: "/fonds/patrimoine-bati/ecurie-chevres-inauguration.mp4",
          },
        ],
      },
      {
        id: "bati-autres",
        name: "Autres",
        fonds: [
          {
            id: "eglise-1910",
            title: "L'église de 1910",
            desc: "En 1909, la voûte de l'église de Nax s'effondre. Ce tragique événement décide les gens de Mase à construire une nouvelle église.",
            dates: "1910",
            provenance: "Photo anonyme · Expo SD Mase 1990",
            type: "photo",
            images: ["/fonds/patrimoine-bati/eglise-1910.jpg"],
          },
          {
            id: "eglise-projet-1978",
            title: "Projet de la nouvelle église",
            desc: "Plusieurs fissures et la désagrégation du revêtement de la voûte incitent le Conseil de paroisse à mandater des bureaux d'ingénieurs afin d'évaluer la situation.",
            dates: "1978",
            provenance: "Photo anonyme · Expo SD Mase 1990",
            type: "photo",
            images: ["/fonds/patrimoine-bati/eglise-projet-1988.jpg"],
          },
        ],
      },
      { id: "bati-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "fetes-populaires",
    name: "Les fêtes populaires",
    intro:
      "Inaugurations, émissions radiophoniques et télévisées : les fêtes populaires rythment la vie de Mase et renforcent les liens entre habitants. Ce fonds en garde la mémoire.",
    chapitres: [
      { id: "inaugurations", name: "Les inaugurations", fonds: [] },
      { id: "emissions", name: "Les émissions radio/TV", fonds: [] },
      { id: "fetespop-autres", name: "Autres", fonds: [] },
      { id: "fetespop-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "contes-legendes",
    name: "Les contes et légendes",
    intro:
      "Récits merveilleux et légendes transmises de génération en génération : les contes et légendes de Mase reflètent l'imaginaire collectif du village. Ce fonds en rassemble les traces écrites et orales.",
    chapitres: [
      {
        id: "recits",
        name: "Les récits",
        fonds: [
          {
            id: "patte-de-lours",
            title: "La patte de l'ours",
            desc: "Légende ou réalité de la patte de l'ours accrochée sur la maison proche de la place de l'église. Ce serait le dernier ours du Val d'Hérens.",
            fullText:
              "Histoire d'Ours…\n\nEncore une Histoire… Et pourquoi pas. Celle-ci, de surcroît, est « historiquement » vraie. Enfin, selon les spécialistes, zoologues et autres naturalistes de tous poils, si l'on ose dire. Et si l'on imaginait que l'imaginaire est bien réel ? Pourquoi pas un conte vrai sur l'un des derniers plantigrades du Val d'Hérens. En plein délire ? Que non ! Il vous suffit de lever l'œil, et vous découvrirez, si vous êtes perspicaces, une authentique patte d'ours clouée sur la façade en mélèze d'une belle bâtisse brunie par le chaud soleil de Mase.\n\nSi l'on oublie le monde de l'imaginaire, on apprend que cette patte d'ours provient bel et bien de l'un des derniers ours tués dans la Val d'Hérens. Certes, les avis divergent et les preuves ne sont pas établies. En nous basant sur un article publié par Jean-Claude Praz, directeur du Musée cantonal d'Histoire naturelle, - que nous remercions au passage pour son obligeance — l'on sait que l'extermination de cet animal nous est connue par les primes versées pour son élimination. Le gouverneur de St-Maurice distribua 20 primes en 1601 et 35 en 1602, pour le territoire compris entre Monthey et la Morge. Peu d'informations par contre pour le XIXe siècle. Les derniers ours sont cités en 1830 à Hérémence et à Mex. Celui d'Hérémence, toujours visible au musée cantonal, est, de l'avis de Jean-Claude Praz, le seul conservé en Valais. À noter que, avant de mourir, l'ours d'Hérémence a mortellement blessé le chasseur qui l'avait atteint.\n\nC'est sans doute à cette époque également que « notre » ours a été abattu. Le guide qui accompagne la nouvelle carte pédestre du Val d'Hérens précise, sous la description du village de Mase : « Une patte d'ours, l'un des derniers abattus en Suisse, se trouve sur un chalet, près de l'église. Le crâne est au carnotzet communal d'Hérémence ».\n\nDans le même ouvrage, on écrit : « Les chèques (forêt située au-dessus du village d'Euseigne) : c'est dans cette forêt que l'un des derniers ours de Suisse a été abattu. ».\n\nComment donc cette patte d'ours a-t-elle abouti à Mase ? Un habitant du lieu a-t-il été mêlé à la chasse à l'ours ? Était-ce un braconnier ou seulement un « amateur » de primes ?\n\nEn définitive peu importe. Il me paraît intéressant de s'imaginer nos forêts habitées par ces mammifères carnassiers, patauds, gourmands (ils adorent le miel, paraît-il !) qui devaient hanter les esprits de nos montagnards, au siècle dernier. Peut-être, se promenait-on avec des clochettes, comme au Canada, pour ne pas surprendre l'animal ?\n\nL'ours a existé. Il a vécu dans notre vallée, il n'y a pas si longtemps. Les faits sont établis. Quant au reste, et si on rêvait ? Ambiance feutrée et quelque peu fébrile, d'une soirée au coin du feu où grand-mère raconte avec force détails les frasques de l'animal aux griffes impressionnantes, les enfants qui se blottissent contre leur mère, les yeux écarquillés. Des bruits suspects dans le bois voisin, des craquements sinistres, un pas lourd qui s'approche, le souffle même du monstre perceptible, puis, plus rien…\n\nMais au fait, cette histoire de patte d'ours, n'est-ce pas un pur produit d'une imagination débridée ?",
            dates: "1600",
            provenance: "Raphy Crettaz Mase",
            type: "ecrit",
            documents: [
              {
                label: "Légende de la patte de l'ours (PDF)",
                url: "/fonds/contes-legendes/legende-patte-ours.pdf",
              },
              {
                label:
                  "Extrait « L'ours » — Les Sèves d'enfance, Maurice Zermatten (PDF)",
                url: "/fonds/contes-legendes/seves-denfance-lours.pdf",
              },
            ],
          },
        ],
      },
      { id: "ouvrages", name: "Les ouvrages", fonds: [] },
      { id: "contes-autres", name: "Autres", fonds: [] },
      { id: "contes-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "communes",
    name: "Les communes",
    intro:
      "L'histoire administrative et territoriale des communes valaisannes éclaire le développement de Mase au fil des siècles. Ce fonds en retrace les grandes étapes.",
    chapitres: [
      { id: "historiques", name: "Les historiques", fonds: [] },
      {
        id: "communes-autres",
        name: "Autres",
        fonds: [
          {
            id: "fusion-communes-mont-noble",
            title: "La Commune de Mont-Noble",
            desc: "Le 7 septembre 2008, les citoyens des communes de Nax, Vernamiège et Mase acceptent le projet de fusion. Après approbation par le Grand Conseil valaisan, la nouvelle commune nommée Mont-Noble, voit le jour le 1er janvier 2011.",
            fullText:
              "À découvrir dans la presse :\n[Valais: fusion de trois communes | RTS](https://www.rts.ch/info/suisse/1178083-valais-fusion-de-trois-communes.html)\n[Nax, Mase et Vernamiège (VS): le contrat de fusion des trois communes a été accepté lors des votations de cette fin de semaine - 19h30 - Play RTS](https://www.rts.ch/play/tv/19h30/video/nax-mase-et-vernamiege-vs-le-contrat-de-fusion-des-trois-communes-a-ete-accepte-lors-des-votations-de-cette-fin-de-semaine?urn=urn:rts:video:1484121)\n\nHistorique\nLe 7 septembre 2008, les citoyens des communes de Nax, Vernamiège et Mase acceptent le projet de fusion. Après approbation par le Grand Conseil valaisan, la nouvelle commune nommée Mont-Noble, voit le jour le 1er janvier 2011.\n\nArmoirie\nLe blason dont les signes héraldiques contemporains permettent l'identification du nom, du lieu et de l'histoire. D'azur sur (une) champagne de sinople, un mont d'argent surmonté de trois étoiles à cinq rais d'or.\n\nGéographie\nLa Commune occupe un espace qui s'étale des gorges de la Borgne à 530 m jusqu'aux Becs de Bosson dont son sommet culmine à 3132 m. Sa superficie est de 4'300 ha. Surplombant la vallée du Rhône et l'entrée du Val d'Hérens, les trois villages pittoresques qui la composent, s'étendent sur un peu plus de 5 km, entre 1300 et 1340 m d'altitude.\n\nPopulation résidente\n1'181 habitants au 31.12.2024\n\nTrois villages : Nax, Vernamiège et Mase.\nCes trois villages font partie du val d'Hérens aux multiples curiosités, le pays des raccards, des combats de reines, de la raclette et du fendant de leurs vignobles. Pour connaître, en partie, l'histoire ancienne de ces villages, vous pouvez consulter les textes de [l'armorial valaisan](http://doc.rero.ch/record/17328?ln=fr).",
            dates: "2024",
            provenance: "Site de la commune de Mont-Noble",
            type: "ecrit",
            images: ["/fonds/communes/armoiries-mont-noble.svg"],
          },
        ],
      },
      { id: "communes-presse", name: "Articles de presse", fonds: [] },
    ],
  },
  {
    slug: "portraits",
    name: "Les portraits",
    intro:
      "Personnalités marquantes et enfants du village : les portraits rassemblés ici donnent un visage humain à l'histoire de Mase.",
    chapitres: [
      {
        id: "personnalites",
        name: "Les personnalités",
        fonds: [
          {
            id: "portrait-werner-stappung",
            title: "Werner Pietro Stappung",
            desc: "De contrôleur CFF à exploitant des petites parcelles en terrasse, ce ressortissant zurichois s'est engagé de manière extraordinaire pour la mise en valeur et la sauvegarde de notre patrimoine naturel. Un personnage inspiré par la nature et ... plein d'humour !",
            dates: "2026",
            provenance:
              "Entretien avec Fabienne Degoumois · © Fabienne Degoumois",
            type: "son",
            audioSrc: "/fonds/portraits/werner-stappung.mp3",
            images: ["/fonds/portraits/werner-stappung.jpg"],
          },
        ],
      },
      { id: "enfants", name: "Les enfants", fonds: [] },
      { id: "portraits-autres", name: "Autres", fonds: [] },
      {
        id: "portraits-presse",
        name: "Articles de presse",
        fonds: [
          {
            id: "presse-otto-ossent",
            title: "Bourgeois de Mase en Chine",
            desc: "M. Otto Ossent, bourgeois de Mase, est assassiné en Chine durant son activité professionnelle d'ingénieur.",
            fullText:
              "Il résulte d'un télégramme communiqué par l'autorité fédérale à notre Conseil d'état qu'un de nos compatriotes, M. l'ingénieur Otto Ossent, avec Mme Astié et un autre ingénieur suisse, M. Caddei, dont la famille habiterait Nice, viendraient de périr tragiquement en Chine.\n\nM. Ossent, bien connu en Valais et bourgeois de Mase, était depuis six mois chef de service à la construction de la ligne Pékin-Homkow. Tous trois ont dû être les victimes des Boxers, secte redoutable qui fait beaucoup parler d'elle en ce moment par les troubles signalés du Céleste Empire. On sait que les Boxers sont les ennemis déclarés des Européens, dont ils entravent par tous les moyens l'entrée et l'action sur leur territoire. Tous les efforts faits pour retrouver notre concitoyen et ses compagnons ont été vains, et les Cosaques envoyés pour tenter de les délivrer ont été repoussés. Divers rapports concordants arrivés à la Légation suisse de Paris affirment qu'ils sont morts tous les trois.\n\nMme Astié, d'origine française, avait été engagée par M. Ossent pour s'occuper de son ménage. L'épouse de ce dernier était actuellement domiciliée avec ses deux enfants en Grèce, d'où elle était originaire avant son mariage. Ces derniers détails ont été fournis par un frère de M. Ossent, employé au bureau topographique fédéral, à Berne.\n\nNous ne possédons pas de plus amples renseignements sur cette lugubre affaire, dont nous ne manquerons pas d'entretenir nos lecteurs en cas d'informations nouvelles plus précises.",
            dates: "1900",
            provenance: "Gazette du Valais Nr. 47",
            type: "ecrit",
            documents: [
              {
                label: "Article original — Gazette du Valais (PDF)",
                url: "/fonds/portraits/bourgeois-mase-chine-1900.pdf",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "economie",
    name: "L'économie",
    intro:
      "Commerces et activités économiques ont façonné le développement de Mase. Ce fonds documente les magasins et acteurs de la vie économique villageoise.",
    chapitres: [
      { id: "magasins", name: "Les magasins", fonds: [] },
      {
        id: "economie-autres",
        name: "Autres",
        fonds: [
          {
            id: "memoire-pidoux-1991",
            title:
              "Mémoire de science humaine réalisé par M. Christophe Pidoux",
            desc: "L'étudiant réalise un travail minutieux afin de faire émerger la réalité du village à l'aide de questionnaires et d'entretiens individuels.",
            dates: "1991",
            provenance: "Mémoire de fin d'étude de M. Pidoux",
            type: "ecrit",
            documents: [
              {
                label: "Mémoire de fin d'étude (PDF)",
                url: "/fonds/economie/memoire-pidoux-1991.pdf",
              },
            ],
          },
        ],
      },
      { id: "economie-presse", name: "Articles de presse", fonds: [] },
    ],
  },
];

const _peaksCache = audioPeaksCache as Record<string, number[]>;

export const themes: ThemePage[] = _themes.map((theme) => ({
  ...theme,
  chapitres: theme.chapitres.map((chapitre) => ({
    ...chapitre,
    fonds: chapitre.fonds.map((fond) =>
      _peaksCache[fond.id] ? { ...fond, audioPeaks: _peaksCache[fond.id] } : fond
    ),
  })),
}));
