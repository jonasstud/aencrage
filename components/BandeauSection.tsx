export default function BandeauSection() {
  return (
    <section className="bg-plume text-papier px-14 py-7 flex items-center justify-between flex-wrap gap-6">
      <p className="font-display italic text-[20px] leading-[1.4] max-w-[760px] m-0">
        Vous conservez des écrits, photographies ou enregistrements liés à Mase ?
        La fondation recueille dès aujourd&apos;hui les premiers témoignages.
      </p>
      <a
        href="#deposer-1a"
        className="flex-none font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-papier no-underline border-b border-[rgba(255,255,255,0.6)] pb-1 transition-[border-color] duration-200 hover:border-papier"
      >
        En savoir plus →
      </a>
    </section>
  )
}
