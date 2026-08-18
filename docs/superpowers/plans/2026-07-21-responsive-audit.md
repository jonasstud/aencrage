# Audit responsive — Fondation AEncrage

**Contexte :** projet Next.js (App Router) + Tailwind v4, développé desktop-first, non responsive. Objectif : réparer les pages/composants ciblés du mobile au desktop sans réécrire le projet en mobile-first.

**Breakpoints Tailwind (défauts, non modifiés dans `globals.css`) :** `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px. Le code n'utilise aujourd'hui que `md:`. Aucun composant du repo n'est réutilisé dans des parents de largeur variable (`FondCard` n'apparaît que dans une grille `auto-fill` intrinsèque déjà correcte) → tout le responsive ici est piloté par le **viewport**, pas de container queries nécessaires pour cette passe.

**Note :** `aencrage/AGENTS.md` indique que Next 16 (installé, `next@16.2.10`) a des breaking changes et invite à lire `node_modules/next/dist/docs/` avant de coder — le dossier existe. À garder en tête pour l'implémentation.

---

## Niveau 1 — Structure de page (`page-layout`, propriétaire = viewport)

### 1. Hero d'accueil verrouillé en hauteur d'écran
- **Fichiers :** [app/page.tsx:11](../../../app/page.tsx#L11), [components/HeroSection.tsx:18](../../../components/HeroSection.tsx#L18)
- **Symptôme :** `h-[calc(100dvh-5rem)]` fige la section Hero+Bandeau à la hauteur du viewport. Avec `items-end` et un H1 qui wrap sur plusieurs lignes en français, le contenu peut être coupé ou écrasé sur petit écran (iPhone SE, mode paysage).
- **Approche :** desktop-down (`max-*`) — ne verrouiller la hauteur qu'à partir de `md:h-[calc(100dvh-5rem)]` ; hauteur intrinsèque (auto / `min-h-fit`) en dessous de `md`.
- **Propriétaire :** viewport.

### 2. Hero de thématique — même verrou, version `min-h`
- **Fichier :** [components/ThemeHero.tsx:23](../../../components/ThemeHero.tsx#L23)
- **Symptôme :** `min-h-[calc(100dvh-5rem)]` ne casse pas visuellement (pas de clipping) mais force un plein écran quasi vide sur mobile → scroll inutile.
- **Approche :** `md:min-h-[calc(100dvh-5rem)]`.
- **Propriétaire :** viewport.

### 3. Menu mobile : la moitié de la navigation disparaît
- **Fichier :** [components/NavHeader.tsx:152-164](../../../components/NavHeader.tsx#L152-L164)
- **Symptôme :** le menu burger ne rend que `navLinks` en liens plats ; les sous-menus (`hasDropdown`, `thematiqueCategories`) ne sont jamais exposés sur mobile. Les utilisateurs mobiles n'ont **aucun accès** aux pages `/fonds/[theme]` via la nav — perte fonctionnelle, pas juste cosmétique.
- **Approche :** mobile-first pour ce composant (à refaire de toute façon) — accordéon/disclosure sous chaque lien `hasDropdown` dans le menu mobile.
- **Propriétaire :** viewport (le hover desktop reste ; le menu mobile devient sa propre implémentation, pas un simple `md:hidden` du menu desktop).

### 4. Padding fixe non responsive sur 4 sections de la home
- **Fichiers :** [components/ActivitesSection.tsx:14](../../../components/ActivitesSection.tsx#L14), [components/ValorisationSection.tsx:6](../../../components/ValorisationSection.tsx#L6), [components/FondationSection.tsx:5](../../../components/FondationSection.tsx#L5), [components/DeposerSection.tsx:3](../../../components/DeposerSection.tsx#L3)
- **Symptôme :** `px-14 py-22/24` sans variante mobile — contrairement à `ActivitePage` et `ThemePageBody` qui utilisent déjà `px-6 md:px-14`. Sur 375px, ça laisse ~263px de contenu utile.
- **Approche :** fix mécanique desktop-down minimal — aligner sur le pattern déjà présent ailleurs (`px-6 md:px-14`, `py-14 md:py-22`).
- **Propriétaire :** viewport.
- **Priorité :** le plus gros gain visuel pour le moins d'effort — à traiter en premier.

---

## Niveau 2 — Composants (`component-slot`)

### 5. FondModal : grille 2 colonnes figée, aucun breakpoint
- **Fichier :** [components/FondModal.tsx:58](../../../components/FondModal.tsx#L58)
- **Symptôme :** `grid-cols-[1fr_1.1fr]` avec `minHeight: 400` sur la colonne image et `p-10`, sans breakpoint. Sur mobile ça crée deux colonnes d'environ 185px chacune → contenu illisible. **C'est la casse la plus sévère du projet.**
- **Approche :** mobile-first (composant à reprendre entièrement) — base `grid-cols-1`, `md:grid-cols-[1fr_1.1fr]` ; image décorative masquée ou réduite sous `md` (cohérent avec `hidden md:block` déjà utilisé pour le hero) ; `p-6 md:p-10`.
- **Propriétaire :** viewport (modal toujours plein-écran, pas de contexte de conteneur variable).

### 6. Mega-menu "Thématiques" au hover uniquement
- **Fichier :** [components/NavHeader.tsx:48-49](../../../components/NavHeader.tsx#L48-L49)
- **Symptôme :** logique `onMouseEnter`/`onMouseLeave` suppose une souris — pas d'équivalent tactile.
- **Approche :** à reprendre en même temps que le point 3 — clic/tap + `aria-expanded` plutôt qu'un simple hover.
- **Propriétaire :** viewport.

---

## Niveau 3 — Données denses / toolbar (`dense-data`)

### 7. Ligne titre + chips de filtre
- **Fichier :** [components/ActivitesSection.tsx:16-42](../../../components/ActivitesSection.tsx#L16-L42)
- **Symptôme :** `flex-wrap` déjà en place (bon réflexe), mais combiné au point 4 (padding fixe) la rangée de 6 chips + le H2 34px se tasse sur mobile.
- **Approche :** revérifier une fois le point 4 corrigé — probablement suffisant tel quel ; sinon passer les chips en scroll horizontal type toolbar.
- **Propriétaire :** viewport.

### 8. Liste du conseil de fondation
- **Fichier :** [components/FondationSection.tsx:28-42](../../../components/FondationSection.tsx#L28-L42)
- **Symptôme :** `flex justify-between items-baseline` avec noms/rôles assez longs ("Michel Beytrison" / "Secrétaire-trésorier") — risque de wrap disgracieux sur 320-375px après le fix de padding.
- **Approche :** vérifier après le point 4 ; prévoir un fallback `flex-col` sous `sm` si nécessaire.
- **Propriétaire :** viewport.

---

## Niveau 4 — Media / images (`media-behavior`, `next/image` + `sizes`)

### 9. Image de couverture — `sizes` manquant
- **Fichier :** [app/activite/page.tsx:104-109](../../../app/activite/page.tsx#L104-L109)
- **Symptôme :** `fill` sans `sizes` → Next applique `100vw` par défaut, alors que l'image n'est visible qu'à partir de `md` dans une colonne ~50%. Elle est téléchargée en pleine taille même sur mobile où elle est masquée (`hidden md:block`).
- **Fix :** ajouter `sizes="(min-width: 768px) 45vw, 0px"` — même pattern que [HeroSection.tsx:73](../../../components/HeroSection.tsx#L73) (déjà correct).

### 10. Vignettes de galerie — `sizes` manquant
- **Fichier :** [components/ActiviteGallery.tsx:59-64](../../../components/ActiviteGallery.tsx#L59-L64)
- **Symptôme :** grille `grid-cols-2 md:grid-cols-[repeat(var(--gallery-cols),1fr)]` sans `sizes` sur les `Image fill`.
- **Fix :** `sizes` dynamique basé sur `cols`, ex. `` `(min-width: 768px) ${100/cols}vw, 50vw` ``.

### 11. Images du corps Portable Text — `sizes` manquant
- **Fichier :** [components/sanity/PortableTextContent.tsx:61-66](../../../components/sanity/PortableTextContent.tsx#L61-L66)
- **Symptôme :** conteneur `max-w-175` (700px) dans `max-w-350 mx-auto`, `Image fill` sans `sizes`.
- **Fix :** `sizes="(min-width: 768px) 700px, 100vw"`.

*Référence de bon pattern déjà en place : [ValorisationSection.tsx:23](../../../components/ValorisationSection.tsx#L23) et [HeroSection.tsx:73](../../../components/HeroSection.tsx#L73) ont déjà des `sizes` corrects — à copier tel quel.*

---

## Niveau 5 — Vérification / reflow (`verification-reflow`)

À faire une fois les points 1-11 implémentés :

- [ ] Largeurs étroites 320px et 375px sur : les 4 sections du point 4, le modal (point 5), la ligne de filtres (point 7).
- [ ] Zoom 400% / reflow sur la page thématique (`ThemeSummary` est déjà correctement masquée sous `md` via [ThemePageBody.tsx:26,43](../../../components/ThemePageBody.tsx#L26) — bon pattern de dégradation intentionnelle, à re-vérifier après les autres fixes).
- [ ] Contenu long en français : noms du conseil, libellés de chips, titres de chapitres — ne pas tester avec des placeholders courts.
- [ ] Menu mobile après le point 3 : confirmer l'accès à toutes les pages `/fonds/[theme]`.

---

## Ordre d'exécution recommandé

```
4 → 1 → 2 → 3/6 → 5 → 9-11 → 7/8 → vérification finale
```

- **Point 4** : le plus gros gain visuel pour le moins de risque.
- **Point 3** : le plus grave fonctionnellement (perte de navigation), mais demande une réécriture de composant → juste après.
- **Points 9-11** : gain de performance (poids d'images), risque de régression visuel minimal.
