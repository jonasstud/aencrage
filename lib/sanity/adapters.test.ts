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
