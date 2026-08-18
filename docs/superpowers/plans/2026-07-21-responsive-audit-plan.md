# Audit responsive — Fondation AEncrage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the desktop-first AEncrage site (Next.js App Router + Tailwind v4) usable from 320px up to desktop, without a mobile-first rewrite — fix the 11 concrete breakages documented in `docs/superpowers/plans/2026-07-21-responsive-audit.md`.

**Architecture:** Desktop-down (`max-*`/base-then-`md:`) patches for page-shell and section spacing, a from-scratch mobile implementation for the nav's mobile menu (it has no usable mobile version today), a mobile-first rebuild of `FondModal`'s two-column layout, and `sizes` additions on four `next/image` `fill` usages. All fixes are viewport-driven (`md:` breakpoint only) — no container queries needed, per the audit's analysis that no responsive component here is reused inside a variable-width parent.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2, Tailwind CSS v4 (`@tailwindcss/postcss`), Framer Motion, lucide-react, next-sanity.

## Global Constraints

- Tailwind breakpoints are the framework defaults, unmodified in `globals.css`: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Only `md:` is used anywhere in this codebase today — stay consistent, don't introduce `sm:`/`lg:` unless a task below says so.
- Next.js 16.2.10 has breaking changes vs. training data (`aencrage/AGENTS.md`). If any `next/image` behavior looks off during Tasks 6-8, check `node_modules/next/dist/docs/` before assuming legacy API.
- **No automated test framework exists in this repo** (`package.json` has only `dev`/`build`/`start`/`lint` scripts; no jest/vitest/playwright config found). Verification for every task below is therefore:
  1. `npm run dev`, open the page in a browser, open devtools responsive/device mode, and check the **exact widths named in the step** (this repo's audit specifically calls out 320px and 375px as the narrow targets, and `md`=768px as the breakpoint transition).
  2. `npx tsc --noEmit` and `npm run lint` after every task, as the automated regression gate (these catch typos/syntax breakage, not visual regressions — the visual check in step 1 is not optional).
- Don't restructure files or introduce new abstractions (no new shared "responsive" hook/component) — every fix here is a Tailwind class change or a small, contained piece of new markup in the file the audit already named.
- Commit after each task.

---

## File Structure

No new files are created. Files touched, one responsibility each:

- `app/page.tsx` — home page shell; owns the Hero+Bandeau height lock (Task 2).
- `components/HeroSection.tsx` — no edit required (see Task 2 note); read-only reference.
- `components/ThemeHero.tsx` — thematic page hero; owns its own height lock (Task 3).
- `components/NavHeader.tsx` — site nav; owns desktop mega-menu hover/tap behavior and the entire mobile menu markup (Task 4).
- `components/ActivitesSection.tsx` — home "Activités" section; padding (Task 1) and filter-chip row (Task 9).
- `components/ValorisationSection.tsx` — home "Valorisation" section; padding only (Task 1).
- `components/FondationSection.tsx` — home "Fondation" section; padding (Task 1) and conseil list (Task 10).
- `components/DeposerSection.tsx` — home footer/deposit section; padding only (Task 1).
- `components/FondModal.tsx` — fonds detail modal; owns the 2-column→1-column responsive grid (Task 5).
- `app/activite/page.tsx` — activité detail page; owns the cover image `sizes` (Task 6).
- `components/ActiviteGallery.tsx` — gallery grid + lightbox; owns thumbnail `sizes` (Task 7).
- `components/sanity/PortableTextContent.tsx` — Portable Text renderer; owns body-image `sizes` (Task 8).

---

## Task 1: Home page section padding (audit point 4)

**Files:**
- Modify: `components/ActivitesSection.tsx:14`
- Modify: `components/ValorisationSection.tsx:6`
- Modify: `components/FondationSection.tsx:5`
- Modify: `components/DeposerSection.tsx:3`

**Interfaces:** None — pure className changes, no prop/signature changes.

- [ ] **Step 1: Confirm the current breakage at 375px**

Run `npm run dev`, open `http://localhost:3000` in devtools responsive mode at **375px width**. Each of the four sections below has ~48px of dead horizontal padding on each side (`px-14` = 3.5rem = 56px, fixed regardless of viewport), leaving ~263px of usable content width. Confirm this visually before editing — this is the "failing" state the edit below fixes.

- [ ] **Step 2: Edit `components/ActivitesSection.tsx`**

```tsx
// Before (line 14):
<section id="activites-1a" className="px-14 py-24">

// After:
<section id="activites-1a" className="px-6 md:px-14 py-14 md:py-24">
```

- [ ] **Step 3: Edit `components/ValorisationSection.tsx`**

```tsx
// Before (line 6):
<section id="valorisation-1a" className="px-14 pb-24">

// After:
<section id="valorisation-1a" className="px-6 md:px-14 pb-14 md:pb-24">
```

- [ ] **Step 4: Edit `components/FondationSection.tsx`**

```tsx
// Before (line 5):
<section id="fondation-1a" className="bg-velin px-14 py-22">

// After:
<section id="fondation-1a" className="bg-velin px-6 md:px-14 py-14 md:py-22">
```

- [ ] **Step 5: Edit `components/DeposerSection.tsx`**

```tsx
// Before (line 3):
<footer id="deposer-1a" className="bg-encre text-papier px-14 py-22">

// After:
<footer id="deposer-1a" className="bg-encre text-papier px-6 md:px-14 py-14 md:py-22">
```

- [ ] **Step 6: Verify at 375px and 1280px**

Reload `http://localhost:3000` in devtools responsive mode:
- At **375px**: all four sections now have 24px (`px-6` = 1.5rem) side padding, content uses the full available width, vertical rhythm is tighter (`py-14` = 3.5rem instead of `py-22`/`py-24`).
- At **1280px** (or any width ≥768px): visually identical to before the change — `md:px-14`/`md:py-*` restore the original desktop values.

- [ ] **Step 7: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0, no new errors.

- [ ] **Step 8: Commit**

```bash
git add components/ActivitesSection.tsx components/ValorisationSection.tsx components/FondationSection.tsx components/DeposerSection.tsx
git commit -m "fix: responsive padding on home page sections below md"
```

---

## Task 2: Home Hero+Bandeau height lock (audit point 1)

**Files:**
- Modify: `app/page.tsx:11`

**Interfaces:** None.

**Note:** the audit also names `components/HeroSection.tsx:18` (`flex-1 min-h-0`). That class only forces shrinking when its parent has an *enforced* height. Once `app/page.tsx:11` stops enforcing a fixed height below `md`, the parent's height becomes intrinsic (content-sized) on mobile, and `flex-1 min-h-0` becomes a no-op there — no edit needed in `HeroSection.tsx`. Verify this in Step 3 instead of editing the file.

- [ ] **Step 1: Confirm the current breakage at 375px**

Run `npm run dev`, open `http://localhost:3000` at **375px width** in devtools responsive mode (use the "iPhone SE" preset or set width to 375 / height to 667 manually). The H1 ("Sauvegarder la mémoire d'un village, écrite et racontée") wraps to 3+ lines and, combined with `items-end` and the fixed `h-[calc(100dvh-5rem)]` wrapper, gets visually cramped/clipped against the Bandeau section below. Confirm this before editing.

- [ ] **Step 2: Edit `app/page.tsx`**

```tsx
// Before (line 11):
<div className="flex flex-col h-[calc(100dvh-5rem)]">

// After:
<div className="flex flex-col md:h-[calc(100dvh-5rem)]">
```

- [ ] **Step 3: Verify at 375px and 1280px**

- At **375px**: the wrapper is now auto-height — Hero and Bandeau size to their content, the page scrolls naturally, no clipping of the H1 or CTA button. Confirm `HeroSection.tsx`'s `flex-1 min-h-0` causes no visible side effect (it shouldn't, since the flex container has no enforced height to shrink into).
- At **1280px**: unchanged — Hero+Bandeau still fill exactly `100dvh - 5rem` (viewport height minus the sticky header).

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "fix: don't lock home hero to viewport height below md"
```

---

## Task 3: Theme page Hero min-height lock (audit point 2)

**Files:**
- Modify: `components/ThemeHero.tsx:23`

**Interfaces:** None.

- [ ] **Step 1: Confirm the current breakage at 375px**

Run `npm run dev`, open `http://localhost:3000/fonds/alpage` at **375px width**. The hero section forces `min-h-[calc(100dvh-5rem)]` — on a short page this creates a near-empty full-screen block before the chapter content appears, forcing an extra unnecessary scroll. Confirm this before editing.

