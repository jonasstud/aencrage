# Archivage automatique du "Fond du mois" vers les fonds par thématiques

Date : 2026-09-17

## Contexte

Le site de la Fondation æncrage présente un "Fond du mois" (`fondDuMois`), un
singleton Sanity édité en place : un seul document, toujours réécrit au même
`_id`. Quand le client remplace son contenu par un nouveau fond, l'ancien
contenu est perdu — rien ne l'archive automatiquement dans la liste des
"fonds par thématiques" présentée sur les pages `/fonds/[theme]`.

Ces pages thématiques ne sont aujourd'hui **pas pilotées par Sanity** : elles
lisent un fichier TypeScript statique, [`aencrage/lib/fondsThemes.ts`](../../lib/fondsThemes.ts),
qui contient en dur 11 thématiques, leurs chapitres, et les fonds déjà
documentés (textes, images, PDF, audio référencés dans `/public`).

## Objectif

Quand le client clique sur un bouton dédié dans le Studio Sanity, le fond du
mois actuellement publié doit être automatiquement copié dans la liste des
fonds par thématiques (sous la thématique et le chapitre qu'il a choisis),
puis le formulaire du fond du mois doit se vider pour accueillir le contenu
du mois suivant.

Cela suppose de faire exister les fonds par thématiques dans Sanity au
préalable — ils n'y sont pas aujourd'hui. Le périmètre inclut donc la
migration complète des 11 thématiques existantes.

## Non-objectifs

- Pas de système de validation/dropdown dynamique pour le champ "chapitre"
  (liste filtrée par thématique) : un seul éditeur utilise ce champ, une
  fois par mois, un champ texte libre avec description suffit. Une
  validation plus stricte peut être ajoutée plus tard si elle s'avère
  nécessaire.
- Pas de gestion de plusieurs "fonds du mois" en parallèle ni d'historique
  de versions au-delà de l'archivage — un seul singleton, comme aujourd'hui.
- Pas de refonte visuelle des pages `/fonds/[theme]` : les composants
  d'affichage existants (`ThemeHero`, `ThemePageBody`, `ThemeSummary`,
  `ChapitreSection`, `FondCard`, `FondModal`) sont conservés, seule leur
  source de données change.

## Contraintes

