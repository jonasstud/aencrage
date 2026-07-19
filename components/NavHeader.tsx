"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { themes } from "@/lib/fondsThemes";

const navLinks = [
  { label: "La Fondation", href: "#fondation-1a", hasDropdown: false },
  { label: "Activités", href: "#activites-1a", hasDropdown: true },
  { label: "Thématiques", href: "#thematiques-1a", hasDropdown: true },
  { label: "Fonds d'archives", href: "#deposer-1a", hasDropdown: true },
  { label: "Contact", href: "#contact-1a", hasDropdown: false },
];

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="border-b border-encre sticky top-0 z-50 bg-papier">
      {/* Desktop */}
      <div className="flex items-center justify-between px-6 md:px-14 py-5">
        <Link href="/">
          <Image
            src="/aencrage-logo.svg"
            alt="Fondation Æncrage"
            width={400}
            height={80}
            className="w-auto h-12"
          />
        </Link>
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(link.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-0.75 transition-[border-color] duration-200 hover:border-plume"
                >
                  {link.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      hoveredItem === link.href ? "rotate-180" : ""
                    }`}
                  />
                </a>
                <div
                  className={`absolute top-full left-0 pt-3 z-50 transition-opacity duration-150 ${
                    hoveredItem === link.href
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-papier border border-encre min-w-50 p-3">
                    {link.label === 'Thématiques' ? (
                      themes.map(t => (
                        <Link
                          key={t.slug}
                          href={`/fonds/${t.slug}`}
                          className={`font-mono text-[11px] font-medium tracking-[0.14em] uppercase no-underline hover:text-plume block py-2 px-3 transition-colors duration-200 ${
                            pathname === `/fonds/${t.slug}` ? 'text-plume' : 'text-encre'
                          }`}
                        >
                          {t.name}
                        </Link>
                      ))
                    ) : (
                      <a
                        href={link.href}
                        className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline hover:text-plume block py-2 px-3 transition-colors duration-200"
                      >
                        Vue générale →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline border-b border-transparent pb-0.75 transition-[border-color] duration-200 hover:border-plume"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.25 p-1"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${
              isOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-opacity duration-200 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-encre transition-transform duration-200 ${
              isOpen ? "-rotate-45 translate-y-[-6.5px]" : ""
            }`}
          />
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
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-6 py-4 border-b border-[rgba(19,20,23,0.1)] hover:bg-velin"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