- [ ] **Step 2: Edit `components/ThemeHero.tsx`**

```tsx
// Before (line 23):
<section className="min-h-[calc(100dvh-5rem)] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:grid-rows-1 gap-8 md:gap-16 px-6 md:px-14 pt-8 md:pt-12 pb-16 md:pb-24 items-end">

// After:
<section className="md:min-h-[calc(100dvh-5rem)] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:grid-rows-1 gap-8 md:gap-16 px-6 md:px-14 pt-8 md:pt-12 pb-16 md:pb-24 items-end">
```

- [ ] **Step 3: Verify at 375px and 1280px**

- At **375px**: `/fonds/alpage` hero is now intrinsic height — title, intro and chapter/fonds count size to their content, chapter list appears right after without a dead scroll.
- At **1280px**: unchanged — hero still fills `100dvh - 5rem`.

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/ThemeHero.tsx
git commit -m "fix: don't force full-viewport height on theme hero below md"
```

---

## Task 4: Mobile nav — expose thematic sub-menus + tap support (audit points 3 & 6)

**Files:**
- Modify: `components/NavHeader.tsx:24-27` (state), `components/NavHeader.tsx:42-127` (desktop nav — add tap support), `components/NavHeader.tsx:152-164` (mobile menu — add accordion)

**Interfaces:**
- Consumes: `themes` from `@/lib/fondsThemes` (existing import, `{ slug: string; name: string; ... }[]`), `thematiqueCategories` (existing local const, `{ label: string; icon: LucideIcon; slugs: string[] }[]`), `navLinks` (existing local const, `{ label: string; href: string; hasDropdown: boolean }[]`).
- Produces: no new exports — this is a leaf client component.

This is the most severe functional gap in the audit: on mobile, `navLinks.map` renders flat `<a>` tags only — the `/fonds/[theme]` pages (reachable via the "Thématiques" dropdown on desktop) have **no mobile entry point at all**. This task also folds in point 6 (mega-menu is hover-only, no touch equivalent) since the audit recommends doing both together.

- [ ] **Step 1: Confirm the current breakage**

Run `npm run dev`, open `http://localhost:3000` at **375px width**, tap the burger icon. Confirm the mobile menu shows only 5 flat links (`La Fondation`, `Activités`, `Thématiques`, `Fonds d'archives`, `Contact`) and tapping "Thématiques" just jumps to `#thematiques-1a` on the home page — there is no way to reach `/fonds/alpage` or any other theme page from mobile nav.

