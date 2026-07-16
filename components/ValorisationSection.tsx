import { spaces } from '@/lib/data'

export default function ValorisationSection() {
  return (
    <section id="valorisation-1a" className="px-14 pb-24">
      <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
        Valorisation
      </p>
      <h2 className="font-display font-normal text-[34px] leading-[1.15] max-w-[640px] m-0 mb-10 text-encre">
        Des lieux pour donner à voir et à entendre les archives
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div key={space.id}>
            {/* Image placeholder with hover scale */}
            <div className="w-full aspect-[4/3] bg-placeholder mb-4 overflow-hidden group">
              <div className="w-full h-full bg-placeholder transition-transform duration-400 group-hover:scale-[1.06]" />
            </div>
            <h3 className="font-display font-normal text-[20px] leading-[1.3] mb-2 text-encre">
              {space.name}
            </h3>
            <p className="font-body text-[14px] leading-[1.5] text-secondaire m-0">
              {space.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
