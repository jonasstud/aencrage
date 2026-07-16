# Spec : Page d'accueil Fondation Æncrage

**Date :** 2026-07-16
**Projet :** `aencrage` — Next.js 16 / React 19 / Tailwind v4 / TypeScript
**Source design :** `design/README.md` + `design/Accueil Fondation Æncrage.dc.html` (option 1a)

---

## Objectif

Implémenter la page d'accueil de la Fondation Æncrage en haute fidélité (pixel-perfect) par rapport à l'option 1a du prototype de design, en composants Next.js/Tailwind, avec Framer Motion pour les animations et un responsive de base (mobile → desktop).

---

## Architecture des fichiers

```
app/
  layout.tsx                  ← fonts Google + metadata
  page.tsx                    ← assemblage des sections
  globals.css                 ← tokens CSS Tailwind v4 @theme

components/
  NavHeader.tsx               ← 'use client' (état burger mobile)
  HeroSection.tsx             ← 'use client' (Framer Motion)
  BandeauSection.tsx          ← Server Component
  ActivitesSection.tsx        ← 'use client' (état filter + Framer Motion)
  ValorisationSection.tsx     ← Server Component
  FondationSection.tsx        ← Server Component
  DeposerSection.tsx          ← Server Component (inclut Contact + Footer)

lib/
  data.ts                     ← données statiques (actions, spaces, conseil)
```

---

## Dépendances à ajouter

- `framer-motion` — animations d'entrée et transitions de filtre

---

## Fonts & tokens

### Fonts (`layout.tsx` via `next/font/google`)

| Variable CSS | Famille | Weights |
|---|---|---|
| `--font-display` | Newsreader | 400, 500 + italic |
| `--font-body` | Instrument Sans | 400, 500, 600 |
| `--font-mono` | IBM Plex Mono | 400, 500 |

Remplace les fonts Geist du scaffold initial.

### Tokens (`globals.css` — Tailwind v4 `@theme`)

**Couleurs :**
```css
--color-encre:    #131417;
--color-plume:    #758FB2;
--color-papier:   #FFFFFF;
--color-velin:    #FAFAF8;
--color-gris:     #8A8F98;
--color-laiton:   #A88C5A;
--color-secondaire: #38485C;
--color-placeholder: #EEF1F5;
--color-texte-clair-1: #C3D0E0;
--color-texte-clair-2: #DCE3EC;
```

**Fonts :**
```css
--font-display: var(--font-newsreader);
--font-body:    var(--font-instrument-sans);
--font-mono:    var(--font-ibm-plex-mono);
```

---

## Sections — spécifications

### 1. NavHeader

- Flex, `justify-between`, padding `20px 56px`, `border-bottom: 1px solid #131417`
- Logo : IBM Plex Mono 600, 13px, `tracking-[0.18em]`, uppercase
- Nav : 5 liens (La Fondation, Activités, Valorisation, Déposer, Contact), ancres internes
- Liens : IBM Plex Mono 500, 11px, `tracking-[0.14em]`, uppercase, `border-bottom: 1px solid transparent`
- Hover : `border-bottom-color: #758FB2`, `transition: border-color 0.2s ease`
- **Responsive mobile** : liens cachés, bouton burger → menu déroulant (state `useState` → `'use client'`)

### 2. HeroSection

- Grid 2 col `1.1fr / 0.9fr`, gap 64px, padding `88px 56px 96px`, `align-items: end`
- **Colonne gauche :**
  - Eyebrow "Patrimoine oral & écrit de Mase" — Mono 500, 11px, `tracking-[0.18em]`, `#8A8F98`
  - H1 "Sauvegarder la mémoire d'un village, écrite et racontée" — Newsreader 400, 60px/1.1, max-w 600px
  - Paragraphe — Instrument Sans 400, 17px/1.6, `#38485C`, max-w 500px
  - CTA "Déposer un témoignage" → ancre `#deposer-1a` — bouton fond `#131417`, texte blanc, padding `14px 22px`, Mono 500 11px uppercase
  - Hover CTA : fond `#38485C` + `translateY(-2px)`
