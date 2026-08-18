import { conseil, patrimoineActions } from "@/lib/data";

export default function FondationSection() {
  return (
    <section
      id="fondation-1a"
      className="bg-velin px-6 md:px-14 lg:px-44 py-7 md:py-14"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left — description */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            La Fondation
          </p>
          <h2 className="font-display font-normal text-[34px] leading-[1.15] max-w-120 m-0 mb-6 text-encre">
            Préserver le patrimoine immatériel de la société masatte
          </h2>
          <p className="font-body text-[16px] leading-[1.65] text-secondaire max-w-120 m-0">
            Fondée à l&apos;initiative d&apos;Annette Corbaz, la fondation
            soutient toutes les actions de sauvegarde et de mise en valeur du
            patrimoine oral et écrit de Mase — et peut contribuer à
            d&apos;autres activités poursuivant les mêmes buts.
          </p>
        </div>

        {/* Right — council */}
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-5 m-0">
            Conseil de fondation
          </p>
          <div className="flex flex-col">
            {conseil.map((membre) => (
              <div
                key={membre.name}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0 py-4 border-b border-[rgba(19,20,23,0.12)]"
              >
                <span className="font-display font-normal text-[17px] text-encre">
                  {membre.name}
                </span>
                <span className="font-mono font-normal text-[12px] tracking-wider uppercase text-gris">
                  {membre.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nos actions */}
      <div id="activites-1a" className="mt-22">
        <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
          Nos actions
        </p>
        <h2 className="font-display font-normal text-[28px] leading-[1.15] m-0 mb-10 text-encre">
          Trois patrimoines à sauvegarder et transmettre
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(19,20,23,0.1)]">
          {patrimoineActions.map((action) => (
            <div key={action.title} className="bg-papier py-9 px-8">
              <div className="flex items-center text-center justify-between mb-4">
                <h3 className="font-display font-normal text-[22px] leading-tight text-encre m-0">
                  {action.title}
                </h3>
                <action.icon
                  size={24}
                  className="text-gris opacity-65 shrink-0"
                />
              </div>
              {action.bullets.map((bullet, i) => (
                <p
                  key={i}
                  className="font-body text-[14.5px] leading-[1.6] text-secondaire m-0 mb-3 last:mb-0 text-justify"
                >
                  {bullet}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