Also confirm the desktop gap: at **1024px width** in devtools, switch to touch emulation (or just note structurally) that "Thématiques" only opens `onMouseEnter` — a touch tap on an `<a href="#thematiques-1a">` navigates immediately with no chance to see the flyout.

- [ ] **Step 2: Add mobile accordion state**

```tsx
// components/NavHeader.tsx — after line 26 (existing hoveredItem state):
const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
```

- [ ] **Step 3: Add tap support to the desktop dropdown trigger**

```tsx
// Before (lines 51-62):
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-0.75 transition-[border-color] duration-200 hover:border-plume"
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      hoveredItem === link.href ? "rotate-180" : ""
                    }`}
                  />
                </a>

// After:
                <a
                  href={link.href}
                  aria-haspopup="true"
                  aria-expanded={hoveredItem === link.href}
                  onClick={(e) => {
                    if (hoveredItem !== link.href) {
                      e.preventDefault();
                      setHoveredItem(link.href);
                    }
                  }}
                  className="flex items-center gap-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-0.75 transition-[border-color] duration-200 hover:border-plume"
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      hoveredItem === link.href ? "rotate-180" : ""
                    }`}
                  />
                </a>
```

This keeps hover working for mouse users unchanged (`onMouseEnter`/`onMouseLeave` on the parent `div` are untouched). For a touch tap: the first tap opens the flyout (`preventDefault` blocks the anchor jump) and reveals the real links inside it; a second tap on the trigger itself (now that `hoveredItem === link.href`) lets the default navigation proceed.

