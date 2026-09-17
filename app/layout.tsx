import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavHeader from "@/components/NavHeader";
import DeposerSection from "@/components/DeposerSection";
import { client } from "@/lib/sanity/client";
import { THEMES_QUERY } from "@/lib/sanity/queries";

const newsreader = Newsreader({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const SITE_URL = "https://www.fondationaencrage.ch";
const SITE_NAME = "Fondation æncrage";
const SITE_DESCRIPTION =
  "La Fondation æncrage rassemble, conserve et met en valeur le patrimoine immatériel lié à la société masatte — écrits, archives, voix et portraits.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s — ${SITE_NAME}`,
    default: `${SITE_NAME} — Patrimoine oral & écrit de Mase`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fr_CH",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_NAME,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/aencrage-logo.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Place de la Tsena 5",
        postalCode: "1968",
        addressLocality: "Mase",
        addressCountry: "CH",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "fondationaencrage@gmail.com",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "fr-CH",
    },
  ],
};

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
