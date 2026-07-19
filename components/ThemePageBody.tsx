"use client"

import { useState } from "react"
import ThemeSummary from "@/components/ThemeSummary"
import ChapitreSection from "@/components/ChapitreSection"
import FondModal from "@/components/FondModal"
import type { Fond, ThemePage } from "@/lib/fondsThemes"

export default function ThemePageBody({ theme }: { theme: ThemePage }) {
  const [selectedFond, setSelectedFond] = useState<Fond | null>(null)
  const [selectedChapitreName, setSelectedChapitreName] = useState('')

  const handleOpen = (fond: Fond) => {
    const chapitre = theme.chapitres.find(c => c.fonds.some(f => f.id === fond.id))
    setSelectedChapitreName(chapitre?.name ?? '')
    setSelectedFond(fond)
  }

  return (
    <>
      <div className="px-6 md:px-14 pb-[120px] max-w-[1400px] mx-auto">
        {/* Desktop: sommaire + chapitres */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: '220px 1fr', gap: '64px' }}
        >
          <ThemeSummary chapitres={theme.chapitres} />
          <div className="flex flex-col" style={{ gap: '96px' }}>
            {theme.chapitres.map((chapitre, i) => (
              <ChapitreSection
                key={chapitre.id}
                chapitre={chapitre}
                index={i}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>

        {/* Mobile: chapitres seulement, sans sommaire */}
        <div className="md:hidden flex flex-col" style={{ gap: '64px' }}>
          {theme.chapitres.map((chapitre, i) => (
            <ChapitreSection
              key={chapitre.id}
              chapitre={chapitre}
              index={i}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      <FondModal
        fond={selectedFond}
        chapitreName={selectedChapitreName}
        onClose={() => setSelectedFond(null)}
      />
    </>
  )
}