- [ ] **Step 4: Replace the mobile menu with a per-link accordion**

```tsx
// Before (lines 152-164):
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

// After:
      {isOpen && (
        <nav className="md:hidden flex flex-col border-t border-encre">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.href} className="border-b border-[rgba(19,20,23,0.1)]">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMobileItem((cur) => (cur === link.href ? null : link.href))
                  }
                  aria-expanded={openMobileItem === link.href}
                  className="w-full flex items-center justify-between font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre px-6 py-4 hover:bg-velin"
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      openMobileItem === link.href ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileItem === link.href && (
                  <div className="px-6 pb-4">
                    {link.label === "Thématiques" ? (
                      thematiqueCategories.map((cat, catIdx) => (
                        <div
                          key={cat.label}
                          className={
                            catIdx !== 0 ? "mt-3 pt-3 border-t border-gris/15" : ""
                          }
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <cat.icon
                              size={13}
                              strokeWidth={1.4}
                              className="text-gris shrink-0"
                            />
                            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gris">
                              {cat.label}
                            </span>
                          </div>
                          {cat.slugs.map((slug) => {
                            const t = themes.find((th) => th.slug === slug);
                            if (!t) return null;
                            const isActive = pathname === `/fonds/${t.slug}`;
                            return (
                              <Link
                                key={t.slug}
                                href={`/fonds/${t.slug}`}
                                onClick={() => setIsOpen(false)}
                                className={`font-body text-[13px] no-underline block py-2 transition-colors duration-150 ${
                                  isActive
                                    ? "font-semibold text-secondaire"
                                    : "font-normal text-encre"
                                }`}
                              >
                                {t.name}
                              </Link>
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline block py-2"
                      >
                        Vue générale →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-6 py-4 border-b border-[rgba(19,20,23,0.1)] hover:bg-velin"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      )}
```

- [ ] **Step 5: Verify at 375px**

- Open `http://localhost:3000` at 375px, tap the burger.
- Tap "Thématiques": it expands in place (chevron rotates) to show the 3 categories (Vie sociale / Patrimoine & territoire / Culture & mémoire) each with their theme links.
- Tap "La vie à l'alpage" (or any theme link): navigates to `/fonds/alpage`, menu closes.
- Tap "Activités": expands to show "Vue générale →" pointing at `#activites-1a`; tapping it scrolls there and closes the menu.
- Tap "La Fondation" / "Contact" (no dropdown): navigates directly, no accordion, same as before.

- [ ] **Step 6: Verify desktop tap support at 1024px**

- Open at 1024px width in devtools, enable touch simulation (devtools "toggle device toolbar" applies touch events for a device preset — or just click, which triggers the same `onClick` path).
- Click "Thématiques" trigger once: flyout opens (`aria-expanded="true"`), URL does *not* change (default prevented).
- Click it again (or click a theme link inside the now-visible flyout): navigates normally.
- Hover with a mouse still opens/closes the flyout as before (regression check).

- [ ] **Step 7: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add components/NavHeader.tsx
git commit -m "fix: expose thematic sub-nav on mobile menu and add tap support to mega-menu"
```

---

## Task 5: FondModal responsive grid (audit point 5 — most severe visual break)

**Files:**
- Modify: `components/FondModal.tsx:57-78`

**Interfaces:** None — `FondModal` props (`fond`, `chapitreName`, `onClose`) are unchanged.

- [ ] **Step 1: Confirm the current breakage at 375px**

Run `npm run dev`, open `http://localhost:3000/fonds/alpage`, click any fonds card with a photo (any card that opens with an image column — e.g. "Montée à l'alpage, famille Aymon, 1962"). At **375px width**, the modal's `grid-cols-[1fr_1.1fr]` splits the ~343px-wide modal (minus `p-4` outer padding) into two ~165px columns — the decorative image column and the text column are both illegibly narrow, and `p-10` (2.5rem = 40px) padding eats further into the text column. Confirm this before editing.

