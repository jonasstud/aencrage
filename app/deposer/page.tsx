import type { Metadata } from "next";
import DeposerPage from "@/components/DeposerPage";

export const metadata: Metadata = {
  title: "Dépôt d'un fonds — Fondation æncrage",
};

export default function Page() {
  return <DeposerPage />;
}
