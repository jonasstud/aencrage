import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import BandeauSection from "@/components/BandeauSection";
import FondationSection from "@/components/FondationSection";
import ValorisationSection from "@/components/ValorisationSection";
import EnEvidenceSection from "@/components/EnEvidenceSection";

export const metadata: Metadata = {
  title: "Fondation æncrage — Patrimoine oral & écrit de Mase",
  description:
    "La Fondation æncrage rassemble, conserve et met en valeur le patrimoine immatériel lié à la société masatte — écrits, archives, voix et portraits.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fondation æncrage — Patrimoine oral & écrit de Mase",
    description:
      "La Fondation æncrage rassemble, conserve et met en valeur le patrimoine immatériel lié à la société masatte — écrits, archives, voix et portraits.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main>
      <div className="flex flex-col md:h-[calc(100dvh-5rem)]">
        <HeroSection />
        <BandeauSection />
      </div>
      <FondationSection />
      <ValorisationSection />
      <EnEvidenceSection />
    </main>
  );
}
