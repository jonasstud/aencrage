export default function DeposerSection() {
  return (
    <section id="deposer-1a" className="bg-encre text-papier px-14 py-[88px]">
      {/* Grid: deposit info + contact */}
      <div className="grid grid-cols-1 md:[grid-template-columns:1.2fr_0.8fr] gap-16 mb-16">
        {/* Left — deposit */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-laiton mb-3 m-0">
            Déposer un fonds
          </p>
          <h2 className="font-display font-normal text-[32px] leading-[1.2] max-w-[520px] m-0 mb-5">
            Confiez vos écrits, photographies ou enregistrements à la fondation
          </h2>
          <p className="font-body text-[15px] leading-[1.6] text-texte-clair-1 max-w-[480px] m-0 mb-7">
            Correspondances, journaux, photographies, bandes sonores : chaque trace
            de la vie masatte a sa place dans les archives de la fondation.
          </p>
          <a
            href="#contact-1a"
            className="inline-flex px-[22px] py-[14px] bg-papier text-encre no-underline font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-opacity duration-200 hover:opacity-80"
          >
            Nous contacter
          </a>
        </div>

        {/* Right — contact */}
        <div id="contact-1a">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            Contact
          </p>
          <address className="font-body not-italic text-[15px] leading-[1.8] text-texte-clair-2">
            Fondation Æncrage
            <br />
            Mase, Valais — Suisse
            <br />
            <a
              href="mailto:contact@fondation-aencrage.ch"
              className="text-papier no-underline hover:underline"
            >
              contact@fondation-aencrage.ch
            </a>
          </address>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.15)] pt-6">
        <p className="font-mono font-normal text-[11px] tracking-[0.1em] uppercase text-gris m-0">
          Fondation Æncrage © 2026
        </p>
      </div>
    </section>
  )
}
