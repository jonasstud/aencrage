"use client";

import { useState, useEffect } from "react";
import ThemeSummary from "@/components/ThemeSummary";
import ChapitreSection from "@/components/ChapitreSection";
import FondModal from "@/components/FondModal";
import type { Fond, ThemePage } from "@/lib/fondsThemes";

export default function ThemePageBody({ theme }: { theme: ThemePage }) {
  const [selectedFond, setSelectedFond] = useState<Fond | null>(null);
  const [selectedChapitreName, setSelectedChapitreName] = useState("");
  const [activeId, setActiveId] = useState<string>(theme.chapitres[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("m-chapitre-", ""));
          }
        });
      },
      { rootMargin: "-110px 0px -70% 0px" },
    );

    theme.chapitres.forEach((c) => {
      const el = document.getElementById(`m-chapitre-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [theme.chapitres]);

  const scrollToMobile = (id: string) => {
    const el = document.getElementById(`m-chapitre-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleOpen = (fond: Fond) => {
    const chapitre = theme.chapitres.find((c) =>
      c.fonds.some((f) => f.id === fond.id),
    );
    setSelectedChapitreName(chapitre?.name ?? "");
    setSelectedFond(fond);
  };

  return (
    <>
      <div className="px-6 md:px-14 pb-30 max-w-350 mx-auto">
        {/* Desktop: sommaire + chapitres */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: "220px 1fr", gap: "64px" }}
        >
          <ThemeSummary chapitres={theme.chapitres} />
          <div className="flex flex-col" style={{ gap: "96px" }}>
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

        {/* Mobile: sommaire horizontal + chapitres */}
        <div className="md:hidden">
          <div className="relative mb-8">
            <nav
              className="overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none"
              aria-label="Sommaire"
            >
              <ul className="list-none m-0 p-0 flex flex-row gap-2 whitespace-nowrap">
                {theme.chapitres.map((c, i) => {
                  const isActive = activeId === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => scrollToMobile(c.id)}
                        className={`inline-flex flex-col px-3 py-2 text-[13px] border transition-all duration-200 cursor-pointer min-h-11 ${
                          isActive
                            ? "border-encre bg-placeholder text-encre font-semibold"
                            : "border-gris/30 text-secondaire font-normal hover:bg-velin"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-gris font-normal">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {c.name}
                        </span>
                        <span className="font-mono text-[10px] text-gris font-normal">
                          {c.fonds.length} fonds
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li aria-hidden="true" className="shrink-0 w-10" />
              </ul>
            </nav>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-papier to-transparent" />
          </div>

          <div className="flex flex-col" style={{ gap: "64px" }}>
            {theme.chapitres.map((chapitre, i) => (
              <ChapitreSection
                key={chapitre.id}
                chapitre={chapitre}
                index={i}
                onOpen={handleOpen}
                idPrefix="m-"
              />
            ))}
          </div>
        </div>
      </div>

      <FondModal
        fond={selectedFond}
        chapitreName={selectedChapitreName}
        onClose={() => setSelectedFond(null)}
      />
    </>
  );
}
