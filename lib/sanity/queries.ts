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