- **Colonne droite :** image placeholder ratio `4/5`, fond `#EEF1F5`, `clip-path: polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))` (biseau marque)
- **Animations Framer Motion** (séquencées, `initial: { opacity:0, y:18 }`, `animate: { opacity:1, y:0 }`) :
  - Eyebrow : duration 0.6s, delay 0s
  - H1 : duration 0.7s, delay 0.08s
  - Paragraphe : duration 0.7s, delay 0.16s
  - CTA : duration 0.7s, delay 0.24s
  - Image : fadeIn simple, duration 0.9s, delay 0.1s
- **Responsive** : 1 colonne, image après texte, H1 44px mobile

### 3. BandeauSection

- Fond `#758FB2`, texte blanc, padding `28px 56px`
- Flex `justify-between`, `flex-wrap`
- Citation : Newsreader italic 400, 20px/1.4, max-w 760px
- Lien "En savoir plus →" : Mono 500 11px uppercase, `border-bottom: 1px solid rgba(255,255,255,.6)`
- Hover lien : `border-bottom-color: white`

### 4. ActivitesSection (`'use client'`)

**État :** `filter: string` — valeurs `'Tous' | 'Écrits' | 'Archives' | 'Recherche' | 'Sonore' | 'Portraits'`, défaut `'Tous'`

- ID ancre : `activites-1a`, padding `96px 56px`
- En-tête : eyebrow + H2 "Les actions de la fondation" (Newsreader 400, 34px) à gauche ; chips à droite
- **Chips :** `['Tous','Écrits','Archives','Recherche','Sonore','Portraits']` — border `1px solid #131417`, padding `8px 14px`, radius 2px, Mono 500 10.5px uppercase
  - Actif : fond `#131417`, texte blanc
  - Inactif : fond `#FAFAF8`, texte `#131417`
  - Transition couleurs 0.2s
- **Grille cartes :** 2 col, gap `1px`, fond `rgba(19,20,23,.1)`, border `1px solid rgba(19,20,23,.1)`
  - Chaque carte : fond blanc, padding `28px 32px`
  - Label catégorie : Mono 500 10px uppercase, `#758FB2`
  - Texte : Instrument Sans 400 15px/1.55
  - Hover : `box-shadow: 0 8px 24px rgba(117,143,178,.18)` + `translateY(-2px)`
- **Animation filtre (Framer Motion) :** `AnimatePresence` sur la grille, `key={filter}` force remount, `motion.div` sur chaque carte avec fadeUp 0.45s
- **Données** (source `lib/data.ts`) : 7 actions réparties dans 6 catégories (voir data ci-dessous)
- **Responsive** : 1 colonne

### 5. ValorisationSection

- ID ancre : `valorisation-1a`, padding `0 56px 96px`
- Eyebrow + H2 "Des lieux pour donner à voir et à entendre les archives", max-w 640px
- Grid 3 col, gap 32px
- Chaque carte : image placeholder ratio `4/3`, fond `#EEF1F5`, titre Newsreader 400 20px, description Instrument Sans 400 14px/1.5 `#38485C`
- Hover image : `scale(1.06)` sur 0.4s (`overflow: hidden` sur conteneur)
- **Responsive** : 1 colonne

### 6. FondationSection

- ID ancre : `fondation-1a`, fond `#FAFAF8`, padding `88px 56px`
- Grid 2 col égales, gap 64px
- **Gauche :** eyebrow "La Fondation" + H2 "Préserver le patrimoine immatériel de la société masatte" + paragraphe (Instrument Sans 16px/1.65, `#38485C`)
- **Droite :** eyebrow "Conseil de fondation" + liste 3 membres
  - Chaque ligne : flex `justify-between`, `border-bottom: 1px solid rgba(19,20,23,.12)`, padding `16px 0`
  - Nom : Newsreader 400 17px
  - Rôle : Mono 400 12px uppercase, `#8A8F98`
- **Responsive** : 1 colonne, droite après gauche

### 7. DeposerSection (+ Contact + Footer)

