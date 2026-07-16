# Homepage Fondation Æncrage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Fondation Æncrage homepage pixel-perfect from design spec option 1a, using Next.js 16 App Router, Tailwind v4, and Framer Motion.

**Architecture:** Seven section components assembled in `app/page.tsx`. `NavHeader`, `HeroSection`, and `ActivitesSection` are `'use client'` components (interactivity + Framer Motion). The four remaining sections are Server Components. All static content lives in `lib/data.ts`.

**Tech Stack:** Next.js 16.2.10, React 19, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), Framer Motion (latest), `next/font/google`

## Global Constraints

- Tailwind v4 — design tokens declared in `globals.css` via `@theme {}`, NOT via `tailwind.config.js`
- `'use client'` required on any file that uses `useState`, event handlers, or `motion.*` from framer-motion
- Pixel-fidelity to spec: exact hex colors, exact px values, exact copy strings
- Images: `<div>` placeholders (correct ratio + `bg-[#EEF1F5]`), no real assets
- Anchor IDs: `activites-1a`, `valorisation-1a`, `fondation-1a`, `deposer-1a`, `contact-1a`
- Biseau clip-path applied **only** on hero image via inline `style={{ clipPath: '...' }}`
- No `tailwind.config.js` or `tailwind.config.ts` — Tailwind v4 needs none
- Verify each task with `npx tsc --noEmit` before committing

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/layout.tsx` | Modify | Load 3 fonts via next/font, update metadata, expose CSS variables |
| `app/globals.css` | Modify | Tailwind v4 @theme tokens (colors + fonts) |
| `app/page.tsx` | Modify | Assemble all section components |
| `lib/data.ts` | Create | All static content (actions, spaces, conseil) |
| `components/NavHeader.tsx` | Create | `'use client'` — header + mobile burger menu |
| `components/HeroSection.tsx` | Create | `'use client'` — 2-col hero + Framer Motion entry animations |
| `components/BandeauSection.tsx` | Create | Server — blue contribution banner |
| `components/ActivitesSection.tsx` | Create | `'use client'` — filter chips + animated card grid |
| `components/ValorisationSection.tsx` | Create | Server — 3-space grid with hover scale |
| `components/FondationSection.tsx` | Create | Server — 2-col foundation + council |
| `components/DeposerSection.tsx` | Create | Server — dark deposit section + contact + footer |

---

## Task 1: Foundation — deps, fonts, tokens, page skeleton

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: CSS variables `--font-newsreader`, `--font-instrument-sans`, `--font-ibm-plex-mono` on `<html>`
- Produces: Tailwind utility classes `text-encre`, `text-plume`, `bg-velin`, `font-display`, `font-mono`, `font-body` usable in all components

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

Expected: `framer-motion` appears in `package.json` dependencies, no errors.

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fondation Æncrage — Patrimoine oral & écrit de Mase',
  description:
    'La Fondation Æncrage rassemble, conserve et met en valeur le patrimoine immatériel lié à la société masatte — écrits, archives, voix et portraits.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-encre:           #131417;
  --color-plume:           #758FB2;
  --color-papier:          #FFFFFF;
  --color-velin:           #FAFAF8;
  --color-gris:            #8A8F98;
  --color-laiton:          #A88C5A;
  --color-secondaire:      #38485C;
  --color-placeholder:     #EEF1F5;
  --color-texte-clair-1:   #C3D0E0;
  --color-texte-clair-2:   #DCE3EC;

  --font-display: var(--font-newsreader), Georgia, serif;
  --font-body:    var(--font-instrument-sans), system-ui, sans-serif;
  --font-mono:    var(--font-ibm-plex-mono), 'Courier New', monospace;
}

body {
  font-family: var(--font-body);
  color: #131417;
  background: #ffffff;
}
```

- [ ] **Step 4: Replace `app/page.tsx` with skeleton**

```tsx
export default function Home() {
  return (
    <main>
      <p className="p-8 font-mono text-encre">Fondation Æncrage — en construction</p>
    </main>
  )
}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Start dev server and verify fonts load**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify: text "Fondation Æncrage — en construction" appears in monospace font (IBM Plex Mono). Check DevTools → Elements: `<html>` has all three `--font-*` CSS variables.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx package.json package-lock.json
git commit -m "feat: add fonts, design tokens and framer-motion dependency"
```

