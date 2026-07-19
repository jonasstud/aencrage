"use client"

import FondCard from "@/components/FondCard"
import type { Chapitre, Fond } from "@/lib/fondsThemes"

type Props = {
  chapitre: Chapitre
  index: number
  onOpen: (fond: Fond) => void
}

export default function ChapitreSection({ chapitre, index, onOpen }: Props) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <section id={`chapitre-${chapitre.id}`}>
      <div className="flex items-baseline gap-4 border-b border-encre pb-5 mb-8">
        <span className="font-mono text-[13px] text-laiton tracking-[0.1em]">{num}</span>
        <h2 className="font-display text-[32px] leading-[1.1] text-encre">{chapitre.name}</h2>
      </div>

      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {chapitre.fonds.map(fond => (
          <FondCard key={fond.id} fond={fond} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
