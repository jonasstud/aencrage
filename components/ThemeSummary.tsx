"use client";

import { useState, useEffect } from "react";
import type { Chapitre } from "@/lib/fondsThemes";

export default function ThemeSummary({ chapitres }: { chapitres: Chapitre[] }) {
  const [activeId, setActiveId] = useState<string>(chapitres[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("chapitre-", ""));
          }
        });
      },
      { rootMargin: "-110px 0px -70% 0px" },
    );

    chapitres.forEach((c) => {
      const el = document.getElementById(`chapitre-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapitres]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`chapitre-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-24 pt-5 self-start" aria-label="Sommaire">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gris mb-4">
        Sommaire
      </p>
      <ul className="list-none m-0 p-0 flex flex-col gap-1 border border-gris/20">
        {chapitres.map((c, i) => {
          const isActive = activeId === c.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => scrollTo(c.id)}
                className={`w-full text-left pl-3 py-1.5 border-l-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-plume text-secondaire bg-placeholder font-semibold hover:bg-texte-clair-2"
                    : "border-transparent text-secondaire font-normal hover:bg-velin"
                }`}
              >
                <span>
                  <span className="font-mono text-[12px] text-gris mr-2 font-normal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px]">{c.name}</span>
                </span>
                <span className="block font-mono text-[11px] text-gris pl-5.5 font-normal">
                  {c.fonds.length} fonds
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
