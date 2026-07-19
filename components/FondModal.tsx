"use client"

import { useEffect } from "react"
import { FondTypeIcon, TYPE_LABELS } from "@/components/FondIcons"
import type { Fond } from "@/lib/fondsThemes"

type Props = {
  fond: Fond | null
  chapitreName: string
  onClose: () => void
}

export default function FondModal({ fond, chapitreName, onClose }: Props) {
  useEffect(() => {
    if (!fond) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [fond, onClose])

  if (!fond) return null

  const hasImage = fond.type === 'photo'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(19,20,23,0.75)' }}
      onClick={onClose}
    >
      <div
        className={`bg-papier w-full overflow-y-auto ${hasImage ? 'max-w-[760px]' : 'max-w-[600px]'}`}
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {hasImage ? (
          <div className="grid grid-cols-[1fr_1.1fr]">
            <div
              className="bg-placeholder min-w-0"
              style={{
                minHeight: 400,
                clipPath:
                  'polygon(0 0, 100% 0, 100% 100%, 80px 100%, 0 calc(100% - 35px))',
              }}
              aria-hidden="true"
            />
            <div className="p-10 relative">
              <CloseButton onClose={onClose} />
              <ModalContent fond={fond} chapitreName={chapitreName} />
            </div>
          </div>
        ) : (
          <div className="p-10 relative">
            <CloseButton onClose={onClose} />
            <ModalContent fond={fond} chapitreName={chapitreName} />
          </div>
        )}
      </div>
    </div>
  )
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 font-mono text-[13px] text-gris hover:text-encre transition-colors duration-200"
      aria-label="Fermer"
    >
      ✕
    </button>
  )
}

function ModalContent({ fond, chapitreName }: { fond: Fond; chapitreName: string }) {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gris mb-1">
        {chapitreName} · {fond.dates}
      </p>
      <div className="flex items-center gap-1.5 mb-5">
        <FondTypeIcon type={fond.type} />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gris">
          {TYPE_LABELS[fond.type]}
        </span>
      </div>
      <h2 className="font-display text-[28px] leading-[1.15] text-encre mb-4">
        {fond.title}
      </h2>
      <p className="font-body text-[15px] leading-[1.6] text-secondaire mb-6">
        {fond.desc}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gris mb-1">
        Provenance
      </p>
      <p className="font-body text-[14px] text-secondaire">{fond.provenance}</p>
    </>
  )
}
