'use client'

import { useState } from 'react'

const navLinks = [
  { label: 'La Fondation', href: '#fondation-1a' },
  { label: 'Activités',    href: '#activites-1a' },
  { label: 'Valorisation', href: '#valorisation-1a' },
  { label: 'Déposer',      href: '#deposer-1a' },
  { label: 'Contact',      href: '#contact-1a' },
]

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-encre">
      {/* Desktop */}
      <div className="flex items-center justify-between px-14 py-5">
        <div className="font-mono text-[13px] font-semibold tracking-[0.18em] uppercase text-encre">
          Fondation Æncrage
        </div>
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-[3px] transition-[border-color] duration-200 hover:border-plume"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-encre transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden flex flex-col border-t border-encre">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-14 py-4 border-b border-[rgba(19,20,23,0.1)] hover:bg-velin"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
