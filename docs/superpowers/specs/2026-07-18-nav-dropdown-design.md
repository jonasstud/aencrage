# NavHeader Dropdown Refactor — Fondation Æncrage

**Date:** 2026-07-18
**Status:** Approved

## Objectif

Refactorer le composant `NavHeader` afin que la navigation desktop se comporte comme un NavigationMenu avec dropdowns au hover, en style shadcN mais sans installer shadcn. Le mobile reste inchangé.

## Périmètre

- Modifier uniquement `components/NavHeader.tsx`
- Installer `lucide-react` (icône chevron)
- Aucune autre modification de composant

## Structure des données

`navLinks` reçoit un champ `hasDropdown` :

```ts
const navLinks = [
  { label: "La Fondation", href: "#fondation-1a", hasDropdown: true },
  { label: "Activités",    href: "#activites-1a", hasDropdown: true },
  { label: "Valorisation", href: "#valorisation-1a", hasDropdown: true },
  { label: "Déposer",      href: "#deposer-1a", hasDropdown: true },
  { label: "Contact",      href: "#contact-1a", hasDropdown: false },
]
```

## État

Un seul state dans `NavHeader` :

```ts
const [hoveredItem, setHoveredItem] = useState<string | null>(null)
```

`hoveredItem` stocke le `href` de l'item survolé, ou `null` si aucun.

## Comportement desktop

Chaque item nav est un wrapper `<div className="relative">` avec :
- `onMouseEnter` → `setHoveredItem(link.href)`
- `onMouseLeave` → `setHoveredItem(null)`

Le trigger est un `<a href={link.href}>` : le clic navigue vers l'ancre, le hover ouvre le dropdown.

Les items sans `hasDropdown` (`Contact`) sont de simples `<a>` sans wrapper ni dropdown.

## Chevron

- Composant `<ChevronDown size={12} />` de `lucide-react`
- Affiché uniquement sur les items avec `hasDropdown: true`
- `transition-transform duration-200`
- `rotate-180` quand `hoveredItem === link.href`

## Dropdown panel

Positionné en `absolute top-full` sous le trigger, avec un `pt-3` invisible qui fait pont entre le trigger et le panel pour éviter que le dropdown disparaisse quand la souris traverse le gap.

**Style du panel :**
```
bg-papier border border-encre min-w-[180px] p-3 z-50
```

**Contenu :** un unique lien "Vue générale →" pointant vers `link.href` (placeholder pour futures sous-pages).

**Style du lien :**
```
font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre
hover:text-plume block py-2 px-3 transition-colors duration-200
```

**Apparition :** `opacity-0 → opacity-100` avec `transition-opacity duration-150`. Pas de Framer Motion.

## Comportement mobile

Le burger menu et le menu mobile restent identiques. Les 4 items avec `hasDropdown: true` s'affichent comme des liens plats dans le menu mobile — le champ `hasDropdown` est ignoré en mobile. Pas de dropdown en mobile.

## Dépendances à installer

```bash
npm install lucide-react
```

## Ce qui n'est pas dans le périmètre

- Navigation clavier (Radix UI / shadcn — prévu dans la spec 2026-07-17 si installée plus tard)
- Contenu réel dans les dropdowns (futures sous-pages)
- Dropdown mobile
- Modification d'autres composants