- [ ] **Step 2: Edit `components/FondModal.tsx`**

```tsx
// Before (lines 57-78):
        {hasImage ? (
          <div className="grid grid-cols-[1fr_1.1fr]">
            <div
              className="bg-placeholder min-w-0"
              style={{
                minHeight: 400,
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 80px 100%, 0 calc(100% - 35px))",
              }}
              aria-hidden="true"
            />
            <div className="p-10 relative">
              <CloseButton onClose={onClose} />
              <ModalContent fond={fond} chapitreName={chapitreName} />
            </div>
          </div>
        ) : (
          <div className="p-10 relative">
            <CloseButton onClose={onClose} />
            <ModalContent fond={fond} chapitreName={chapitreName} />
          </div>
        )}

// After:
        {hasImage ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
            <div
              className="hidden md:block bg-placeholder min-w-0"
              style={{
                minHeight: 400,
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 80px 100%, 0 calc(100% - 35px))",
              }}
              aria-hidden="true"
            />
            <div className="p-6 md:p-10 relative">
              <CloseButton onClose={onClose} />
              <ModalContent fond={fond} chapitreName={chapitreName} />
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-10 relative">
            <CloseButton onClose={onClose} />
            <ModalContent fond={fond} chapitreName={chapitreName} />
          </div>
        )}
```

Note: the decorative image column is hidden below `md` (consistent with the existing `hidden md:block` pattern already used for the Hero image in `HeroSection.tsx:61`), rather than shrunk — it's `aria-hidden="true"` decoration with no informational content to preserve.

- [ ] **Step 3: Verify at 375px and 1280px**

- At **375px**: open a photo-type fonds modal — content is a single column, full modal width minus `p-6` (24px) padding, no decorative image block, title/description/provenance fully legible. Open a non-photo fonds modal (e.g. an "écrit" or "son" type) — unaffected (it already had no image column), just confirm `p-6` padding at this width.
- At **1280px**: both modal types are pixel-identical to before the change (`md:grid-cols-[1fr_1.1fr]`, `md:p-10` restore desktop values).

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/FondModal.tsx
git commit -m "fix: stack FondModal to a single column below md instead of two illegible columns"
```

---

## Task 6: `sizes` on activité cover image (audit point 9)

**Files:**
- Modify: `app/activite/page.tsx:104-109`

**Interfaces:** None.

- [ ] **Step 1: Confirm the current gap**

Open `http://localhost:3000/activite` in devtools, throttle to a slow network profile (devtools Network tab → "Slow 4G"), reload at **375px width**. The cover image `<div className="hidden md:block ...">` is invisible on mobile, but its `<Image fill>` has no `sizes` prop, so Next.js defaults to `sizes="100vw"` and the browser still fetches a viewport-width-sized image even though it's never rendered. Confirm in the Network tab that an image request for the `couverture` asset fires even at 375px width (it shouldn't need to, but currently does download at close to full size due to the missing `sizes` hint).

- [ ] **Step 2: Edit `app/activite/page.tsx`**

```tsx
// Before (lines 96-111):
        {hasCouverture && (
          <div
            className="hidden md:block relative w-full self-stretch bg-placeholder h-110"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
            }}
          >
            <Image
              src={urlForImage(couverture).width(1200).fit("max").auto("format").url()}
              alt={couverture.alt ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}

// After:
        {hasCouverture && (
          <div
            className="hidden md:block relative w-full self-stretch bg-placeholder h-110"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
            }}
          >
            <Image
              src={urlForImage(couverture).width(1200).fit("max").auto("format").url()}
              alt={couverture.alt ?? ""}
              fill
              sizes="(min-width: 768px) 45vw, 0px"
              className="object-cover"
            />
          </div>
        )}
```

This matches the existing correct pattern at `components/HeroSection.tsx:73`.

- [ ] **Step 3: Verify**

