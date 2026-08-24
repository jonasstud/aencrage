import type { Metadata } from "next";
import SoutenirPage from "@/components/SoutenirPage";

export const metadata: Metadata = {
  title: "Soutenir la Fondation",
  description:
    "Soutenez les activités de la Fondation æncrage par virement bancaire ou par Twint.",
  alternates: { canonical: "/soutenir" },
  openGraph: {
    title: "Soutenir la Fondation",
    description:
      "Soutenez les activités de la Fondation æncrage par virement bancaire ou par Twint.",
    url: "/soutenir",
  },
};

export default function Page() {
  return <SoutenirPage />;
}
