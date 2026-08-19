import HeroSection from "@/components/HeroSection";
import BandeauSection from "@/components/BandeauSection";
import FondationSection from "@/components/FondationSection";
import ValorisationSection from "@/components/ValorisationSection";
import EnEvidenceSection from "@/components/EnEvidenceSection";

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
