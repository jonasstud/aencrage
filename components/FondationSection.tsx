import { conseil } from "@/lib/data";

export default function FondationSection() {
  return (
    <section id="fondation-1a" className="bg-velin px-6 md:px-14 py-14 md:py-22">
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
    </section>
  );
}
