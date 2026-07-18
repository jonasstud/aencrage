# NavHeader Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `NavHeader` so that 4 nav links (La Fondation, Activités, Valorisation, Déposer) open a dropdown panel on hover, while Contact remains a direct link and mobile is unchanged.

**Architecture:** Single `hoveredItem: string | null` state in `NavHeader`. Each dropdown item is a `<div relative>` wrapper with `onMouseEnter`/`onMouseLeave`. The dropdown panel uses `opacity` + `pointer-events-none` for a smooth fade-in without conditional mounting. Chevron from `lucide-react` rotates 180° when open.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, lucide-react (new)

## Global Constraints

- Tailwind v4 — tokens dans `globals.css` via `@theme {}`, pas de `tailwind.config.js`
- `'use client'` déjà présent sur `NavHeader` — garder
- Style visuel existant préservé à l'identique
- Mobile burger menu et menu mobile : inchangés
- Contact : lien direct sans dropdown
- Vérifier avec `npx tsc --noEmit` avant chaque commit

---

## File Map

| File | Action | Responsabilité |
|---|---|---|
| `components/NavHeader.tsx` | Modify | Ajout dropdown hover + chevron |
| `package.json` | Modify | Ajout `lucide-react` |

---

## Task 1 : Installer lucide-react

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produit: import `{ ChevronDown } from "lucide-react"` disponible

- [ ] **Step 1 : Installer la dépendance**

```bash
npm install lucide-react
```

Expected: `lucide-react` apparaît dans `dependencies` de `package.json`, pas d'erreur.

- [ ] **Step 2 : Vérifier l'import fonctionne**

```bash
node -e "require('lucide-react')"
```

Expected: pas d'erreur.

- [ ] **Step 3 : Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add lucide-react for nav chevron icons"
```

---

## Task 2 : Refactorer NavHeader avec dropdowns au hover

**Files:**
- Modify: `components/NavHeader.tsx`

**Interfaces:**
- Consomme: `ChevronDown` de `lucide-react`
- Produit: `<NavHeader />` — comportement inchangé en mobile, dropdowns au hover en desktop

- [ ] **Step 1 : Remplacer le contenu de `components/NavHeader.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const navLinks = [
  { label: "La Fondation", href: "#fondation-1a", hasDropdown: true },
  { label: "Activités",    href: "#activites-1a", hasDropdown: true },
  { label: "Valorisation", href: "#valorisation-1a", hasDropdown: true },
  { label: "Déposer",      href: "#deposer-1a", hasDropdown: true },
  { label: "Contact",      href: "#contact-1a", hasDropdown: false },
];

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <header className="border-b border-encre">
      {/* Desktop */}
      <div className="flex items-center justify-between px-6 md:px-14 py-5">
        <Image
          src="aencrage-logo.svg"
          alt="Fondation Æncrage"
          width={180}
          height={32}
          className="w-auto h-10"
        />
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(link.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-[3px] transition-[border-color] duration-200 hover:border-plume"
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      hoveredItem === link.href ? "rotate-180" : ""
                    }`}
                  />
                </a>
                <div
                  className={`absolute top-full left-0 pt-3 z-50 transition-opacity duration-150 ${
                    hoveredItem === link.href
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-papier border border-encre min-w-[180px] p-3">
                    <a
                      href={link.href}
                      className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline hover:text-plume block py-2 px-3 transition-colors duration-200"
                    >
                      Vue générale →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-[3px] transition-[border-color] duration-200 hover:border-plume"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${
              isOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-opacity duration-200 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${
              isOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden flex flex-col border-t border-encre">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-6 py-4 border-b border-[rgba(19,20,23,0.1)] hover:bg-velin"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2 : Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 erreurs.

- [ ] **Step 3 : Vérification visuelle — desktop**

```bash
npm run dev
```

Ouvrir `http://localhost:3000` en desktop (≥768px) et vérifier :

- [ ] Les 4 premiers liens affichent un chevron `∨` à droite du label
- [ ] Hover sur "La Fondation" → chevron pivote 180°, panel apparaît en fade (150ms) sous le lien
- [ ] Panel : fond blanc, bordure `border-encre`, lien "Vue générale →" en monospace uppercase
- [ ] Hover "Vue générale →" → texte passe de `text-encre` à `text-plume` (bleu-gris)
- [ ] Cliquer sur le trigger (label) navigue vers l'ancre `#fondation-1a`
- [ ] Cliquer sur "Vue générale →" navigue aussi vers `#fondation-1a`
- [ ] "Contact" : pas de chevron, pas de dropdown, lien direct
- [ ] Quitter le wrapper avec la souris → dropdown disparaît (fade out)
- [ ] Vérifier les 4 items : La Fondation, Activités, Valorisation, Déposer

- [ ] **Step 4 : Vérification visuelle — mobile**

Réduire la fenêtre à <768px et vérifier :

- [ ] Burger menu fonctionne comme avant
- [ ] Menu mobile : 5 liens plats (sans chevron), dont "Contact"
- [ ] Cliquer un lien ferme le menu mobile

- [ ] **Step 5 : Commit**

```bash
git add components/NavHeader.tsx
git commit -m "feat: add hover dropdowns to NavHeader desktop nav"
```
