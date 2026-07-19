export const TYPE_LABELS: Record<'photo' | 'ecrit' | 'son', string> = {
  photo: 'Photographie',
  ecrit: 'Document écrit',
  son: 'Enregistrement sonore',
}

export function PhotoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8A8F98" strokeWidth="1.6">
      <rect x="1" y="3" width="12" height="9" rx="0.5" />
      <circle cx="4.5" cy="5.5" r="1" />
      <polyline points="1,10 4,7 7,9 10,6 13,8" />
    </svg>
  )
}

export function EcritIcon() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" stroke="#8A8F98" strokeWidth="1.6">
      <path d="M2 1h7l2 2v10H2V1z" />
      <path d="M9 1v2h2" />
      <line x1="4" y1="6" x2="9" y2="6" />
      <line x1="4" y1="8.5" x2="9" y2="8.5" />
      <line x1="4" y1="11" x2="7" y2="11" />
    </svg>
  )
}

export function SonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8A8F98" strokeWidth="1.6">
      <line x1="2" y1="9" x2="2" y2="11" />
      <line x1="5" y1="6" x2="5" y2="11" />
      <line x1="8" y1="3" x2="8" y2="11" />
      <line x1="11" y1="5" x2="11" y2="11" />
      <line x1="14" y1="8" x2="14" y2="11" />
    </svg>
  )
}

export function FondTypeIcon({ type }: { type: 'photo' | 'ecrit' | 'son' }) {
  if (type === 'photo') return <PhotoIcon />
  if (type === 'son') return <SonIcon />
  return <EcritIcon />
}