Reload `/activite` in devtools Network tab at **375px width**: the couverture image request either doesn't fire or fetches a near-zero-size variant (Next.js image optimizer respects the `0px` slot for the sub-768px media condition). At **1280px width**: image loads as before, same visual result as pre-change.

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/activite/page.tsx
git commit -m "perf: add sizes to activite cover image so mobile doesn't download a hidden full-size image"
```

---

## Task 7: `sizes` on gallery thumbnails (audit point 10)

**Files:**
- Modify: `components/ActiviteGallery.tsx:59-64`

**Interfaces:** None — `cols` (existing local `const cols = Math.min(4, Math.max(2, photos.length))`) is read, not changed.

- [ ] **Step 1: Confirm the current gap**

Open `http://localhost:3000/activite` (with an activité that has gallery photos), devtools Network tab, reload at **375px width**. The grid is `grid-cols-2` below `md` (fixed 2 columns) and `md:grid-cols-[repeat(var(--gallery-cols),1fr)]` above it (`cols` columns, 2-4 depending on photo count). Each thumbnail `<Image fill>` has no `sizes`, so all thumbnails request near-`100vw`-sized images regardless of actually being ~50% (mobile) or `100/cols`% (desktop) of the viewport.

- [ ] **Step 2: Edit `components/ActiviteGallery.tsx`**

```tsx
// Before (lines 59-64):
              <Image
                src={photo.thumbUrl}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

// After:
              <Image
                src={photo.thumbUrl}
                alt={photo.alt}
                fill
                sizes={`(min-width: 768px) ${100 / cols}vw, 50vw`}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
```

This mirrors the grid's own responsive column count: fixed `50vw` below `md` (matching `grid-cols-2`), and `100/cols` vw at `md`+ (matching `repeat(var(--gallery-cols),1fr)` where `--gallery-cols` is set to `cols`).

- [ ] **Step 3: Verify**

Reload `/activite` in devtools Network tab:
- At **375px width** (2-column grid): thumbnail requests are sized around half the viewport width, not full width.
- At **1280px width** with e.g. 3 gallery photos (`cols` = 3): thumbnail requests are sized around a third of the viewport width.
- Visually, thumbnails still fill their grid cells correctly at both widths (no layout change, only download-size change).

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/ActiviteGallery.tsx
git commit -m "perf: add sizes to gallery thumbnails matching the responsive column count"
```

---

## Task 8: `sizes` on Portable Text body images (audit point 11)

**Files:**
- Modify: `components/sanity/PortableTextContent.tsx:61-66`

**Interfaces:** None.

- [ ] **Step 1: Confirm the current gap**

Open `/activite` for an activité whose rich-text body includes an inline image block, devtools Network tab, reload at **375px width**. The image sits in a `max-w-175` (700px) container nested inside `max-w-350 mx-auto` (per `app/activite/page.tsx:115`, `<article className="max-w-175 mx-auto ...">`). The `<Image fill>` has no `sizes`, so it requests near-`100vw` even though it's capped at 700px on desktop.

- [ ] **Step 2: Edit `components/sanity/PortableTextContent.tsx`**

```tsx
// Before (lines 61-66):
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
            />

// After:
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              className="object-cover"
            />
```

- [ ] **Step 3: Verify**

Reload the activité page with a body image, devtools Network tab:
- At **375px width**: image request is sized to the full viewport width (`100vw` branch — correct, since the container is nearly full-width on mobile).
- At **1280px width**: image request is capped at 700px (the fixed `max-w-175` container width), not the full viewport.

- [ ] **Step 4: Run automated checks**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/sanity/PortableTextContent.tsx
git commit -m "perf: add sizes to Portable Text body images"
```

---

## Task 9: Filter chips row — verify, patch only if needed (audit point 7)

**Files:**
- Modify (conditionally): `components/ActivitesSection.tsx:16-42`

**Interfaces:** None.

The audit flags this as likely already fixed by Task 1's padding change (`flex-wrap` is already in place), and only prescribes a horizontal-scroll fallback *if* verification still shows a problem. Do not apply the patch in Step 2 unless Step 1 shows a real problem.

- [ ] **Step 1: Verify at 320px and 375px**

