import { defineQuery } from "next-sanity";

export const ACTIVITE_QUERY = defineQuery(`
  *[_id == "activite"][0]{
    _id,
    title,
    date,
    horaires,
    lieu,
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
