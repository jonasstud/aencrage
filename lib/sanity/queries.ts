import { defineQuery } from "next-sanity";

export const FOND_DU_MOIS_QUERY = defineQuery(`
  *[_id == "fondDuMois"][0]{
    _id,
    title,
    annee,
    typeFond,
    donateur,
    chapo,
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
`);

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
    "fonds": *[_type == "fond" && references(^._id)] | order(_createdAt desc) {
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
        "asset": asset->,
        "extension": asset->extension
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
        "asset": asset->,
        "extension": asset->extension
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