---

## Task 2: Data layer

**Files:**
- Create: `lib/data.ts`

**Interfaces:**
- Produces: `actions: Action[]`, `spaces: Space[]`, `conseil: ConseillMembre[]`
- `Action = { cat: string; text: string }`
- `Space = { id: string; name: string; desc: string }`
- `ConseillMembre = { name: string; role: string }`

- [ ] **Step 1: Create `lib/data.ts`**

```ts
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add static content data layer"
```

---

## Task 3: NavHeader

**Files:**
- Create: `components/NavHeader.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing (self-contained)
- Produces: `<NavHeader />` default export

- [ ] **Step 1: Create `components/NavHeader.tsx`**

```tsx
'use client'

import { useState } from 'react'

const navLinks = [
  { label: 'La Fondation', href: '#fondation-1a' },
  { label: 'Activités',    href: '#activites-1a' },
  { label: 'Valorisation', href: '#valorisation-1a' },
  { label: 'Déposer',      href: '#deposer-1a' },
  { label: 'Contact',      href: '#contact-1a' },
]

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-encre">
      {/* Desktop */}
      <div className="flex items-center justify-between px-14 py-5">
        <div className="font-mono text-[13px] font-semibold tracking-[0.18em] uppercase text-encre">
          Fondation Æncrage
        </div>
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-[3px] transition-[border-color] duration-200 hover:border-plume"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-encre transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
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
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-14 py-4 border-b border-[rgba(19,20,23,0.1)] hover:bg-velin"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx` to include NavHeader**

```tsx
import NavHeader from '@/components/NavHeader'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <p className="p-8 font-mono text-gris text-[11px] uppercase tracking-[0.14em]">
        Sections à venir…
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser at `http://localhost:3000`:
- Header shows "FONDATION ÆNCRAGE" logo left, 5 nav links right (desktop)
- Nav links have no underline by default; hovering shows a blue-grey bottom border
- Resize to mobile: nav links hidden, burger icon appears; click burger to toggle mobile menu open/closed

- [ ] **Step 5: Commit**

```bash
git add components/NavHeader.tsx app/page.tsx
git commit -m "feat: add NavHeader with desktop nav and mobile burger"
```

---

## Task 4: HeroSection

**Files:**
- Create: `components/HeroSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<HeroSection />` default export

