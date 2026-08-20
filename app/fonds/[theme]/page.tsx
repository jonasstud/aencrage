import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { themes } from "@/lib/fondsThemes";
import ThemeHero from "@/components/ThemeHero";
import ThemePageBody from "@/components/ThemePageBody";

const SITE_URL = "https://www.fondationaencrage.ch";

export function generateStaticParams() {
  return themes.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme: slug } = await params;
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) return {};

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
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) notFound();

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