Run `npm run dev`, open `http://localhost:3000` at **320px width** (devtools → set width to exactly 320, the narrowest common target), scroll to `#activites-1a`. Check:
- The H2 ("Les actions de la fondation", 34px) and the 6 filter chips (`Tous`, `Écrits`, `Archives`, `Recherche`, `Sonore`, `Portraits`) — do they wrap onto multiple readable lines via the existing `flex-wrap`, or do chips overlap/get clipped/force horizontal page scroll?
- Repeat at **375px width**.

If both widths show clean wrapping with no horizontal page scroll and no clipped/overlapping chips: **stop here, no code change needed** — proceed to Step 3.

- [ ] **Step 2: Apply horizontal-scroll fallback (only if Step 1 found a real problem)**

```tsx
// Before (lines 26-41):
        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3.5 py-2 border border-encre rounded-xs font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase cursor-pointer transition-[background-color,color] duration-200 ${
                filter === option
                  ? "bg-encre text-papier"
                  : "bg-velin text-encre"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

// After:
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto md:flex-wrap -mx-6 px-6 md:mx-0 md:px-0 pb-1 md:pb-0">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`shrink-0 px-3.5 py-2 border border-encre rounded-xs font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase cursor-pointer transition-[background-color,color] duration-200 ${
                filter === option
                  ? "bg-encre text-papier"
                  : "bg-velin text-encre"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
```

This turns the chip row into a horizontally-scrolling toolbar below `md` (`overflow-x-auto`, `shrink-0` on each chip so they don't compress) while keeping the existing `flex-wrap` behavior at `md`+. The `-mx-6 px-6` lets the scroll area bleed to the section's own edge (matching the `px-6` section padding from Task 1) so a partially-cut-off chip signals "more content" rather than looking clipped.

- [ ] **Step 3: Run automated checks (only if Step 2 was applied)**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 4: Commit (only if Step 2 was applied)**

```bash
git add components/ActivitesSection.tsx
git commit -m "fix: horizontal-scroll fallback for filter chips below md"
```

If Step 1 found no problem, skip Steps 2-4 entirely — nothing to commit for this task.

---

## Task 10: Conseil de fondation list — verify, patch only if needed (audit point 8)

**Files:**
- Modify (conditionally): `components/FondationSection.tsx:28-42`

**Interfaces:** None.

- [ ] **Step 1: Verify at 320px and 375px**

After Task 1's padding fix is in place, open `http://localhost:3000` at **320px width**, scroll to `#fondation-1a`. Check each row of the conseil list (`flex justify-between items-baseline`):
- "Annette Corbaz" / "Fondatrice, présidente"
- "Anne Colyn" / "Vice-présidente"
- "Michel Beytrison" / "Secrétaire-trésorier"

Look specifically at the longest pair ("Michel Beytrison" 17 chars + "Secrétaire-trésorier" 20 chars, both on one baseline row via `justify-between`). If the name and role fit on one line without visually crowding or the role text wrapping awkwardly mid-word at 320px: **stop here, no code change needed**.

- [ ] **Step 2: Apply `flex-col` fallback below `sm` (only if Step 1 found a real problem)**

```tsx
// Before (lines 28-42):
          <div className="flex flex-col">
            {conseil.map((membre) => (
              <div
                key={membre.name}
                className="flex justify-between items-baseline py-4 border-b border-[rgba(19,20,23,0.12)]"
              >
                <span className="font-display font-normal text-[17px] text-encre">
                  {membre.name}
                </span>
                <span className="font-mono font-normal text-[12px] tracking-wider uppercase text-gris">
                  {membre.role}
                </span>
              </div>
            ))}
          </div>

// After:
          <div className="flex flex-col">
            {conseil.map((membre) => (
              <div
                key={membre.name}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0 py-4 border-b border-[rgba(19,20,23,0.12)]"
              >
                <span className="font-display font-normal text-[17px] text-encre">
                  {membre.name}
                </span>
                <span className="font-mono font-normal text-[12px] tracking-wider uppercase text-gris">
                  {membre.role}
                </span>
              </div>
            ))}
          </div>
```

Note this is the one place in the whole audit where `sm:` (640px) rather than `md:` is the right breakpoint — the failure is about a *narrow single row* (name+role on one baseline), not about the page-level `md` transition, so it should recover as soon as there's enough width for both strings, not wait until 768px.

- [ ] **Step 3: Run automated checks (only if Step 2 was applied)**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 4: Commit (only if Step 2 was applied)**

```bash
git add components/FondationSection.tsx
git commit -m "fix: stack conseil de fondation name/role below sm to avoid cramped wrap"
```

If Step 1 found no problem, skip Steps 2-4 entirely — nothing to commit for this task.

---

## Task 11: Final verification pass (audit Level 5 checklist)

**Files:** None modified — this is a verification-only task confirming Tasks 1-10 together.

- [ ] **Step 1: Narrow-width pass at 320px and 375px**

With the dev server running (`npm run dev`), check each of these at both **320px** and **375px** in devtools responsive mode:
- Home page (`/`): all 4 sections from Task 1 (Activités, Valorisation, Fondation, Déposer) — confirm padding, confirm no horizontal page scrollbar anywhere on the page.
- A fonds modal with a photo (`/fonds/alpage` → click a photo-type fonds card) — confirm single-column stack from Task 5, no illegible narrow columns.
- The filter chip row (`#activites-1a`) and conseil list (`#fondation-1a`) — confirm the Task 9/10 outcome (either "already fine" or the fallback) still holds.

- [ ] **Step 2: Zoom/reflow pass**

Open `/fonds/alpage` at a normal desktop width (e.g. 1280px), set browser zoom to **400%** (Ctrl/Cmd + repeated `+`, or devtools zoom). Confirm:
- Content reflows to a single readable column without requiring horizontal scrolling (per WCAG 1.4.10 Reflow).
- `components/ThemeSummary` (the desktop-only sidebar summary, `ThemePageBody.tsx:26`) is still intentionally hidden below `md` — at 400% zoom the effective layout viewport narrows below 768px CSS px, so this sidebar should disappear same as on a real narrow device. This is the existing "intentional degradation" pattern flagged as already-correct in the audit — confirm it doesn't regress after Tasks 3 and 5 (both touch files on this same page).

- [ ] **Step 3: Long French content pass**

Specifically re-check (don't substitute short placeholder text):
- Conseil de fondation names/roles (`Michel Beytrison` / `Secrétaire-trésorier`) at 320px — covered by Task 10, re-confirm here as part of the full page.
- Filter chip labels (`Écrits`, `Archives`, `Recherche`, `Sonore`, `Portraits`) at 320px — covered by Task 9, re-confirm.
- A theme page chapter title and fonds title that's long in French (e.g. "Montée à l'alpage, famille Aymon, 1962") inside the Task 5 fixed modal at 375px — confirm the title doesn't overflow the single-column layout.

- [ ] **Step 4: Mobile nav functional pass**

At 375px, open the mobile menu (Task 4) and confirm every theme under every category (`Vie sociale`, `Patrimoine & territoire`, `Culture & mémoire`) is tappable and navigates to its `/fonds/[slug]` page — this is the regression check for the "no mobile access to `/fonds/[theme]`" functional bug the audit called the most severe non-visual issue.

- [ ] **Step 5: Full regression build**

```bash
npm run build
```
Expected: build succeeds with no new type or lint errors surfaced during production build (Next.js runs type-checking as part of `build`).

- [ ] **Step 6: Commit (only if Step 5 uncovered fixes)**

If the build or any of Steps 1-4 surfaced a regression requiring a code change, fix it, re-run the relevant verification, then:

```bash
git add -A
git commit -m "fix: address regressions found in final responsive verification pass"
```

If nothing needed fixing, this task produces no commit — it's the closing verification gate for Tasks 1-10.

---

## Execution order

Matches the audit's recommended sequence:

```
Task 1 (padding) → Task 2 (home hero) → Task 3 (theme hero) → Task 4 (mobile nav)
→ Task 5 (FondModal) → Task 6, 7, 8 (image sizes) → Task 9, 10 (chips/conseil verify)
→ Task 11 (final verification)
```
