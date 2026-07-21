"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Users, Landmark, BookOpen, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { themes } from "@/lib/fondsThemes";

const navLinks = [
  { label: "La Fondation", href: "#fondation-1a", hasDropdown: false },
  { label: "Activités", href: "#activites-1a", hasDropdown: true },
  { label: "Thématiques", href: "#thematiques-1a", hasDropdown: true },
  { label: "Fonds d'archives", href: "#deposer-1a", hasDropdown: true },
  { label: "Contact", href: "#contact-1a", hasDropdown: false },
];

const thematiqueCategories: { label: string; icon: LucideIcon; slugs: string[] }[] = [
  { label: "Vie sociale", icon: Users, slugs: ["alpage", "quotidien", "societes", "economie"] },
  { label: "Patrimoine & territoire", icon: Landmark, slugs: ["patrimoine-bati", "communes", "nature"] },
  { label: "Culture & mémoire", icon: BookOpen, slugs: ["fetes", "fetes-populaires", "contes-legendes", "portraits"] },
];

// Hauteur fixe de la barre logo (py-5 + h-12 + border), utilisée pour caler
// le panneau mobile juste en dessous, quelle que soit la largeur d'écran.
const MOBILE_BAR_HEIGHT = 88;

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="border-b border-encre sticky top-0 z-50 bg-papier">
      {/* Desktop */}
      <div className="flex items-center justify-between px-6 md:px-14 py-5">
        <Link href="/">
          <Image
            src="/aencrage-logo.svg"
            alt="Fondation AEncrage"
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
                  aria-haspopup="true"
                  aria-expanded={hoveredItem === link.href}
                  onClick={(e) => {
                    if (hoveredItem !== link.href) {
                      e.preventDefault();
                      setHoveredItem(link.href);
                    }
                  }}
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
                  {link.label === 'Thématiques' ? (
                    <div className="bg-papier border border-gris/20 shadow-[0_14px_28px_rgba(20,30,40,0.10)] w-75 px-4.5 pt-3.5 pb-1.5">
                      {thematiqueCategories.map((cat, catIdx) => (
                        <div key={cat.label}>
                          <div
                            className={`flex items-center gap-1.5 mb-1.5 ${
                              catIdx !== 0 ? 'mt-2.5 pt-2.5 border-t border-gris/15' : ''
                            }`}
                          >
                            <cat.icon size={13} strokeWidth={1.4} className="text-gris shrink-0" />
                            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gris">
                              {cat.label}
                            </span>
                          </div>
                          {cat.slugs.map((slug) => {
                            const t = themes.find((th) => th.slug === slug);
                            if (!t) return null;
                            const isActive = pathname === `/fonds/${t.slug}`;
                            return (
                              <Link
                                key={t.slug}
                                href={`/fonds/${t.slug}`}
                                className={`font-body text-[12.5px] no-underline block transition-colors duration-150 ${
                                  isActive
                                    ? 'font-semibold text-secondaire bg-placeholder border-l-[3px] border-plume pl-2.25 pr-3 py-2 hover:bg-texte-clair-2'
                                    : 'font-normal text-encre px-3 py-2 hover:bg-velin cursor-pointer'
                                }`}
                              >
                                {t.name}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-papier border border-encre min-w-50 p-3">
                      <a
                        href={link.href}
                        className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre no-underline hover:text-plume block py-2 px-3 transition-colors duration-200"
                      >
                        Vue générale →
                      </a>
                    </div>
                  )}
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
          className="md:hidden flex flex-col gap-1.25 p-1 cursor-pointer"
          onClick={() => {
            setOpenMobileItem(null);
            setIsOpen((o) => !o);
          }}
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

      {/* Mobile menu: panneau plein écran, sous la barre logo, avec son propre scroll */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 bottom-0 bg-papier border-t border-encre overflow-y-auto overscroll-contain"
            style={{ top: MOBILE_BAR_HEIGHT }}
          >
            <div className="flex flex-col pb-[max(2rem,env(safe-area-inset-bottom))]">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href} className="border-b border-[rgba(19,20,23,0.1)]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileItem((cur) => (cur === link.href ? null : link.href))
                      }
                      aria-expanded={openMobileItem === link.href}
                      className="w-full flex items-center justify-between font-mono text-[12px] font-medium tracking-[0.14em] uppercase text-encre px-6 py-4.5 active:bg-velin"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          openMobileItem === link.href ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMobileItem === link.href && (
                      <div className="px-6 pb-5 bg-velin/40">
                        {link.label === "Thématiques" ? (
                          thematiqueCategories.map((cat, catIdx) => (
                            <div
                              key={cat.label}
                              className={
                                catIdx !== 0 ? "mt-4 pt-4 border-t border-gris/15" : ""
                              }
                            >
                              <div className="flex items-center gap-1.5 mb-2">
                                <cat.icon
                                  size={13}
                                  strokeWidth={1.4}
                                  className="text-gris shrink-0"
                                />
                                <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gris">
                                  {cat.label}
                                </span>
                              </div>
                              <div className="flex flex-col border-l border-gris/15 pl-3.5">
                                {cat.slugs.map((slug) => {
                                  const t = themes.find((th) => th.slug === slug);
                                  if (!t) return null;
                                  const isActive = pathname === `/fonds/${t.slug}`;
                                  return (
                                    <Link
                                      key={t.slug}
                                      href={`/fonds/${t.slug}`}
                                      onClick={() => {
                                        setOpenMobileItem(null);
                                        setIsOpen(false);
                                      }}
                                      className={`font-body text-[14px] no-underline block py-2.5 transition-colors duration-150 ${
                                        isActive
                                          ? "font-semibold text-secondaire"
                                          : "font-normal text-encre"
                                      }`}
                                    >
                                      {t.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <a
                            href={link.href}
                            onClick={() => {
                              setOpenMobileItem(null);
                              setIsOpen(false);
                            }}
                            className="font-mono text-[12px] font-medium tracking-[0.14em] uppercase text-encre no-underline block py-3"
                          >
                            Vue générale →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setOpenMobileItem(null);
                      setIsOpen(false);
                    }}
                    className="font-mono text-[12px] font-medium tracking-[0.14em] uppercase text-encre no-underline px-6 py-4.5 border-b border-[rgba(19,20,23,0.1)] active:bg-velin"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