- Rester dans les limites du plan gratuit Sanity (10 000 documents,
  100 Go d'assets, webhooks GROQ inclus avec limites). Le volume actuel
  (11 thématiques, quelques dizaines de fonds) en est très loin.

## 1. Modèle de données Sanity

### Nouveau type `theme` (document)

Fichier : `studio-aencrage/schemaTypes/theme.ts`

| Champ | Type | Notes |
|---|---|---|
| `title` | string, requis | Nom affiché (ex. "La vie à l'alpage") |
| `slug` | slug, requis, source = `title` | Utilisé dans l'URL `/fonds/[theme]` |
| `intro` | text | Texte d'introduction de la page thématique |
| `chapitres` | array of object `{ id: string (slug-like), name: string }` | Liste des chapitres connus pour cette thématique, dans l'ordre d'affichage. Reprend la structure actuelle de `Chapitre` (sans les fonds, qui vivent maintenant comme documents séparés). |
| `ordre` | number | Ordre d'affichage dans la navigation/liste des thématiques |

### Nouveau type `fond` (document)

Fichier : `studio-aencrage/schemaTypes/fond.ts`

Reprend à l'identique les champs de contenu de `fondDuMois`
(`title`, `typeFond`, `donateur`, `chapo`, `couverture`, `content`,
`gallery`, `documents`, `audioFiles` — voir
`studio-aencrage/schemaTypes/fondDuMois.ts` pour la définition exacte de
chaque champ, y compris les sous-champs `alt` requis sur les images), plus :

| Champ | Type | Notes |
|---|---|---|
| `theme` | reference → `theme`, requis | Thématique de rattachement |
| `chapitre` | string, requis | Nom du chapitre. Champ texte libre avec `description` invitant à réutiliser un nom de chapitre existant pour la thématique choisie. |
| `dates` | string | Reprend `Fond.dates` du modèle actuel (ex. "1957", "Env 1973", "1890–1990") |
| `videoUrl` | url | Lien vidéo (YouTube ou fichier vidéo hébergé). Absent du schéma `fondDuMois` actuel alors que "Vidéo" est déjà une valeur possible de `typeFond` — ajouté ici et sur `fondDuMois` pour combler cette lacune (2 fonds existants l'utilisent : `panoramas-mont-noble-2019`, `ecurie-chevres`). |

Pas de champ `provenance` séparé : le champ `donateur` déjà présent sur
`fondDuMois` ("Nom du donateur ou origine géographique du fond") couvre le
même rôle que `Fond.provenance` de l'ancien modèle. La migration mappe
`provenance` → `donateur`. Ce choix garde `fond` structurellement identique
à `fondDuMois`, ce qui simplifie la copie champ-à-champ lors de l'archivage.

Remarque d'implémentation : les types actuels `Fond.type` (`photo`/`ecrit`/`son`/`video`,
valeur unique) et `fondDuMois.typeFond` (tableau multi-valeurs
`Photo`/`Écrit`/`Son`/`Vidéo`) ne sont pas identiques. Le champ `fond.typeFond`
réutilise le tableau multi-valeurs de `fondDuMois` pour rester cohérent côté
Studio et permettre à un fond de cumuler plusieurs types (ex. photo + son).
Côté front, les composants d'affichage (`FondCard`, `FondModal`) qui
attendent aujourd'hui une valeur `type` unique utilisent la première valeur
du tableau comme type principal (icône/couleur), le tableau complet restant
disponible si un affichage multi-badges est souhaité plus tard.

### `fondDuMois` — champs ajoutés

Trois champs ajoutés au schéma existant :
- `theme` : reference → `theme`, requis avant archivage (voir validation
  dans l'action custom ci-dessous — pas de `validation: required()` bloquant
  au niveau du schéma, pour ne pas empêcher de sauvegarder un brouillon en
  cours de rédaction avant d'avoir choisi une thématique).
- `chapitre` : string, même logique que sur `fond`.
- `videoUrl` : url, optionnel — comble la même lacune que sur `fond` (voir
  ci-dessous), pour qu'un fond du mois de type "Vidéo" puisse effectivement
  porter un lien vidéo avant d'être archivé.

### `schemaTypes/index.ts`

Enregistrer les deux nouveaux types :
```ts
export const schemaTypes = [activite, fondDuMois, theme, fond]
```

## 2. Action custom "Nouveau fond du mois"

Fichier : `studio-aencrage/actions/newFondDuMois.ts` (nouveau dossier
`actions/`), branché dans `sanity.config.ts` via `document.actions`.

Visible uniquement quand `schemaType === 'fondDuMois'`. Comportement au clic :

1. Lit la version **publiée** du document `fondDuMois` (pas le brouillon).
2. Si `theme` ou `chapitre` est vide → affiche un toast d'erreur ("Merci de
   choisir une thématique et un chapitre avant d'archiver ce fond") et
   n'effectue aucune action.
3. Si le document publié n'a pas de `title` (cas du tout premier archivage,
   document vide) → n'effectue aucune action (rien à archiver), ouvre
   simplement le formulaire pour saisie.
4. Sinon :
   - Crée un nouveau document `fond` (id généré automatiquement) en copiant
     tous les champs pertinents du `fondDuMois` publié, y compris `theme` et
     `chapitre`. Les références d'assets (images/fichiers) sont réutilisées
     telles quelles (pas de duplication de fichier binaire — Sanity permet
     à plusieurs documents de référencer le même asset).
   - Vide le **brouillon** de `fondDuMois` (tous les champs remis à vide,
     y compris `theme`/`chapitre`) sans le publier — le client garde le
     contenu publié existant visible sur le site jusqu'à ce qu'il publie le
     nouveau, mais peut désormais éditer un formulaire vierge.
   - Affiche un toast de confirmation avec un lien vers le nouveau document
     `fond` créé.

## 3. Migration des données existantes

Script one-off : `studio-aencrage/scripts/migrate-fonds-themes.mjs`
(exécuté une fois via `npx sanity exec`, avec un token Sanity possédant les
droits d'écriture, puis supprimé/archivé après usage).

Étapes :
1. Importer `themes` depuis `aencrage/lib/fondsThemes.ts`.
2. Pour chaque thématique : créer un document `theme` (title, slug, intro,
   chapitres `{id, name}`, ordre = index dans le tableau).
3. Pour chaque fond de chaque chapitre :
   - Uploader les fichiers référencés (`images[]`, `documents[].url`,
     `audioSrc`) depuis `aencrage/public/...` vers Sanity comme assets
     (`client.assets.upload`), en resolvant le chemin local à partir de
     l'URL relative.
   - Convertir `fullText` (texte brut, paragraphes séparés par `\n\n`,
     liens au format `[texte](url)`) en blocs Portable Text (paragraphes +
     annotations `link`). À défaut de `fullText`, utiliser `desc` comme
     unique paragraphe de `content`.
   - Créer le document `fond` avec la référence à son `theme`, son
     `chapitre` (nom repris tel quel du chapitre parent), `dates`,
     `donateur` (mappé depuis `provenance`), `typeFond` (mappé depuis `type`
     singulier vers le tableau `typeFond`), `videoUrl` (mappé depuis
     `videoUrl`), `gallery`/`couverture`, `documents`, `audioFiles`.
4. Script idempotent autant que possible (vérifie par un `_id` déterministe
   dérivé du `slug`/`id` d'origine si relancé), pour pouvoir corriger et
   relancer sans dupliquer en cas d'erreur en cours de route.
5. Après vérification manuelle du contenu migré dans le Studio, retirer la
   lecture de `fondsThemes.ts` du code Next.js (le fichier et
   `audio-peaks.json` sont conservés dans le repo comme référence/sauvegarde
   mais ne sont plus importés).

## 4. Côté site (Next.js)

### Requêtes GROQ

Nouvelles requêtes dans `aencrage/lib/sanity/queries.ts` :
- `THEMES_QUERY` : liste des thématiques (pour `generateStaticParams` et la
  page d'index `/fonds`).
- `THEME_BY_SLUG_QUERY` : une thématique + tous ses fonds, groupés par
  `chapitre`, avec assets dé-référencés (même pattern que
  `FOND_DU_MOIS_QUERY`).

### Adaptateur de données

Une fonction dans `aencrage/lib/sanity/adapters.ts` mappe le résultat GROQ
vers les types `ThemePage`/`Chapitre`/`Fond` déjà utilisés par les
composants d'affichage (`ThemeHero`, `ThemePageBody`, etc.), pour minimiser
les changements dans ces composants. Les fonds sont regroupés par valeur de
`chapitre` (les chapitres sans fond n'apparaissent que s'ils sont listés
dans `theme.chapitres`, pour conserver l'affichage actuel des sections
vides/à venir).

### `app/fonds/[theme]/page.tsx`

`generateStaticParams` et le chargement des données passent de la lecture
du fichier statique à un appel au client Sanity (`THEMES_QUERY` /
`THEME_BY_SLUG_QUERY`).

### Fraîcheur du contenu (revalidation)

- Nouvelle route `aencrage/app/api/revalidate/route.ts` : reçoit un webhook
  Sanity signé, vérifie la signature (`@sanity/webhook`), et appelle
  `revalidatePath`/`revalidateTag` pour les pages `/fonds` concernées.
- Webhook GROQ configuré côté Sanity (projet `dhukk50e`) déclenché sur
  `_type in ["fond", "theme", "fondDuMois"]`, pointant vers cette route.
- Les requêtes GROQ utilisent des `tags` Next.js (`sanityFetch` avec
  `next: { tags: [...] }`) pour permettre une invalidation ciblée.

## 5. Gestion des erreurs / cas limites

- **Archivage sans thématique/chapitre choisis** : bloqué avec message
  d'erreur (section 2, étape 2).
- **Premier archivage (fondDuMois vide)** : no-op silencieux, pas d'erreur
  bloquante (section 2, étape 3).
- **Échec réseau pendant la création du document `fond`** : l'action
  n'efface le brouillon de `fondDuMois` qu'après confirmation de la
  création réussie du `fond` (pas de perte de contenu si la création
  échoue).
- **Thématique supprimée alors qu'elle est référencée** : hors périmètre
  (pas de protection contre la suppression d'une thématique référencée —
  comportement standard de Sanity, un `theme` supprimé laisse une référence
  cassée visible dans le Studio).

## 6. Tests

- Tests manuels dans le Studio (pas d'environnement de test automatisé
  existant pour `studio-aencrage`) : cas nominal, cas thématique/chapitre
  manquants, cas premier archivage.
- Script de migration : exécution sur le dataset `production` après
  vérification sur un dataset de test si possible (`npx sanity dataset
  copy production migration-test`), relecture manuelle du contenu importé
  dans le Studio avant de basculer le front.
- Front : vérification visuelle des pages `/fonds/[theme]` après migration
  (comparaison avec le rendu actuel basé sur les données statiques) et
  vérification que la revalidation fonctionne après publication d'un
  nouveau fond.

## Risques identifiés

- **Conversion `fullText` → Portable Text** : certains textes contiennent
  des liens markdown et des sauts de ligne ; la conversion automatique doit
  être vérifiée manuellement pour chaque fond migré (une dizaine de fonds
  avec `fullText`, volume gérable).
- **Champ `chapitre` en texte libre** : risque de faute de frappe créant un
  groupe de chapitre différent de l'existant. Accepté comme compromis
  pragmatique (voir Non-objectifs) ; à revisiter si le nombre d'éditeurs
  augmente.
- **Champ vidéo manquant** dans le schéma actuel de `fondDuMois` : comblé en
  ajoutant `videoUrl` aux deux schémas (voir section 1).
