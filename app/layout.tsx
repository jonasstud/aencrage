import type { Metadata } from 'next'
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import NavHeader from '@/components/NavHeader'

const newsreader = Newsreader({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fondation AEncrage — Patrimoine oral & écrit de Mase',
  description:
    'La Fondation AEncrage rassemble, conserve et met en valeur le patrimoine immatériel lié à la société masatte — écrits, archives, voix et portraits.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <NavHeader />
        {children}
      </body>
    </html>
  )
}
