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
      {/* Hero */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "64px",
          padding: "64px 56px 56px",
          alignItems: "end",
        }}
      >
        <div
          className="bg-placeholder w-full"
          style={{
            height: 420,
            minWidth: 0,
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-5">
            Fonds d&apos;archives
          </div>
          <h1
            className="font-display font-normal text-encre m-0 mb-5"
            style={{ fontSize: 48, lineHeight: 1.1 }}
          >
            Dépôt d&apos;un fonds
          </h1>
          <p
            className="font-body text-[16px] leading-[1.6] text-secondaire m-0 mb-5"
            style={{ maxWidth: 480 }}
          >
            La Fondation accueille les archives privées en lien avec Mase, sous
            plusieurs formes et conditions détaillées ci-dessous.
          </p>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-gris">
            Don · Dépôt · Legs
          </div>
        </div>
      </section>

      {/* Body */}
      <div
        className="w-full mx-auto"
        style={{ padding: "0 56px 120px", maxWidth: 1400 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "64px",
          }}
        >
          {/* Sticky TOC */}
          <nav className="sticky top-24 pt-5 self-start" aria-label="Sommaire">
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

          {/* Sections */}
          <div className="flex flex-col" style={{ gap: 96 }}>
            {/* 01 Présentation */}
            <section id="sec-presentation" style={{ scrollMarginTop: 100 }}>
              <SectionHeader num="01" title="Présentation" />
              <div
                className="flex flex-col text-justify"
                style={{ gap: 20, maxWidth: 720 }}
              >
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
            <section id="sec-formes" style={{ scrollMarginTop: 100 }}>
              <SectionHeader
                num="02"
                title="Sous quelles formes pouvez-vous verser vos archives à la Fondation ?"
              />
              <p
                className="font-body text-[16px] leading-[1.65] text-secondaire m-0 mb-8 text-justify"
                style={{ maxWidth: 720 }}
              >
                Un fonds privé peut être remis sous forme de don, dépôt, legs ou
                dation en paiement, assorti d&apos;éventuelles restrictions de
                consultation définies dans une convention.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 32,
                }}
              >
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
            <section id="sec-zones" style={{ scrollMarginTop: 100 }}>
              <SectionHeader
                num="03"
                title="Les descriptifs des archives sont répartis en sept zones"
              />
              <div className="flex flex-col" style={{ maxWidth: 760 }}>
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
                    className="flex"
                    style={{
                      gap: 20,
                      padding: "20px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid rgba(19,20,23,0.12)"
                          : undefined,
                    }}
                  >
                    <span
                      className="font-mono text-[13px] text-laiton shrink-0"
                      style={{ width: 24 }}
                    >
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

            {/* 04 Convention type */}
            <section id="sec-convention" style={{ scrollMarginTop: 100 }}>
              <SectionHeader num="04" title="Exemple de convention" />
              <div
                className="relative flex items-center justify-between"
                style={{
                  border: "1px solid #131417",
                  maxWidth: 520,
                  gap: 20,
                  padding: "20px 24px",
                }}
              >
                <div
                  className="absolute"
                  style={{
                    top: -1,
                    left: -1,
                    right: -1,
                    height: 3,
                    background: "#A88C5A",
                  }}
                />
                <div
                  className="flex items-center"
                  style={{ gap: 12, minWidth: 0 }}
                >
                  <FileText
                    size={28}
                    className="text-encre opacity-60 shrink-0"
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="font-body text-[15px] text-encre overflow-hidden text-ellipsis whitespace-nowrap">
                      Convention de dépôt — modèle
                    </div>
                    <div
                      className="font-mono text-[10px] tracking-[0.09em] uppercase text-gris"
                      style={{ marginTop: 2 }}
                    >
                      DOCX
                    </div>
                  </div>
                </div>
                <a
                  href="/fonds/d%C3%A9p%C3%B4t/Convention-cr%C3%A9ation-fonds.docx"
                  download="Convention-création-fonds.docx"
                  className="shrink-0 inline-flex items-center no-underline font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-papier bg-encre hover:bg-secondaire transition-colors duration-150"
                  style={{ gap: 8, padding: "12px 18px" }}
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

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div
      className="flex items-baseline border-b border-encre"
      style={{ gap: 16, paddingBottom: 20, marginBottom: 32 }}
    >
      <span className="font-mono text-[13px] text-laiton shrink-0">{num}</span>
      <h2
        className="font-display font-normal text-encre m-0"
        style={{ fontSize: 32 }}
      >
        {title}
      </h2>
    </div>
  );
}

function DepotCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="relative"
      style={{ border: "1px solid #131417", padding: "24px 22px 22px" }}
    >
      <div
        className="absolute"
        style={{
          top: -1,
          left: -1,
          right: -1,
          height: 3,
          background: "#A88C5A",
        }}
      />
      <h3
        className="font-display font-normal text-encre m-0 mb-2.5"
        style={{ fontSize: 20 }}
      >
        {title}
      </h3>
      <p className="font-body text-[14px] leading-[1.55] text-secondaire m-0 text-justify">
        {description}
      </p>
    </div>
  );
}