- ID ancres : `deposer-1a` (section), `contact-1a` (div droite)
- Fond `#131417`, texte blanc, padding `88px 56px`
- Grid `1.2fr / 0.8fr`, gap 64px
- **Gauche :**
  - Eyebrow "Déposer un fonds" — Mono 500 11px uppercase, couleur laiton `#A88C5A`
  - H2 "Confiez vos écrits, photographies ou enregistrements à la fondation" — Newsreader 400 32px/1.2
  - Paragraphe — Instrument Sans 15px/1.6, `#C3D0E0`
  - CTA "Nous contacter" → ancre `#contact-1a` — fond blanc, texte `#131417`, Mono 500 11px uppercase
- **Droite :**
  - Eyebrow "Contact" — `#8A8F98`
  - Coordonnées : Instrument Sans 15px/1.8, `#DCE3EC`
  - Lien mailto blanc
- **Footer :** `border-top: 1px solid rgba(255,255,255,.15)`, padding-top 24px, "Fondation Æncrage © 2026" — Mono 400 11px uppercase `#8A8F98`
- **Responsive** : 1 colonne

---

## Données statiques (`lib/data.ts`)

```ts
// Actions
{ cat: 'Écrits',    text: "Identifier et inventorier tous les écrits — officiels ou non — de la communauté masatte." }
{ cat: 'Archives',  text: "Rechercher dans les archives bourgeoisiales, communales, paroissiales et cantonales les documents officiels." }
{ cat: 'Recherche', text: "Rassembler les travaux de recherche universitaires et les documents privés liés au village et à ses habitants." }
{ cat: 'Sonore',    text: "Collecter tous les enregistrements en lien avec la vie communautaire du village." }
{ cat: 'Sonore',    text: "Collaborer avec la Phonothèque nationale, les radios et télévisions afin de rassembler émissions et concerts." }
{ cat: 'Portraits', text: "Recueillir les traces orales et les portraits des habitantes et habitants de Mase." }
{ cat: 'Portraits', text: "Enregistrer les femmes et les hommes, personnalités du village." }

// Espaces de valorisation
{ id: 'space-1', name: 'Maison des Êtres et des Lettres', desc: "Espace principal dédié à la consultation et à la mise en récit des fonds." }
{ id: 'space-2', name: 'Écurie des Chèvres',              desc: "Lieu d'exposition et d'ateliers en lien avec la vie rurale du village." }
{ id: 'space-3', name: 'Moulin',                          desc: "Parcours didactique autour des gestes et des saisons." }

// Conseil de fondation
{ name: 'Annette Corbaz',   role: 'Fondatrice, présidente' }
{ name: 'Anne Colyn',       role: 'Vice-présidente' }
{ name: 'Michel Beytrison', role: 'Secrétaire-trésorier' }
```

---

## Interactions & comportements

- **Filtre activités :** `useState<string>('Tous')` dans `ActivitesSection`. Clic chip → `setFilter`. `AnimatePresence` + `key={filter}` sur le conteneur de cartes force le remount et re-déclenche les animations Framer Motion.
- **Hover nav :** CSS Tailwind `hover:border-b hover:border-plume` (transition via classe Tailwind)
- **Hover CTA hero :** `hover:bg-secondaire hover:-translate-y-0.5` + `transition`
- **Hover cartes activités :** `hover:shadow-[0_8px_24px_rgba(117,143,178,.18)] hover:-translate-y-0.5`
- **Hover images valorisation :** `group-hover:scale-[1.06]` avec `transition-transform duration-400` sur l'image, `overflow-hidden` sur le conteneur
- **Ancres nav :** toutes internes (`href="#activites-1a"` etc.)
- **Biseau marque :** `clip-path` inline sur l'image hero uniquement — ne pas répéter ailleurs

## Images

Toutes les images sont des placeholders (`<div>` fond `#EEF1F5` avec ratio correct). À remplacer par `next/image` quand les vrais assets seront disponibles.

---

## Ce qui est hors scope

- Menu mobile au-delà du toggle burger simple
- Formulaire de dépôt fonctionnel
- CMS / données dynamiques
- Pages secondaires
- SEO avancé (metadata de base suffisante)
