"use client";

import { useEffect, useRef, useState } from "react";
import { FileDown, FileText } from "lucide-react";

const sections = [
  { id: "presentation", num: "01", label: "Présentation" },
  { id: "formes", num: "02", label: "Formes de dépôt" },
  { id: "zones", num: "03", label: "Zones de description" },
  { id: "convention", num: "04", label: "Exemple de convention" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function scrollToSection(id: string) {
  const el = document.getElementById("sec-" + id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function DeposerPage() {
  const [activeId, setActiveId] = useState<SectionId>("presentation");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("sec-", "") as SectionId;
            setActiveId(id);
          }
        });
      },
      { rootMargin: "-110px 0px -70% 0px" },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById("sec-" + id);
      if (el) observerRef.current!.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero
          Fix #12: replace inline grid style with Tailwind responsive grid.
          Mobile: single column, stacked. lg+: two columns side-by-side.
          Fix #1 (padding): px-4 on mobile → px-8 on sm → px-14 on lg, matching ContactPage rhythm.
      */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 px-4 sm:px-8 lg:px-14 pt-10 sm:pt-14 lg:pt-16 pb-10 lg:pb-14 items-end">
        {/* Fix #13: image height scales with viewport instead of fixed 420px */}
        <div
          className="bg-placeholder w-full h-52 sm:h-72 lg:h-105"
          style={{
            minWidth: 0,
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
          }}
        />
        <div className="min-w-0">
          <div className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-5">
            Fonds d&apos;archives
          </div>
          {/* Fix #17: hero h1 scales from 28px on mobile to 48px on lg */}
          <h1 className="font-display font-normal text-encre m-0 mb-5 text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1]">
            Dépôt d&apos;un fonds
          </h1>
          <p className="font-body text-[16px] leading-[1.6] text-secondaire m-0 mb-5 max-w-xl">
            La Fondation accueille les archives privées en lien avec Mase, sous
            plusieurs formes et conditions détaillées ci-dessous.
          </p>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-gris">
            Don · Dépôt · Legs
          </div>
        </div>
      </section>

      {/* Body
          Fix #14: replace inline padding/maxWidth with Tailwind utilities.
          Fix #15: TOC sidebar hidden on mobile (appears as inline list), visible from lg.
      */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-14 pb-24 lg:pb-30 max-w-350">

        {/* Mobile-only TOC: flat horizontal pill list, hidden on lg+ */}
        <div className="relative lg:hidden mb-8">
          <nav
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none"
            aria-label="Sommaire"
          >
            <ul className="list-none m-0 p-0 flex flex-row gap-2 whitespace-nowrap">
              {sections.map(({ id, num, label }) => {
                const isActive = activeId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-[13px] border transition-all duration-200 cursor-pointer min-h-11 ${
                        isActive
                          ? "border-encre bg-placeholder text-encre font-semibold"
                          : "border-gris/30 text-secondaire font-normal hover:bg-velin"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-gris font-normal">
                        {num}
                      </span>
                      {label}
                    </button>
                  </li>
                );
              })}
              <li aria-hidden="true" className="shrink-0 w-10" />
            </ul>
          </nav>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-papier to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
          {/* Sticky TOC — desktop only */}
          <nav className="hidden lg:block sticky top-24 pt-5 self-start" aria-label="Sommaire">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gris mb-4">
              Sommaire
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-1 border border-gris/20">
              {sections.map(({ id, num, label }) => {
                const isActive = activeId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={`w-full text-left pl-3 py-1.5 border-l-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-plume text-secondaire bg-placeholder font-semibold hover:bg-texte-clair-2"
                          : "border-transparent text-secondaire font-normal hover:bg-velin"
                      }`}
                    >
                      <span>
                        <span className="font-mono text-[12px] text-gris mr-2 font-normal">
                          {num}
                        </span>
                        <span className="text-[14px]">{label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sections
              Fix #20: gap between sections scales from 16 on mobile to 24 on lg
          */}
          <div className="flex flex-col gap-16 lg:gap-24">
            {/* 01 Présentation
                Fix #22: use scroll-mt-* utility instead of inline scrollMarginTop
            */}
            <section id="sec-presentation" className="scroll-mt-24">
              <SectionHeader num="01" title="Présentation" />
              <div className="flex flex-col gap-5 text-justify max-w-2xl">
                <p className="font-body text-[16px] leading-[1.65] text-secondaire m-0">
                  La Fondation accueille des archives privées, émanant de
                  personnes physiques (personnes, familles) ayant un rapport
                  étroit avec Mase : correspondances privées, journaux intimes,
                  notes sur le temps, les saisons et autres documents écrits.
                  Ces documents peuvent être d&apos;hier et
                  d&apos;aujourd&apos;hui, originaux ou photocopiés, manuscrits
                  ou dactylographiés.
                </p>
                <p className="font-body text-[16px] leading-[1.65] text-secondaire m-0">
                  ll est possible de déposer un document en formulant des
                  réserves soumettant leur consultation et leur utilisation à
                  des conditions définies par le déposant. Ces conditions
                  doivent figurer dans la convention de dépôt.
                </p>
                <p className="font-body text-[16px] leading-[1.65] text-secondaire m-0">
                  Les documents conservés par la Fondation sont en principe
                  librement consultables par le public. La consultation se fait
                  sur rendez-vous. Il n&apos;est pas possible d&apos;emprunter
                  les documents à domicile. Dans tous les cas, chaque demande de
                  consultation est examinée sous l&apos;angle de la protection
                  des données.
                </p>
              </div>
            </section>

            {/* 02 Formes de dépôt */}
            <section id="sec-formes" className="scroll-mt-24">
              <SectionHeader
                num="02"
                title="Sous quelles formes pouvez-vous verser vos archives à la Fondation ?"
              />
              <p className="font-body text-[16px] leading-[1.65] text-secondaire m-0 mb-8 text-justify max-w-2xl">
                Un fonds privé peut être remis sous forme de don, dépôt, legs ou
                dation en paiement, assorti d&apos;éventuelles restrictions de
                consultation définies dans une convention.
              </p>
              {/* Fix #19: DepotCard grid — 1 col on mobile, auto-fit from sm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <DepotCard
                  title="Don"
                  description="Un don d'archives privées implique la donation du fonds en toute propriété à la Fondation. Toutefois, des conditions temporaires peuvent éventuellement être fixées par un accord entre la Fondation et le donateur, ou par une convention précisant notamment les conditions de consultation et de reproduction."
                />
                <DepotCard
                  title="Dépôt"
                  description="Lorsque la Fondation accepte le dépôt d'un fonds d'archives privées, le déposant reste propriétaire des documents. Une convention est établie entre celui-ci et la Fondation, afin de préciser les conditions de consultation, de reproduction et de l'éventuel retrait du fonds."
                />
                <DepotCard
                  title="Legs"
                  description="Le legs d'archives est une forme particulière de don qui figure dans les dernières volontés d'un individu et dont les conditions sont fixées dans un testament. La Fondation devient alors propriétaire des documents légués."
                />
              </div>
            </section>

            {/* 03 Zones de description */}
            <section id="sec-zones" className="scroll-mt-24">
              <SectionHeader
                num="03"
                title="Les descriptifs des archives sont répartis en sept zones"
              />
              {/* Fix #24: replace inline gap/width with Tailwind utilities */}
              <div className="flex flex-col max-w-3xl">
                {[
                  {
                    num: "01",
                    term: "Identification",
                    desc: "c'est la zone la plus importante, car elle comprend la référence (ou cote) de l'unité décrite, l'intitulé (ou titre) qui en résume le contenu, les dates extrêmes, le niveau de description choisi et des indications sur le volume de l'unité décrite (métrage linéaire, nombre de pièces, etc.).",
                  },
                  {
                    num: "02",
                    term: "Contexte",
                    desc: "informations sur l'origine et la conservation de l'unité de description.",
                  },
                  {
                    num: "03",
                    term: "Contenu",
                    desc: "informations sur l'objet de l'unité de description et sur son classement.",
                  },
                  {
                    num: "04",
                    term: "Conditions d'accès",
                    desc: "informations sur les possibilités d'accès à l'unité de description.",
                  },
                  {
                    num: "05",
                    term: "Sources complémentaires",
                    desc: "informations sur les documents ayant un lien significatif avec l'unité de description.",
                  },
                  {
                    num: "06",
                    term: "Notes",
                    desc: "informations particulières qui n'ont pu être données dans aucune des autres zones.",
                  },
                  {
                    num: "07",
                    term: "Contrôle de la description",
                    desc: "informations précisant comment, quand et par qui la description a été effectuée.",
                  },
                ].map((zone, i, arr) => (
                  <div
                    key={zone.num}
                    className={`flex gap-5 py-5 ${i < arr.length - 1 ? "border-b border-encre/12" : ""}`}
                  >
                    <span className="font-mono text-[13px] text-laiton shrink-0 w-6">
                      {zone.num}
                    </span>
                    <p className="font-body text-[15px] leading-[1.6] text-secondaire m-0 text-justify">
                      <strong className="text-encre font-semibold">
                        {zone.term}
                      </strong>{" "}
                      — {zone.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 04 Convention type
                Fix #16: convention card uses Tailwind classes, responsive padding/max-width
            */}
            <section id="sec-convention" className="scroll-mt-24">
              <SectionHeader num="04" title="Exemple de convention" />
              <div className="relative flex flex-wrap items-center justify-between gap-5 border border-encre w-full max-w-lg px-5 sm:px-6 py-5">
                <div className="absolute -top-px -left-px -right-px h-0.75 bg-laiton" />
                <div className="flex items-center gap-3 min-w-0">
                  <FileText
                    size={28}
                    className="text-encre opacity-60 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-body text-[15px] text-encre overflow-hidden text-ellipsis whitespace-nowrap">
                      Convention de dépôt — modèle
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.09em] uppercase text-gris mt-0.5">
                      DOCX
                    </div>
                  </div>
                </div>
                <a
                  href="/fonds/d%C3%A9p%C3%B4t/Convention-cr%C3%A9ation-fonds.docx"
                  download="Convention-création-fonds.docx"
                  className="shrink-0 inline-flex items-center gap-2 no-underline font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-papier bg-encre hover:bg-secondaire transition-colors duration-150 px-4 sm:px-4.5 py-3 min-h-11"
                >
                  Télécharger
                  <FileDown size={18} />
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

    </div>
  );
}

/* Fix #18: SectionHeader h2 scales from 22px on mobile to 32px on lg */
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-encre pb-5 mb-8">
      <span className="font-mono text-[13px] text-laiton shrink-0">{num}</span>
      <h2 className="font-display font-normal text-encre m-0 text-[22px] sm:text-[26px] lg:text-[32px]">
        {title}
      </h2>
    </div>
  );
}

/* Fix #19: DepotCard uses Tailwind border/padding tokens instead of inline styles with raw hex */
function DepotCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative border border-encre px-5 pt-6 pb-5.5">
      <div className="absolute -top-px -left-px -right-px h-0.75 bg-laiton" />
      <h3 className="font-display font-normal text-encre m-0 mb-2.5 text-[20px]">
        {title}
      </h3>
      <p className="font-body text-[14px] leading-[1.55] text-secondaire m-0 text-justify">
        {description}
      </p>
    </div>
  );
}
