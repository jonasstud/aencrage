# Archivage automatique du "Fond du mois" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the hardcoded "fonds par thématiques" data into Sanity, and
add a Studio button that archives the current "fond du mois" into the right
thematic/chapter when the client replaces it.

**Architecture:** Two new Sanity document types (`theme`, `fond`) mirror the
existing `fondDuMois` content fields. A custom Studio document action copies
the published `fondDuMois` into a new `fond` document and clears the
singleton's draft. A one-off script migrates the 11 hardcoded themes into
Sanity. The Next.js `/fonds/[theme]` pages, the nav header, and the sitemap
switch from the static `lib/fondsThemes.ts` array to Sanity queries, through
a small adapter that maps Sanity's shape onto the existing `ThemePage` /
`Chapitre` / `Fond` types so the display components stay unchanged. A
webhook-triggered API route keeps pages fresh after Studio edits.

**Tech Stack:** Sanity Studio v3 (`sanity: ^6.10.1`), Next.js 16 App Router,
`next-sanity` (already includes `next-sanity/webhook`), Node's built-in
`node:test` runner (no new test dependency — Node 24 here runs `.ts` test
files directly).

**Spec:** [docs/superpowers/specs/2026-09-17-archivage-fond-du-mois-design.md](../specs/2026-09-17-archivage-fond-du-mois-design.md)

## Global Constraints

- Stay within the Sanity free plan (10 000 documents, 100 GB assets, GROQ
  webhooks included) — current volume is a few dozen documents, far under
  any limit.
- No new npm dependencies for testing — use `node --test` on `.ts` files
  directly (verified working on the Node 24 installed here).
- `fond` mirrors `fondDuMois`'s content fields exactly, so the archiving
  action is a straight field-to-field copy (no lossy transform at
  archive-time — only the one-off migration script needs to convert legacy
  plain text into Portable Text).
