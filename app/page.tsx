import NavHeader from '@/components/NavHeader'
import HeroSection from '@/components/HeroSection'
import BandeauSection from '@/components/BandeauSection'
import ActivitesSection from '@/components/ActivitesSection'

export default function Home() {
  return (
    <main>
      <NavHeader />
      <HeroSection />
      <BandeauSection />
      <ActivitesSection />
    </main>
  )
}
