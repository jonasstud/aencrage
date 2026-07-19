import { notFound } from "next/navigation"
import { themes } from "@/lib/fondsThemes"
import ThemeHero from "@/components/ThemeHero"
import ThemePageBody from "@/components/ThemePageBody"
import ThemeFooter from "@/components/ThemeFooter"

export function generateStaticParams() {
  return themes.map(t => ({ theme: t.slug }))
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>
}) {
  const { theme: slug } = await params
  const theme = themes.find(t => t.slug === slug)
  if (!theme) notFound()

  return (
    <main>
      <ThemeHero theme={theme} />
      <ThemePageBody theme={theme} />
      <ThemeFooter />
    </main>
  )
}
