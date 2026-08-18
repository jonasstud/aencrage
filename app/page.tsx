import HeroSection from "@/components/HeroSection";
import BandeauSection from "@/components/BandeauSection";
import ActivitesSection from "@/components/ActivitesSection";
import ValorisationSection from "@/components/ValorisationSection";
import FondationSection from "@/components/FondationSection";
import DeposerSection from "@/components/DeposerSection";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col md:h-[calc(100dvh-5rem)]">
        <HeroSection />
        <BandeauSection />
      </div>
      <ActivitesSection />
      <ValorisationSection />
      <FondationSection />
      <DeposerSection />
    </main>
  );
}