- [ ] **Step 1: Create `components/HeroSection.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export default function HeroSection() {
  return (
    <section className="grid md:[grid-template-columns:1.1fr_0.9fr] gap-16 px-14 pt-[88px] pb-24 items-end">
      {/* Left column */}
      <div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
          className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-6"
        >
          Patrimoine oral &amp; écrit de Mase
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
          className="font-display font-normal text-[44px] md:text-[60px] leading-[1.1] max-w-[600px] m-0 mb-7 text-encre"
        >
          Sauvegarder la mémoire d&apos;un village, écrite et racontée
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: 'easeOut' }}
          className="font-body text-[17px] leading-[1.6] text-secondaire max-w-[500px] m-0 mb-8"
        >
          La Fondation Æncrage rassemble, conserve et met en valeur le patrimoine
          immatériel lié à la société masatte — écrits, archives, voix et portraits.
        </motion.p>

        <motion.a
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: 'easeOut' }}
          href="#deposer-1a"
          className="inline-flex items-center px-[22px] py-[14px] bg-encre text-papier no-underline font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-[background-color,transform] duration-200 hover:bg-secondaire hover:-translate-y-0.5"
        >
          Déposer un témoignage
        </motion.a>
      </div>

      {/* Right column — image placeholder with brand bevel */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        className="w-full aspect-[4/5] bg-placeholder mt-8 md:mt-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser:
- 2-column layout desktop: text left, grey beveled rectangle right (ratio ~4:5)
- Mobile: single column, grey rectangle appears below the text
- H1 is in Newsreader serif at ~60px
- Entry animations play on page load (eyebrow → h1 → paragraph → CTA, staggered ~80ms)
- CTA button hover: darkens + lifts slightly
- Grey placeholder shape has the diagonal bevel cut at bottom-left

- [ ] **Step 5: Commit**

```bash
git add components/HeroSection.tsx app/page.tsx
git commit -m "feat: add HeroSection with Framer Motion entry animations"
```

---

## Task 5: BandeauSection

**Files:**
- Create: `components/BandeauSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<BandeauSection />` default export

- [ ] **Step 1: Create `components/BandeauSection.tsx`**

```tsx
export default function BandeauSection() {
  return (
    <section className="bg-plume text-papier px-14 py-7 flex items-center justify-between flex-wrap gap-6">
      <p className="font-display italic text-[20px] leading-[1.4] max-w-[760px] m-0">
        Vous conservez des écrits, photographies ou enregistrements liés à Mase ?
        La fondation recueille dès aujourd&apos;hui les premiers témoignages.
      </p>
      <a
        href="#deposer-1a"
        className="flex-none font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-papier no-underline border-b border-[rgba(255,255,255,0.6)] pb-1 transition-[border-color] duration-200 hover:border-papier"
      >
        En savoir plus →
      </a>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser: below the hero, a blue-grey (`#758FB2`) banner with italic serif quote on the left and "EN SAVOIR PLUS →" link on the right. Hovering the link makes its bottom underline go from semi-transparent to solid white.

- [ ] **Step 5: Commit**

```bash
git add components/BandeauSection.tsx app/page.tsx
git commit -m "feat: add BandeauSection contribution banner"
```

---

## Task 6: ActivitesSection

**Files:**
- Create: `components/ActivitesSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `actions: Action[]`, `filterOptions: readonly string[]` from `lib/data.ts`
- Produces: `<ActivitesSection />` default export

- [ ] **Step 1: Create `components/ActivitesSection.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { actions, filterOptions, type FilterOption } from '@/lib/data'

export default function ActivitesSection() {
  const [filter, setFilter] = useState<FilterOption>('Tous')

  const filteredActions =
    filter === 'Tous' ? actions : actions.filter((a) => a.cat === filter)

  return (
    <section id="activites-1a" className="px-14 py-24">
      {/* Header row */}
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            Activités
          </p>
          <h2 className="font-display font-normal text-[34px] leading-[1.15] m-0 text-encre">
            Les actions de la fondation
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-[14px] py-2 border border-encre rounded-[2px] font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase cursor-pointer transition-[background-color,color] duration-200 ${
                filter === option
                  ? 'bg-encre text-papier'
                  : 'bg-velin text-encre'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid — key forces remount on filter change, replaying animations */}
      <div
        key={filter}
        className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(19,20,23,0.1)] border border-[rgba(19,20,23,0.1)]"
      >
        {filteredActions.map((action, i) => (
          <motion.div
            key={`${action.cat}-${i}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: 'easeOut' }}
            className="bg-papier px-8 py-7 transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_24px_rgba(117,143,178,0.18)] hover:-translate-y-0.5"
          >
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-plume mb-[10px] m-0">
              {action.cat}
            </p>
            <p className="font-body text-[15px] leading-[1.55] text-encre m-0">
              {action.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'
import ActivitesSection from '@/components/ActivitesSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
      <ActivitesSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser:
- "Activités" eyebrow + H2 on left, 6 filter chip buttons on right
- 7 cards visible in a 2-column grid with thin divider lines between them
- Clicking "Sonore" shows only 2 cards; clicking "Tous" shows all 7
- Cards fade-up into view on filter change (staggered)
- Card hover: lifts 2px + blue-grey shadow appears

- [ ] **Step 5: Commit**

```bash
git add components/ActivitesSection.tsx app/page.tsx
git commit -m "feat: add ActivitesSection with filter chips and animated card grid"
```

---

## Task 7: ValorisationSection

**Files:**
- Create: `components/ValorisationSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `spaces: Space[]` from `lib/data.ts`
- Produces: `<ValorisationSection />` default export

- [ ] **Step 1: Create `components/ValorisationSection.tsx`**

```tsx
import { spaces } from '@/lib/data'

export default function ValorisationSection() {
  return (
    <section id="valorisation-1a" className="px-14 pb-24">
      <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
        Valorisation
      </p>
      <h2 className="font-display font-normal text-[34px] leading-[1.15] max-w-[640px] m-0 mb-10 text-encre">
        Des lieux pour donner à voir et à entendre les archives
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div key={space.id}>
            {/* Image placeholder with hover scale */}
            <div className="w-full aspect-[4/3] bg-placeholder mb-4 overflow-hidden group">
              <div className="w-full h-full bg-placeholder transition-transform duration-400 group-hover:scale-[1.06]" />
            </div>
            <h3 className="font-display font-normal text-[20px] leading-[1.3] mb-2 text-encre">
              {space.name}
            </h3>
            <p className="font-body text-[14px] leading-[1.5] text-secondaire m-0">
              {space.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'
import ActivitesSection from '@/components/ActivitesSection'
import ValorisationSection from '@/components/ValorisationSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
      <ActivitesSection />
      <ValorisationSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser:
- 3-column grid of spaces (desktop), 1-column on mobile
- Each card: grey placeholder rectangle (4:3 ratio), serif title, small grey description
- Hovering a card's image: the inner div scales to 1.06× (clipped by `overflow-hidden` on the parent)

- [ ] **Step 5: Commit**

```bash
git add components/ValorisationSection.tsx app/page.tsx
git commit -m "feat: add ValorisationSection with 3-space grid and hover scale"
```

---

## Task 8: FondationSection

**Files:**
- Create: `components/FondationSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `conseil: ConseilMembre[]` from `lib/data.ts`
- Produces: `<FondationSection />` default export

- [ ] **Step 1: Create `components/FondationSection.tsx`**

```tsx
import { conseil } from '@/lib/data'

export default function FondationSection() {
  return (
    <section id="fondation-1a" className="bg-velin px-14 py-[88px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left — description */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            La Fondation
          </p>
          <h2 className="font-display font-normal text-[34px] leading-[1.15] max-w-[480px] m-0 mb-6 text-encre">
            Préserver le patrimoine immatériel de la société masatte
          </h2>
          <p className="font-body text-[16px] leading-[1.65] text-secondaire max-w-[480px] m-0">
            Fondée à l&apos;initiative d&apos;Annette Corbaz, la fondation soutient toutes les
            actions de sauvegarde et de mise en valeur du patrimoine oral et écrit de
            Mase — et peut contribuer à d&apos;autres activités poursuivant les mêmes buts.
          </p>
        </div>

        {/* Right — council */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-5 m-0">
            Conseil de fondation
          </p>
          <div className="flex flex-col">
            {conseil.map((membre) => (
              <div
                key={membre.name}
                className="flex justify-between items-baseline py-4 border-b border-[rgba(19,20,23,0.12)]"
              >
                <span className="font-display font-normal text-[17px] text-encre">
                  {membre.name}
                </span>
                <span className="font-mono font-normal text-[12px] tracking-[0.05em] uppercase text-gris">
                  {membre.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'
import ActivitesSection from '@/components/ActivitesSection'
import ValorisationSection from '@/components/ValorisationSection'
import FondationSection from '@/components/FondationSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
      <ActivitesSection />
      <ValorisationSection />
      <FondationSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser:
- Off-white (`#FAFAF8`) background section
- Desktop: 2-column grid — serif H2 + description left, council member list right
- Each member row: name in Newsreader on left, role in uppercase monospace right, separated by thin horizontal rule
- Mobile: stacked, council below description

- [ ] **Step 5: Commit**

```bash
git add components/FondationSection.tsx app/page.tsx
git commit -m "feat: add FondationSection with foundation description and council list"
```

---

## Task 9: DeposerSection (+ Contact + Footer)

**Files:**
- Create: `components/DeposerSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<DeposerSection />` default export

- [ ] **Step 1: Create `components/DeposerSection.tsx`**

```tsx
export default function DeposerSection() {
  return (
    <section id="deposer-1a" className="bg-encre text-papier px-14 py-[88px]">
      {/* Grid: deposit info + contact */}
      <div className="grid grid-cols-1 md:[grid-template-columns:1.2fr_0.8fr] gap-16 mb-16">
        {/* Left — deposit */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-laiton mb-3 m-0">
            Déposer un fonds
          </p>
          <h2 className="font-display font-normal text-[32px] leading-[1.2] max-w-[520px] m-0 mb-5">
            Confiez vos écrits, photographies ou enregistrements à la fondation
          </h2>
          <p className="font-body text-[15px] leading-[1.6] text-texte-clair-1 max-w-[480px] m-0 mb-7">
            Correspondances, journaux, photographies, bandes sonores : chaque trace
            de la vie masatte a sa place dans les archives de la fondation.
          </p>
          <a
            href="#contact-1a"
            className="inline-flex px-[22px] py-[14px] bg-papier text-encre no-underline font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-opacity duration-200 hover:opacity-80"
          >
            Nous contacter
          </a>
        </div>

        {/* Right — contact */}
        <div id="contact-1a">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            Contact
          </p>
          <address className="font-body not-italic text-[15px] leading-[1.8] text-texte-clair-2">
            Fondation Æncrage
            <br />
            Mase, Valais — Suisse
            <br />
            <a
              href="mailto:contact@fondation-aencrage.ch"
              className="text-papier no-underline hover:underline"
            >
              contact@fondation-aencrage.ch
            </a>
          </address>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.15)] pt-6">
        <p className="font-mono font-normal text-[11px] tracking-[0.1em] uppercase text-gris m-0">
          Fondation Æncrage © 2026
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx` to final version**

```tsx
import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'
import ActivitesSection from '@/components/ActivitesSection'
import ValorisationSection from '@/components/ValorisationSection'
import FondationSection from '@/components/FondationSection'
import DeposerSection from '@/components/DeposerSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
      <ActivitesSection />
      <ValorisationSection />
      <FondationSection />
      <DeposerSection />
    </main>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check**

In browser:
- Dark section (`#131417`) fills the bottom of the page
- "DÉPOSER UN FONDS" eyebrow in brass/gold (`#A88C5A`) — verify this is the only brass usage on the page
- H2 in Newsreader white, paragraph in lighter grey (`#C3D0E0`), white CTA button
- Right side: contact info in lighter white (`#DCE3EC`), email link in pure white
- Footer separator line is barely-visible (15% opacity white), "FONDATION ÆNCRAGE © 2026" in muted monospace
- Clicking any nav link scrolls to the correct section

- [ ] **Step 5: Commit**

```bash
git add components/DeposerSection.tsx app/page.tsx
git commit -m "feat: add DeposerSection with contact and footer"
```

---

## Task 10: Final build verification

**Files:** none (verification only)

- [ ] **Step 1: Full type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build completes without errors. Note and fix any warnings about missing `key` props or invalid HTML.

- [ ] **Step 3: Full visual walkthrough in browser (dev)**

```bash
npm run dev
```

Checklist:
- [ ] Logo "FONDATION ÆNCRAGE" in monospace uppercase with wide tracking
- [ ] 5 nav links; hover shows blue bottom border; mobile burger works
- [ ] Hero: 2-col desktop, H1 in Newsreader ~60px, CTA button present
- [ ] Entry animations play on load (eyebrow → h1 → p → CTA, staggered)
- [ ] Beveled hero image placeholder (diagonal cut bottom-left)
- [ ] Blue banner with italic quote and "EN SAVOIR PLUS →" link
- [ ] Activités section: 6 filter chips; clicking a chip filters and re-animates cards
- [ ] Cards have category label in blue, hover lifts with shadow
- [ ] Valorisation: 3 grey placeholder boxes (4:3); hover scales inner div
- [ ] Fondation: off-white bg, 2-col grid, 3 council members with thin rules
- [ ] Deposer: dark bg, brass eyebrow, white CTA, contact address, footer line
- [ ] Internal anchor links all scroll to correct sections
- [ ] No brass color used anywhere except the "Déposer un fonds" eyebrow
- [ ] Mobile: all sections stack to 1 column

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: complete Fondation Æncrage homepage implementation"
```
