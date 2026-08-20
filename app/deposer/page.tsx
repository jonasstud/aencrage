import type { Metadata } from "next";
import DeposerPage from "@/components/DeposerPage";

export const metadata: Metadata = {
  title: "Dépôt d'un fonds",
  description:
    "La Fondation æncrage accueille vos archives privées — correspondances, photographies, enregistrements — liées à Mase, sous forme de don, dépôt ou legs.",
  alternates: {
    canonical: "/deposer",
  },
  openGraph: {
    title: "Dépôt d'un fonds",
    description:
      "La Fondation æncrage accueille vos archives privées — correspondances, photographies, enregistrements — liées à Mase, sous forme de don, dépôt ou legs.",
    url: "/deposer",
  },
};

export default function Page() {
  return <DeposerPage />;
}