- `chapitre` is a free-text string field on both `fondDuMois` and `fond` —
  no dynamic dropdown/validation component (single editor, low typo risk,
  see spec's "Non-objectifs").
- `lib/fondsThemes.ts` and `audio-peaks.json` are kept in the repo as
  reference/backup and must keep compiling — do not remove fields from
  their exported types, only add optional ones.
- `studio-aencrage/` now has its own git repository (initialized at setup
  time, separate from `aencrage/`'s, with its own initial commit and a
  `.gitignore` for `node_modules/`, `dist/`, `.sanity/`, `*.log`). It has
  no worktree isolation — commits there land directly on its `master`
  branch. Tasks touching that folder DO include a commit step, run
  directly `cd studio-aencrage && git add ... && git commit ...` (not
  inside the `aencrage` worktree).

---

## Task 1: `theme` Sanity schema + desk structure entry

**Files:**
- Create: `studio-aencrage/schemaTypes/theme.ts`
- Modify: `studio-aencrage/schemaTypes/index.ts`
- Modify: `studio-aencrage/structure/index.ts`

**Interfaces:**
- Produces: schema type `theme` with fields `title` (string), `slug`
  (slug), `intro` (text), `chapitres` (array of `{id: string, name:
  string}`), `ordre` (number). Later tasks (2, 3, 6, 8) reference these
  field names exactly.

- [ ] **Step 1: Write the schema**

```ts
// studio-aencrage/schemaTypes/theme.ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const theme = defineType({
  name: 'theme',
  title: 'Thématique',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la thématique',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Texte affiché en tête de la page thématique.',
    }),
    defineField({
      name: 'chapitres',
      title: 'Chapitres',
      description:
        'Sous-sections de cette thématique, dans l\'ordre d\'affichage.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapitreEntry',
          fields: [
            defineField({
              name: 'id',
              title: 'Identifiant (slug)',
              type: 'string',
              description: "Ex. « inalpe ». Utilisé dans l'URL d'ancrage.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Nom affiché',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'id'}},
        }),
      ],
    }),
    defineField({
      name: 'ordre',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Les thématiques sont triées par ce nombre, croissant.',
    }),
  ],
  preview: {
    select: {title: 'title', chapitres: 'chapitres'},
    prepare({title, chapitres}) {
      return {
        title,
        subtitle: Array.isArray(chapitres)
          ? `${chapitres.length} chapitre(s)`
          : undefined,
      }
    },
  },
})
```

- [ ] **Step 2: Register the type**

Edit `studio-aencrage/schemaTypes/index.ts`:

```ts
import {activite} from './activite'
import {fondDuMois} from './fondDuMois'
import {theme} from './theme'

export const schemaTypes = [activite, fondDuMois, theme]
```

- [ ] **Step 3: Add a desk structure entry**

Edit `studio-aencrage/structure/index.ts`:

```ts
import type {StructureResolver} from 'sanity/structure'
import {ArchiveIcon} from '@sanity/icons/Archive'
import {TagIcon} from '@sanity/icons/Tag'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Fond du mois')
        .icon(ArchiveIcon)
        .child(
          S.document()
            .schemaType('fondDuMois')
            .documentId('fondDuMois')
            .title('Fond du mois'),
        ),
      S.listItem()
        .title('Thématiques')
        .icon(TagIcon)
        .child(S.documentTypeList('theme').title('Thématiques')),
    ])
```

- [ ] **Step 4: Verify in the Studio**

Run: `cd studio-aencrage && npm run dev`
Open the local Studio URL, confirm "Thématiques" appears in the left nav,
create a throwaway `theme` document (title, slug auto-fills, add one
chapitre entry), save it, confirm the preview line shows "1 chapitre(s)".
Delete the throwaway document afterwards.

- [ ] **Step 5: Commit**

```bash
cd studio-aencrage
git add schemaTypes/theme.ts schemaTypes/index.ts structure/index.ts
git commit -m "feat: add theme document schema and desk structure entry"
```

---

## Task 2: `fond` Sanity schema + desk structure entry

**Files:**
- Create: `studio-aencrage/schemaTypes/fond.ts`
- Modify: `studio-aencrage/schemaTypes/index.ts`
- Modify: `studio-aencrage/structure/index.ts`

**Interfaces:**
- Consumes: schema type `theme` (Task 1).
- Produces: schema type `fond` with fields `title`, `typeFond` (array of
  string, same options as `fondDuMois`), `donateur`, `chapo`, `couverture`,
  `content` (Portable Text, same block config as `fondDuMois`), `gallery`,
  `documents`, `audioFiles`, `videoUrl` (url), `theme` (reference →
  `theme`, required), `chapitre` (string, required), `dates` (string).
  Later tasks (5, 6, 8) reference these field names exactly.

- [ ] **Step 1: Write the schema**

Reuses the exact same `content`/`gallery`/`documents`/`audioFiles` field
definitions as `studio-aencrage/schemaTypes/fondDuMois.ts` (copy those
blocks verbatim — see that file for the full block/marks/annotations
config), plus the fields below.

```ts
// studio-aencrage/schemaTypes/fond.ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {ArchiveIcon} from '@sanity/icons/Archive'
import {TextIcon} from '@sanity/icons/Text'

export const fond = defineType({
  name: 'fond',
  title: 'Fond (archivé)',
  type: 'document',
  icon: ArchiveIcon,
  fields: [
    defineField({
      name: 'theme',
      title: 'Thématique',
      type: 'reference',
      to: [{type: 'theme'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapitre',
      title: 'Chapitre',
      type: 'string',
      description:
        'Reprenez le nom d\'un chapitre existant de la thématique choisie, ou saisissez-en un nouveau.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre du fond',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'Ex. « 1957 », « Env 1973 », « 1890–1990 ».',
    }),
    defineField({
      name: 'typeFond',
      title: 'Type de fond',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Photo', value: 'Photo'},
          {title: 'Écrit', value: 'Écrit'},
          {title: 'Son', value: 'Son'},
          {title: 'Vidéo', value: 'Vidéo'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'donateur',
      title: 'Donateur / Provenance',
      type: 'string',
    }),
    defineField({
      name: 'chapo',
      title: 'Chapô',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videoUrl',
      title: 'Lien vidéo',
      type: 'url',
      description: 'YouTube ou fichier vidéo hébergé.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'couverture',
      title: 'Image de couverture',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre', value: 'h2'},
            {title: 'Sous-titre', value: 'h3'},
          ],
          lists: [{title: 'Liste à puces', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'citation',
          title: 'Citation',
          icon: TextIcon,
          fields: [
            defineField({
              name: 'texte',
              title: 'Texte',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'attribution',
              title: 'Attribution',
              type: 'string',
            }),
          ],
          preview: {select: {title: 'texte', subtitle: 'attribution'}},
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          title: 'Photo',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'documents',
      title: 'Documents à télécharger',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'file',
          title: 'Document',
          fields: [
            defineField({
              name: 'title',
              title: 'Nom du document',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'audioFiles',
      title: 'Fichiers audio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'file',
          title: 'Fichier audio',
          options: {accept: 'audio/*'},
          fields: [
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'duree',
              title: 'Durée (affichage)',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', chapitre: 'chapitre', themeTitle: 'theme.title'},
    prepare({title, chapitre, themeTitle}) {
      return {
        title,
        subtitle: [themeTitle, chapitre].filter(Boolean).join(' · '),
      }
    },
  },
})
```

- [ ] **Step 2: Register the type**

Edit `studio-aencrage/schemaTypes/index.ts`:

```ts
import {activite} from './activite'
import {fondDuMois} from './fondDuMois'
import {theme} from './theme'
import {fond} from './fond'

export const schemaTypes = [activite, fondDuMois, theme, fond]
```

- [ ] **Step 3: Add a desk structure entry**

Edit `studio-aencrage/structure/index.ts`, add after the "Thématiques" item:

```ts
      S.listItem()
        .title('Fonds archivés')
        .icon(ArchiveIcon)
        .child(S.documentTypeList('fond').title('Fonds archivés')),
```

- [ ] **Step 4: Verify in the Studio**

Run: `cd studio-aencrage && npm run dev` (if not already running).
Create a throwaway `theme`, then a throwaway `fond` referencing it with
`chapitre` set to one of its chapitre names, `typeFond: ["Écrit"]`, a short
`content` paragraph. Confirm the preview line shows "Nom thématique ·
chapitre". Delete both throwaway documents afterwards.

- [ ] **Step 5: Commit**

```bash
cd studio-aencrage
git add schemaTypes/fond.ts schemaTypes/index.ts structure/index.ts
git commit -m "feat: add fond document schema and desk structure entry"
```

---

## Task 3: Extend `fondDuMois` with `theme`, `chapitre`, `videoUrl`

**Files:**
- Modify: `studio-aencrage/schemaTypes/fondDuMois.ts`

**Interfaces:**
- Consumes: schema type `theme` (Task 1).
- Produces: `fondDuMois.theme` (reference → `theme`, optional at schema
  level), `fondDuMois.chapitre` (string, optional at schema level),
  `fondDuMois.videoUrl` (url, optional). Task 5's archiving action enforces
  `theme`/`chapitre` presence at click-time, not the schema — a draft must
  stay saveable before the client has picked a thematic.

- [ ] **Step 1: Add the fields**

Edit `studio-aencrage/schemaTypes/fondDuMois.ts`, insert after the
`donateur` field (before `chapo`):

```ts
    defineField({
      name: 'theme',
      title: 'Thématique de classement',
      type: 'reference',
      to: [{type: 'theme'}],
      description:
        'Thématique dans laquelle ce fond sera archivé au clic sur "Nouveau fond du mois".',
    }),
    defineField({
      name: 'chapitre',
      title: 'Chapitre de classement',
      type: 'string',
      description:
        'Reprenez le nom d\'un chapitre existant de la thématique choisie, ou saisissez-en un nouveau.',
    }),
```

And after the `couverture` field (before `content`):

```ts
    defineField({
      name: 'videoUrl',
      title: 'Lien vidéo',
      type: 'url',
      description: 'YouTube ou fichier vidéo hébergé.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
```

- [ ] **Step 2: Verify in the Studio**

Run: `cd studio-aencrage && npm run dev` (if not already running). Open
"Fond du mois", confirm the new "Thématique de classement", "Chapitre de
classement", and "Lien vidéo" fields appear and are editable, confirm the
document still saves as a draft with them empty (no validation error), and
confirm the existing preview subtitle (`typeFond`/`annee`) still renders
correctly in the document list — the two inserts don't touch
`preview.prepare`, this just confirms the edits didn't break the
surrounding `fields` array syntax (trailing commas, matching brackets).

- [ ] **Step 3: Commit**

```bash
cd studio-aencrage
git add schemaTypes/fondDuMois.ts
git commit -m "feat: add theme, chapitre and videoUrl fields to fondDuMois"
```

---

## Task 4: `textToPortableText` converter + tests

**Files:**
- Create: `studio-aencrage/lib/textToPortableText.ts`
- Test: `studio-aencrage/lib/textToPortableText.test.ts`

**Interfaces:**
- Produces: `textToPortableText(text: string): PortableTextBlock[]` — pure
  function, no Sanity client dependency. Task 6 imports this exact
  function.

- [ ] **Step 1: Write the failing tests**

```ts
// studio-aencrage/lib/textToPortableText.test.ts
import {test} from 'node:test'
import assert from 'node:assert/strict'
import {textToPortableText} from './textToPortableText'

test('splits paragraphs on blank lines into separate blocks', () => {
  const blocks = textToPortableText('Premier paragraphe.\n\nDeuxième paragraphe.')
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].style, 'normal')
  assert.equal(blocks[0].children[0].text, 'Premier paragraphe.')
  assert.equal(blocks[1].children[0].text, 'Deuxième paragraphe.')
})

test('keeps single newlines inside the same block', () => {
  const blocks = textToPortableText('Ligne 1\nLigne 2')
  assert.equal(blocks.length, 1)
})

test('converts a markdown link into a span with a link mark', () => {
  const blocks = textToPortableText('Voir [le site](https://example.com) pour plus.')
  assert.equal(blocks.length, 1)
  const [before, link, after] = blocks[0].children
  assert.equal(before.text, 'Voir ')
  assert.equal(link.text, 'le site')
  assert.equal(after.text, ' pour plus.')
  assert.equal(link.marks.length, 1)
  const markDef = blocks[0].markDefs.find((m) => m._key === link.marks[0])
  assert.equal(markDef?.href, 'https://example.com')
})

test('handles a paragraph that is only a link', () => {
  const blocks = textToPortableText(
    '[https://example.com/](https://example.com/)',
  )
  assert.equal(blocks[0].children.length, 1)
  assert.equal(blocks[0].children[0].text, 'https://example.com/')
})

test('handles multiple links on consecutive single-newline lines', () => {
  const blocks = textToPortableText(
    '[Premier lien](https://a.example)\n[Second lien](https://b.example)',
  )
  assert.equal(blocks.length, 1)
  const hrefs = blocks[0].markDefs.map((m) => m.href)
  assert.deepEqual(hrefs, ['https://a.example', 'https://b.example'])
})

test('returns an empty array for blank input', () => {
  assert.deepEqual(textToPortableText('   \n\n  '), [])
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd studio-aencrage && node --test lib/textToPortableText.test.ts`
Expected: FAIL — `Cannot find module './textToPortableText'`.

- [ ] **Step 3: Write the implementation**

```ts
// studio-aencrage/lib/textToPortableText.ts
import {randomUUID} from 'node:crypto'

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type LinkMarkDef = {_type: 'link'; _key: string; href: string}
export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Span[]
  markDefs: LinkMarkDef[]
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

function plainSpan(text: string): Span {
  return {_type: 'span', _key: randomUUID(), text, marks: []}
}

function paragraphToBlock(paragraph: string): PortableTextBlock {
  const children: Span[] = []
  const markDefs: LinkMarkDef[] = []
  let lastIndex = 0
  LINK_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = LINK_PATTERN.exec(paragraph)) !== null) {
    const [full, label, href] = match
    if (match.index > lastIndex) {
      children.push(plainSpan(paragraph.slice(lastIndex, match.index)))
    }
    const markKey = randomUUID()
    markDefs.push({_type: 'link', _key: markKey, href})
    children.push({_type: 'span', _key: randomUUID(), text: label, marks: [markKey]})
    lastIndex = match.index + full.length
  }
  if (lastIndex < paragraph.length) {
    children.push(plainSpan(paragraph.slice(lastIndex)))
  }
  if (children.length === 0) {
    children.push(plainSpan(paragraph))
  }

  return {_type: 'block', _key: randomUUID(), style: 'normal', children, markDefs}
}

export function textToPortableText(text: string): PortableTextBlock[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(paragraphToBlock)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd studio-aencrage && node --test lib/textToPortableText.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
cd studio-aencrage
git add lib/textToPortableText.ts lib/textToPortableText.test.ts
git commit -m "feat: add textToPortableText converter with tests"
```

---

## Task 5: Custom document action "Nouveau fond du mois"

**Files:**
- Create: `studio-aencrage/actions/newFondDuMois.ts`
- Modify: `studio-aencrage/sanity.config.ts`

**Interfaces:**
- Consumes: `fondDuMois` fields (`title`, `annee`, `typeFond`, `donateur`,
  `theme`, `chapitre`, `videoUrl`, `chapo`, `couverture`, `content`,
  `gallery`, `documents`, `audioFiles` — Tasks 1–3), `fond` schema (Task
  2).
- Produces: a `DocumentActionComponent` named `newFondDuMoisAction`, wired
  into `sanity.config.ts`'s `document.actions`. No other task consumes
  this directly — it's a terminal UI action.

- [ ] **Step 1: Write the action**

```ts
// studio-aencrage/actions/newFondDuMois.ts
import {useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'
import {useToast} from '@sanity/ui'
import {ArchiveIcon} from '@sanity/icons/Archive'

// Note: 'annee' (number) is deliberately excluded — `fond` has no `annee`
// field, it has `dates` (string), which `onHandle` below derives from
// `published.annee` instead of copying it verbatim.
const ARCHIVABLE_FIELDS = [
  'title',
  'typeFond',
  'donateur',
  'chapo',
  'couverture',
  'content',
  'gallery',
  'documents',
  'audioFiles',
  'videoUrl',
] as const

// Everything on fondDuMois that should go back to empty once archived —
// a superset of ARCHIVABLE_FIELDS, since 'annee' lives only on fondDuMois
// (it becomes `fond.dates` above, not a same-named field).
const FIELDS_TO_CLEAR = [...ARCHIVABLE_FIELDS, 'annee', 'theme', 'chapitre']

export const newFondDuMoisAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const {published} = props
  const client = useClient({apiVersion: '2026-07-21'})
  const {patch} = useDocumentOperation(props.id, props.type)
  const toast = useToast()
  const [isRunning, setIsRunning] = useState(false)

  if (props.type !== 'fondDuMois') return null

  return {
    label: isRunning ? 'Archivage en cours…' : 'Nouveau fond du mois',
    icon: ArchiveIcon,
    disabled: isRunning,
    onHandle: async () => {
      if (!published || !published.title) {
        props.onComplete()
        return
      }

      const themeRef = published.theme as {_ref?: string} | undefined
      const chapitre = published.chapitre as string | undefined
      if (!themeRef?._ref || !chapitre) {
        toast.push({
          status: 'error',
          title: 'Merci de choisir une thématique et un chapitre avant d\'archiver ce fond.',
        })
        props.onComplete()
        return
      }

      setIsRunning(true)
      try {
        const archived: Record<string, unknown> = {
          _type: 'fond',
          theme: {_type: 'reference', _ref: themeRef._ref},
          chapitre,
          dates:
            typeof published.annee === 'number' ? String(published.annee) : undefined,
        }
        for (const field of ARCHIVABLE_FIELDS) {
          if (published[field] !== undefined) {
            archived[field] = published[field]
          }
        }

        const created = await client.create(archived)

        patch.execute([{unset: FIELDS_TO_CLEAR}])

        toast.push({
          status: 'success',
          title: 'Fond archivé.',
          description: `Créé dans "Fonds archivés" (id: ${created._id}).`,
        })
      } catch (err) {
        toast.push({
          status: 'error',
          title: "Échec de l'archivage, le fond du mois n'a pas été modifié.",
          description: err instanceof Error ? err.message : String(err),
        })
      } finally {
        setIsRunning(false)
        props.onComplete()
      }
    },
  }
}
```

`useToast` comes from `@sanity/ui` (already a transitive dependency of
`sanity`, resolvable without any `package.json` change — verified at
`studio-aencrage/node_modules/@sanity/ui`), not from `props.toast`, which
doesn't exist on `DocumentActionProps`.

- [ ] **Step 2: Wire the action into `sanity.config.ts`**

```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {newFondDuMoisAction} from './actions/newFondDuMois'

export default defineConfig({
  name: 'default',
  title: 'æncrage',

  projectId: 'dhukk50e',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => item.templateId !== 'fondDuMois')
        : prev,
    actions: (prev, {schemaType}) =>
      schemaType === 'fondDuMois'
        ? [...prev.filter(({action}) => action !== 'duplicate'), newFondDuMoisAction]
        : prev,
  },
})
```

- [ ] **Step 3: Manual verification in the Studio**

Run: `cd studio-aencrage && npm run dev` (if not already running).

1. Open "Fond du mois", leave `theme`/`chapitre` empty, publish some
   content, click "Nouveau fond du mois" → expect the red error toast and
   no new document created.
2. Set `theme` (pick or create a throwaway theme) and `chapitre`, publish,
   click "Nouveau fond du mois" → expect a success toast, a new document
   under "Fonds archivés" with the copied content, and the "Fond du mois"
   form now empty (still showing the old published version live on the
   site until you publish the new empty state — do not publish it during
   this test, just confirm the draft is empty and discard it).
3. Clean up: delete any throwaway `fond`/`theme` documents created during
   verification.

- [ ] **Step 4: Commit**

```bash
cd studio-aencrage
git add actions/newFondDuMois.ts sanity.config.ts
git commit -m "feat: add Nouveau fond du mois archiving action"
```

---

## Task 6: One-off migration script

**Files:**
- Create: `studio-aencrage/scripts/migrate-fonds-themes.ts`

**Interfaces:**
- Consumes: `textToPortableText` (Task 4), `theme`/`fond` schemas (Tasks
  1–2), `themes` data from `aencrage/lib/fondsThemes.ts` (read-only,
  unmodified by this task).
- Produces: nothing consumed by later tasks — this is a one-off
  operational script, run manually once, not part of the app's runtime
  code path.

**⚠ This script writes to the live `production` Sanity dataset. Do not run
it unattended — the user should confirm before the write step executes,
and review the created documents in the Studio afterwards.**

- [ ] **Step 1: Write the script**

```ts
// studio-aencrage/scripts/migrate-fonds-themes.ts
import path from 'node:path'
import {createClient} from '@sanity/client'
import {themes} from '../../aencrage/lib/fondsThemes'
import {textToPortableText} from '../lib/textToPortableText'

const client = createClient({
  projectId: 'dhukk50e',
  dataset: 'production',
  apiVersion: '2026-07-21',
  useCdn: false,
  token: process.env.SANITY_MIGRATION_TOKEN,
})

const PUBLIC_DIR = path.resolve(__dirname, '../../aencrage/public')

const TYPE_TO_TYPE_FOND: Record<string, string> = {
  photo: 'Photo',
  ecrit: 'Écrit',
  son: 'Son',
  video: 'Vidéo',
}

async function uploadAsset(relativeUrl: string) {
  if (/^https?:\/\//.test(relativeUrl)) return null // external (e.g. YouTube), not an asset
  const absolutePath = path.join(PUBLIC_DIR, relativeUrl.replace(/^\//, ''))
  const fs = await import('node:fs')
  const buffer = fs.readFileSync(absolutePath)
  const filename = path.basename(absolutePath)
  return client.assets.upload('file', buffer, {filename})
}

async function uploadImage(relativeUrl: string) {
  const asset = await uploadAsset(relativeUrl)
  return asset
}

function themeDocId(slug: string) {
  return `theme-${slug}`
}

function fondDocId(id: string) {
  return `fond-${id}`
}

async function migrateTheme(themeData: (typeof themes)[number], ordre: number) {
  const id = themeDocId(themeData.slug)
  await client.createOrReplace({
    _id: id,
    _type: 'theme',
    title: themeData.name,
    slug: {_type: 'slug', current: themeData.slug},
    intro: themeData.intro,
    chapitres: themeData.chapitres.map((c) => ({
      _key: c.id,
      id: c.id,
      name: c.name,
    })),
    ordre,
  })
  return id
}

async function migrateFond(
  fond: (typeof themes)[number]['chapitres'][number]['fonds'][number],
  chapitreName: string,
  themeDocumentId: string,
) {
  const couvertureAsset = fond.images?.[0]
    ? await uploadImage(fond.images[0])
    : null
  const galleryAssets = fond.images
    ? await Promise.all(fond.images.map((img) => uploadImage(img)))
    : []
  const documentAssets = fond.documents
    ? await Promise.all(
        fond.documents.map(async (doc) => ({
          label: doc.label,
          asset: await uploadAsset(doc.url),
        })),
      )
    : []
  const audioAsset = fond.audioSrc ? await uploadAsset(fond.audioSrc) : null

  await client.createOrReplace({
    _id: fondDocId(fond.id),
    _type: 'fond',
    theme: {_type: 'reference', _ref: themeDocumentId},
    chapitre: chapitreName,
    title: fond.title,
    dates: fond.dates,
    typeFond: [TYPE_TO_TYPE_FOND[fond.type]].filter(Boolean),
    donateur: fond.provenance,
    chapo: fond.desc,
    videoUrl: fond.videoUrl && /^https?:\/\//.test(fond.videoUrl) ? fond.videoUrl : undefined,
    content: textToPortableText(fond.fullText ?? fond.desc),
    couverture: couvertureAsset
      ? {_type: 'image', asset: {_type: 'reference', _ref: couvertureAsset._id}, alt: fond.title}
      : undefined,
    gallery: galleryAssets
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a, i) => ({
        _type: 'image',
        _key: `img-${i}`,
        asset: {_type: 'reference', _ref: a._id},
        alt: fond.title,
      })),
    documents: documentAssets
      .filter((d) => d.asset)
      .map((d, i) => ({
        _type: 'file',
        _key: `doc-${i}`,
        asset: {_type: 'reference', _ref: d.asset!._id},
        title: d.label,
      })),
    audioFiles: audioAsset
      ? [
          {
            _type: 'file',
            _key: 'audio-0',
            asset: {_type: 'reference', _ref: audioAsset._id},
            title: fond.title,
          },
        ]
      : undefined,
  })
}

async function main() {
  if (!process.env.SANITY_MIGRATION_TOKEN) {
    throw new Error('Set SANITY_MIGRATION_TOKEN (a write-enabled Sanity API token) before running this script.')
  }

  for (const [index, themeData] of themes.entries()) {
    console.log(`Thématique: ${themeData.name}`)
    const themeDocumentId = await migrateTheme(themeData, index)

    for (const chapitre of themeData.chapitres) {
      for (const fond of chapitre.fonds) {
        console.log(`  Fond: ${fond.title}`)
        await migrateFond(fond, chapitre.name, themeDocumentId)
      }
    }
  }

  console.log('Migration terminée.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

Notes:
- `createOrReplace` with deterministic ids (`theme-<slug>`, `fond-<id>`)
  makes the script idempotent — re-running it after fixing a bug overwrites
  the same documents instead of duplicating them.
- Video handling: only `fond.videoUrl` values that are already `http(s)`
  URLs (YouTube links) are migrated directly. The one fond with a *local*
  video file (`ecurie-chevres`, `videoUrl:
  "/fonds/patrimoine-bati/ecurie-chevres-inauguration.mp4"`) is **not**
  uploaded as a video asset by this script — Sanity's `file` asset type
  works for this (same upload mechanism as documents/audio), but wiring a
  video file into the `videoUrl` string field doesn't apply since that
  field expects a URL, not an asset reference. Handle this one fond
  manually after migration: upload
  `aencrage/public/fonds/patrimoine-bati/ecurie-chevres-inauguration.mp4`
  through the Studio's `fond` document editor (there's no dedicated
  video-file field — attach it via `documents` with a clear title such as
  "Vidéo d'inauguration (MP4)" as a pragmatic fallback, since this is a
  single one-off piece of content, not worth a new schema field for one
  item).

- [ ] **Step 2: Get a write-enabled Sanity API token**

In the Sanity dashboard (sanity.io/manage) for project `dhukk50e` → API →
Tokens → add a new token with "Editor" or "Write" permissions. Copy it —
this is the last time it's shown.

- [ ] **Step 3: Run the script — confirm with the user before this step**

```bash
cd studio-aencrage
SANITY_MIGRATION_TOKEN=<paste-token> npx tsx scripts/migrate-fonds-themes.ts
```

(`tsx` isn't currently a dependency — if `npx tsx` fails to resolve, install
it on the fly with `npx --yes tsx scripts/migrate-fonds-themes.ts`; no
change to `package.json` is needed since `npx --yes` doesn't persist it.)

Expected: console output listing each thématique/fond as it's created, no
errors, ending with "Migration terminée.".

- [ ] **Step 4: Manual verification in the Studio**

Open "Thématiques" — confirm 11 entries with correct names and chapitre
lists. Open "Fonds archivés" — confirm one entry per fond from
`fondsThemes.ts` (count them: alpage/fusion-alpages-1957,
fetes/premiere-communion-1973, quotidien/banc-ane,
societes/clairon-des-alpes, nature/panoramas-mont-noble-2019,
patrimoine-bati/ecurie-chevres, patrimoine-bati/eglise-1910,
patrimoine-bati/eglise-projet-1978, contes-legendes/patte-de-lours,
communes/fusion-communes-mont-noble, portraits/portrait-werner-stappung,
portraits/presse-otto-ossent, economie/memoire-pidoux-1991 — 13 fonds).
Open a few individually: check `content` renders as proper paragraphs (not
one giant block), check links in `content` are clickable in the Studio's
Portable Text editor, check `couverture`/`gallery` images loaded, check PDF
`documents` download correctly, check the `werner-stappung` fond's audio
file plays. Manually attach the `ecurie-chevres` video file as described
in Step 1's note.

- [ ] **Step 5: Commit the script**

```bash
cd studio-aencrage
git add scripts/migrate-fonds-themes.ts
git commit -m "chore: add one-off fondsThemes.ts to Sanity migration script"
```

(Commit the script itself for the record — never commit the write token
from Step 2, and there is nothing else to commit here since Step 3's
effect lives in the `production` dataset, not in the working tree.)

---

## Task 7: Sanity queries + `Fond` type extension

**Files:**
- Modify: `aencrage/lib/sanity/queries.ts`
- Modify: `aencrage/lib/fondsThemes.ts`

**Interfaces:**
- Produces: `THEMES_QUERY` (list of `{_id, title, slug, ordre}`),
  `THEME_BY_SLUG_QUERY` (one theme with dereferenced `fonds`). `Fond` type
  gains an optional `content?: unknown[]` field. Task 8 (adapter) and Task
  12 (`FondModal`) consume these.

- [ ] **Step 1: Add the queries**

Append to `aencrage/lib/sanity/queries.ts`:

```ts
export const THEMES_QUERY = defineQuery(`
  *[_type == "theme"] | order(ordre asc) {
    _id,
    title,
    "slug": slug.current,
    ordre
  }
`);

export const THEME_BY_SLUG_QUERY = defineQuery(`
  *[_type == "theme" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    intro,
    chapitres[]{ id, name },
    "fonds": *[_type == "fond" && references(^._id)]{
      _id,
      title,
      typeFond,
      donateur,
      chapo,
      chapitre,
      dates,
      videoUrl,
      couverture{
        ...,
        "asset": asset->
      },
      content[]{
        ...,
        _type == "image" => {
          ...,
          "asset": asset->
        }
      },
      gallery[]{
        _key,
        alt,
        "asset": asset->
      },
      documents[]{
        _key,
        title,
        "asset": asset->
      },
      audioFiles[]{
        _key,
        title,
        duree,
        "asset": asset->
      }
    }
  }
`);
```

- [ ] **Step 2: Extend the `Fond` type**

Edit `aencrage/lib/fondsThemes.ts`, add one optional field to the existing
`Fond` type (do not remove `fullText` — the hardcoded `_themes` array below
still uses it and must keep type-checking):

```ts
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
```

- [ ] **Step 3: Verify the project still type-checks**

Run: `cd aencrage && npx tsc --noEmit`
Expected: no new errors (the hardcoded `_themes` array is unaffected since
`content` is optional and additive).

- [ ] **Step 4: Commit**

```bash
git add lib/sanity/queries.ts lib/fondsThemes.ts
git commit -m "feat: add Sanity queries and content field for theme-driven fonds"
```

---

## Task 8: `lib/sanity/adapters.ts` + tests

**Files:**
- Create: `aencrage/lib/sanity/adapters.ts`
- Test: `aencrage/lib/sanity/adapters.test.ts`

**Interfaces:**
- Consumes: `Fond`, `Chapitre`, `ThemePage` types from
  `aencrage/lib/fondsThemes.ts` (Task 7), `urlForImage` from
  `aencrage/lib/sanity/image.ts` (existing).
- Produces: `adaptTheme(raw: SanityTheme): ThemePage`, plus the exported
  `SanityTheme`/`SanityFond` input types. Task 9 (theme page) imports
  `adaptTheme`. Tasks 10 (nav header) and 11 (sitemap) only need
  `{slug, title}` pairs from `THEMES_QUERY` directly and map them inline
  without going through this adapter — there's no `adaptThemeSummary`
  function.

- [ ] **Step 1: Write the failing tests**

```ts
// aencrage/lib/sanity/adapters.test.ts
import {test} from 'node:test'
import assert from 'node:assert/strict'
import {adaptTheme} from './adapters'

test('groups fonds into their matching chapitre by name', () => {
  const result = adaptTheme({
    _id: 't1',
    title: 'La vie à l\'alpage',
    slug: 'alpage',
    intro: 'Intro',
    chapitres: [
      {id: 'inalpe', name: 'L\'inalpe'},
      {id: 'autres', name: 'Autres'},
    ],
    fonds: [
      {
        _id: 'f1',
        title: 'Fond 1',
        chapitre: 'Autres',
        typeFond: ['Écrit'],
        chapo: 'Résumé',
      },
    ],
  })

  assert.equal(result.slug, 'alpage')
  assert.equal(result.chapitres.length, 2)
  assert.equal(result.chapitres[0].fonds.length, 0)
  assert.equal(result.chapitres[1].fonds.length, 1)
  assert.equal(result.chapitres[1].fonds[0].id, 'f1')
})

test('creates a fallback chapitre for an unmatched chapitre name', () => {
  const result = adaptTheme({
    _id: 't1',
    title: 'Thème',
    slug: 'theme',
    chapitres: [{id: 'connu', name: 'Connu'}],
    fonds: [
      {_id: 'f1', title: 'Fond', chapitre: 'Faute de frappe', typeFond: ['Écrit']},
    ],
  })

  assert.equal(result.chapitres.length, 2)
  const fallback = result.chapitres.find((c) => c.name === 'Faute de frappe')
  assert.ok(fallback)
  assert.equal(fallback?.fonds.length, 1)
})

test('maps the first typeFond value to the lowercase type union', () => {
  const result = adaptTheme({
    _id: 't1',
    title: 'Thème',
    slug: 'theme',
    chapitres: [{id: 'c', name: 'C'}],
    fonds: [{_id: 'f1', title: 'Fond', chapitre: 'C', typeFond: ['Vidéo', 'Photo']}],
  })

  assert.equal(result.chapitres[0].fonds[0].type, 'video')
})

test('picks the first playable audio file as audioSrc and drops audioPeaks', () => {
  const result = adaptTheme({
    _id: 't1',
    title: 'Thème',
    slug: 'theme',
    chapitres: [{id: 'c', name: 'C'}],
    fonds: [
      {
        _id: 'f1',
        title: 'Fond',
        chapitre: 'C',
        typeFond: ['Son'],
        audioFiles: [{_key: 'a', title: 'Piste', asset: {url: 'https://cdn.example/a.mp3'}}],
      },
    ],
  })

  assert.equal(result.chapitres[0].fonds[0].audioSrc, 'https://cdn.example/a.mp3')
  assert.equal(result.chapitres[0].fonds[0].audioPeaks, undefined)
})

test('returns an empty chapitre list when the theme has none', () => {
  const result = adaptTheme({_id: 't1', title: 'Thème', slug: 'theme', fonds: []})
  assert.deepEqual(result.chapitres, [])
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd aencrage && node --test lib/sanity/adapters.test.ts`
Expected: FAIL — `Cannot find module './adapters'`.

- [ ] **Step 3: Write the implementation**

```ts
// aencrage/lib/sanity/adapters.ts
import { urlForImage } from "./image";
import type { Fond, Chapitre, ThemePage } from "@/lib/fondsThemes";

type SanityAsset = { url?: string; originalFilename?: string };
type SanityImageRef = { alt?: string; asset?: SanityAsset };
type SanityFileRef = { _key: string; title?: string; asset?: SanityAsset };
type SanityAudioRef = {
  _key: string;
  title?: string;
  duree?: string;
  asset?: SanityAsset;
};

export type SanityFond = {
  _id: string;
  title: string;
  typeFond?: string[];
  donateur?: string;
  chapo?: string;
  chapitre?: string;
  dates?: string;
  videoUrl?: string;
  couverture?: SanityImageRef;
  content?: unknown[];
  gallery?: (SanityImageRef & { _key: string })[];
  documents?: SanityFileRef[];
  audioFiles?: SanityAudioRef[];
};

export type SanityTheme = {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  chapitres?: { id: string; name: string }[];
  fonds?: SanityFond[];
};

const TYPE_MAP: Record<string, Fond["type"]> = {
  "Photo": "photo",
  "Écrit": "ecrit",
  "Son": "son",
  "Vidéo": "video",
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // strip diacritics left by NFD normalization
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function adaptFond(raw: SanityFond): Fond {
  const images = (raw.gallery ?? [])
    .filter((photo) => photo.asset?.url)
    .map((photo) =>
      urlForImage(photo).width(1200).fit("max").auto("format").url(),
    );

  const audio = (raw.audioFiles ?? []).find((a) => a.asset?.url);

  return {
    id: raw._id,
    title: raw.title,
    desc: raw.chapo ?? "",
    content: raw.content,
    dates: raw.dates ?? "",
    provenance: raw.donateur ?? "",
    type: TYPE_MAP[raw.typeFond?.[0] ?? "Écrit"] ?? "ecrit",
    images: images.length > 0 ? images : undefined,
    videoUrl: raw.videoUrl,
    documents: (raw.documents ?? [])
      .filter((doc) => doc.asset?.url)
      .map((doc) => ({
        label: doc.title || doc.asset!.originalFilename || "Document",
        url: doc.asset!.url!,
      })),
    audioSrc: audio?.asset?.url,
  };
}

export function adaptTheme(raw: SanityTheme): ThemePage {
  const byChapitre = new Map<string, Fond[]>();
  for (const rawFond of raw.fonds ?? []) {
    const key = rawFond.chapitre?.trim() || "Autres";
    const list = byChapitre.get(key) ?? [];
    list.push(adaptFond(rawFond));
    byChapitre.set(key, list);
  }

  const knownNames = new Set((raw.chapitres ?? []).map((c) => c.name));
  const chapitres: Chapitre[] = (raw.chapitres ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    fonds: byChapitre.get(c.name) ?? [],
  }));

  for (const [name, fonds] of byChapitre) {
    if (!knownNames.has(name)) {
      chapitres.push({ id: slugify(name), name, fonds });
    }
  }

  return {
    slug: raw.slug,
    name: raw.title,
    intro: raw.intro ?? "",
    chapitres,
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd aencrage && node --test lib/sanity/adapters.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/sanity/adapters.ts lib/sanity/adapters.test.ts
git commit -m "feat: add adapter mapping Sanity theme/fond documents to ThemePage"
```

---

## Task 9: Switch `/fonds/[theme]` to Sanity data

**Files:**
- Modify: `aencrage/app/fonds/[theme]/page.tsx`

**Interfaces:**
- Consumes: `THEMES_QUERY`, `THEME_BY_SLUG_QUERY` (Task 7), `adaptTheme`
  (Task 8), `client` from `aencrage/lib/sanity/client.ts` (existing).

- [ ] **Step 1: Rewrite the page**

```tsx
// aencrage/app/fonds/[theme]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { THEMES_QUERY, THEME_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { adaptTheme } from "@/lib/sanity/adapters";
import ThemeHero from "@/components/ThemeHero";
import ThemePageBody from "@/components/ThemePageBody";

const SITE_URL = "https://www.fondationaencrage.ch";
const options = { next: { revalidate: 60 } };

export async function generateStaticParams() {
  const themes = await client.fetch(THEMES_QUERY, {}, options);
  return themes.map((t: { slug: string }) => ({ theme: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme: slug } = await params;
  const raw = await client.fetch(THEME_BY_SLUG_QUERY, { slug }, options);
  if (!raw) return {};

  const theme = adaptTheme(raw);
  const canonical = `/fonds/${theme.slug}`;

  return {
    title: theme.name,
    description: theme.intro,
    alternates: {
      canonical,
    },
    openGraph: {
      title: theme.name,
      description: theme.intro,
      url: canonical,
    },
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: slug } = await params;
  const raw = await client.fetch(THEME_BY_SLUG_QUERY, { slug }, options);
  if (!raw) notFound();

  const theme = adaptTheme(raw);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Thématiques",
        item: `${SITE_URL}/fonds`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: theme.name,
        item: `${SITE_URL}/fonds/${theme.slug}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ThemeHero theme={theme} />
      <ThemePageBody theme={theme} />
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

After Task 6's migration has run, run: `cd aencrage && npm run dev`
Visit `http://localhost:3000/fonds/alpage` (or another migrated slug),
compare against the previous static rendering (check the git history of
this file, or a deployed prod URL, side-by-side): title, intro, chapitre
sections, fond cards, fond modal content (click a fond card), gallery,
documents, audio all render correctly.

- [ ] **Step 3: Commit**

```bash
git add app/fonds/\[theme\]/page.tsx
git commit -m "feat: fetch theme pages from Sanity instead of the static fondsThemes.ts data"
```

---

## Task 10: Nav header themes from Sanity

**Files:**
- Modify: `aencrage/app/layout.tsx`
- Modify: `aencrage/components/NavHeader.tsx`

**Interfaces:**
- Consumes: `THEMES_QUERY` (Task 7), `client` (existing).
- Produces: `NavHeader` now takes a `themes: {slug: string; name:
  string}[]` prop instead of importing the static array.

- [ ] **Step 1: Fetch themes in the layout and pass them down**

Edit `aencrage/app/layout.tsx`: make `RootLayout` async, fetch themes,
pass as a prop.

```tsx
import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavHeader from "@/components/NavHeader";
import DeposerSection from "@/components/DeposerSection";
import { client } from "@/lib/sanity/client";
import { THEMES_QUERY } from "@/lib/sanity/queries";

// ...(fonts, metadata, organizationJsonLd unchanged)...

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawThemes = await client.fetch(THEMES_QUERY, {}, { next: { revalidate: 60 } });
  const navThemes = rawThemes.map((t: { slug: string; title: string }) => ({
    slug: t.slug,
    name: t.title,
  }));

  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NavHeader themes={navThemes} />
        {children}
        <DeposerSection />
      </body>
    </html>
  );
}
```

(Keep every other part of the file — fonts, `metadata`, `organizationJsonLd`
— exactly as they are today; only the `themes` import/`RootLayout` function
change.)

- [ ] **Step 2: Update `NavHeader` to accept the prop**

Edit `aencrage/components/NavHeader.tsx`:

```tsx
// remove: import { themes } from "@/lib/fondsThemes";
```

Add a prop type and parameter (find the component's function signature,
likely `export default function NavHeader() {`):

```tsx
type NavTheme = { slug: string; name: string };

export default function NavHeader({ themes }: { themes: NavTheme[] }) {
```

The two lookups at lines ~160 and ~209 (`themes.find((th) => th.slug ===
slug)`) keep working unchanged since `themes` is now a prop instead of a
module-level import — no other line in the file references the import
directly.

- [ ] **Step 3: Verify manually**

Run: `cd aencrage && npm run dev`
Open the site, open the "Thématiques" nav dropdown (desktop and mobile),
confirm all theme names/links still resolve correctly and route to
`/fonds/[slug]`.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/NavHeader.tsx
git commit -m "feat: source nav header thematiques from Sanity via a server-fetched prop"
```

---

## Task 11: Sitemap themes from Sanity

**Files:**
- Modify: `aencrage/app/sitemap.ts`

**Interfaces:**
- Consumes: `THEMES_QUERY` (Task 7), `client` (existing).

- [ ] **Step 1: Make the sitemap async and Sanity-sourced**

```ts
import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { THEMES_QUERY } from "@/lib/sanity/queries";

const SITE_URL = "https://www.fondationaencrage.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fond-du-mois`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/deposer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/soutenir`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const rawThemes: { slug: string }[] = await client.fetch(
    THEMES_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  const themeRoutes: MetadataRoute.Sitemap = rawThemes.map((theme) => ({
    url: `${SITE_URL}/fonds/${theme.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...themeRoutes];
}
```

- [ ] **Step 2: Verify manually**

Run: `cd aencrage && npm run dev`
Visit `http://localhost:3000/sitemap.xml`, confirm it lists a `<url>` entry
for every migrated theme slug alongside the static routes.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: generate sitemap theme routes from Sanity"
```

---

## Task 12: Render Portable Text content in `FondModal`

**Files:**
- Modify: `aencrage/components/FondModal.tsx`

**Interfaces:**
- Consumes: `Fond.content` (Task 7), `PortableTextContent` from
  `aencrage/components/sanity/PortableTextContent.tsx` (existing,
  unmodified).

- [ ] **Step 1: Import `PortableTextContent`**

Near the top of `aencrage/components/FondModal.tsx`, alongside the other
imports:

```tsx
import { PortableTextContent } from "@/components/sanity/PortableTextContent";
```

- [ ] **Step 2: Prefer `content` over `fullText`/`desc` when present**

Replace the block at (currently) line 921-929:

```tsx
{(fond.fullText ?? fond.desc).split(/\n\n+/).map((paragraph, i) => (
  <p
    key={i}
    className="font-body text-secondaire mb-4 last:mb-6"
    style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-line" }}
  >
    {renderTextWithLinks(paragraph)}
  </p>
))}
```

with:

```tsx
{Array.isArray(fond.content) && fond.content.length > 0 ? (
  <div className="mb-4 last:mb-6 [&_p]:font-body [&_p]:text-secondaire [&_p]:text-[15px] [&_p]:leading-[1.6]">
    <PortableTextContent value={fond.content} />
  </div>
) : (
  (fond.fullText ?? fond.desc).split(/\n\n+/).map((paragraph, i) => (
    <p
      key={i}
      className="font-body text-secondaire mb-4 last:mb-6"
      style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-line" }}
    >
      {renderTextWithLinks(paragraph)}
    </p>
  ))
)}
```

`PortableTextContent` already renders its own `<p>`/`<h2>`/`<h3>` tags with
their own font/size classes (see
`aencrage/components/sanity/PortableTextContent.tsx`); the wrapping
`[&_p]:...` utility classes only nudge the paragraph size/color to match
this modal's existing look (15px `text-secondaire`) instead of that
component's default 17px body style, without needing a second styled
variant of `PortableTextContent`.

- [ ] **Step 3: Verify manually**

Run: `cd aencrage && npm run dev`
Open `/fonds/alpage` (or any migrated theme), click a fond card that has
`content` (all migrated fonds will, since Task 6's script always populates
it) — confirm the modal shows properly formatted paragraphs and that any
links inside are clickable.

- [ ] **Step 4: Commit**

```bash
git add components/FondModal.tsx
git commit -m "feat: render Portable Text content in the fond modal when present"
```

---

## Task 13: On-demand revalidation webhook

**Files:**
- Create: `aencrage/app/api/revalidate/route.ts`

**Interfaces:**
- Consumes: `parseBody` from `next-sanity/webhook` (existing dependency,
  verified present at `node_modules/next-sanity/dist/webhook/index.js`).

- [ ] **Step 1: Write the route**

```ts
// aencrage/app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  path?: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        "Missing environment variable SANITY_REVALIDATE_SECRET",
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    );

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ message: "Invalid signature" }),
        { status: 401 },
      );
    }

    if (!body?.path) {
      return new Response(JSON.stringify({ message: "Bad Request", body }), {
        status: 400,
      });
    }

    revalidatePath(body.path);
    return NextResponse.json({ revalidated: true, path: body.path });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}
```

- [ ] **Step 2: Document the required env var**

Check whether `aencrage/.env.local.example` (or similar) exists:

Run: `cd aencrage && ls .env*`

If an example env file exists, add a line `SANITY_REVALIDATE_SECRET=` to
it with a comment. If none exists, skip this step — don't invent a new
convention the project doesn't already have.

- [ ] **Step 3: Configure the webhook in the Sanity dashboard (manual, user-performed)**

This step can't be scripted — it's a dashboard configuration action on the
user's Sanity project, and it requires generating and storing a production
secret. Walk the user through it rather than doing it for them:

1. Generate a random secret (e.g. `openssl rand -hex 32`), set it as
   `SANITY_REVALIDATE_SECRET` in the Next.js hosting provider's env vars
   (and in a local `.env.local` for testing) — **do not commit this value**.
2. In sanity.io/manage → project `dhukk50e` → API → Webhooks → create one:
   - URL: `https://<production-domain>/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["theme", "fond", "fondDuMois"]`
   - Projection:
     ```groq
     {
       "path": select(
         _type == "theme" => "/fonds/" + slug.current,
         _type == "fond" => "/fonds/" + theme->slug.current,
         _type == "fondDuMois" => "/fond-du-mois",
         null
       )
     }
     ```
   - Secret: the same value as `SANITY_REVALIDATE_SECRET`.

- [ ] **Step 4: Verify locally**

With `SANITY_REVALIDATE_SECRET` set in `.env.local` and `npm run dev`
running, compute a valid HMAC-SHA256 signature is impractical to do by
hand — instead verify the *unauthenticated* rejection path, which is what
matters most for correctness:

Run:
```bash
curl -i -X POST http://localhost:3000/api/revalidate -d '{"path":"/fonds/alpage"}'
```
Expected: `HTTP/1.1 401` with an "Invalid signature" body (proves the route
is not accepting unsigned requests). Full end-to-end verification (a real
Sanity-signed request) happens naturally the first time the user edits a
`theme`/`fond`/`fondDuMois` document in the deployed Studio after Step 3 is
configured — confirm with the user that the corresponding page updates
within a few seconds of publishing, without a redeploy.

- [ ] **Step 5: Commit**

```bash
git add app/api/revalidate/route.ts
git commit -m "feat: add Sanity webhook route for on-demand ISR revalidation"
```

---

## Post-plan notes for the user

- `studio-aencrage/` was git-initialized at execution setup time (own repo,
  own `master` branch, no worktree isolation — commits there land directly)
  so the new schemas/action are versioned. Unlike `aencrage/`, this repo has
  no remote and no isolation branch; review its `git log` directly when
  checking this feature's Studio-side history.
- Task 6's migration script is the one genuinely irreversible step in this
  plan (writes real content to the production dataset). Confirm before
  running it, and keep the write token out of shell history / committed
  files.
