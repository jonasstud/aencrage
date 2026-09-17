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
