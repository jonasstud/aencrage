import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { FOND_DU_MOIS_QUERY } from "@/lib/sanity/queries";

const options = { next: { revalidate: 60 } };

export default async function EnEvidenceSection() {
  const fond = await client.fetch(FOND_DU_MOIS_QUERY, {}, options);

  if (!fond?.title) return null;

  const { title, annee, typeFond, donateur, chapo, couverture } = fond;
  const hasCouverture = Boolean(couverture?.asset);

  const metaParts = [annee?.toString(), typeFond, donateur].filter(Boolean) as string[];

  return (
    <section
      id="en-evidence-1a"
      className="bg-velin px-6 md:px-14 lg:px-44 py-11 md:py-22"
    >
      <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
        Actualité
      </p>
      <h2 className="font-display font-normal text-[34px] leading-[1.15] m-0 mb-10 text-encre">
        En évidence ce mois
      </h2>

      <div className="border border-[rgba(19,20,23,0.12)] p-10">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-14 items-center">
          {/* Left — text */}
          <div>
            {metaParts.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.14em] uppercase text-gris mb-4">
                {metaParts.map((part, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">·</span>}
                    {part}
                  </span>
                ))}
              </div>
            )}
            <h3 className="font-display font-normal text-[26px] leading-[1.2] text-encre mb-4">
              {title}
            </h3>
            {chapo && (
              <p className="font-body text-[15px] leading-[1.65] text-secondaire m-0 mb-6">
                {chapo}
              </p>
            )}
            <Link
              href="/activite"
              className="font-mono text-[12px] tracking-[0.14em] uppercase text-encre border-b border-encre pb-px hover:border-transparent transition-colors"
            >
              Voir le fond du mois →
            </Link>
          </div>

          {/* Right — image */}
          <div className="aspect-4/3 relative overflow-hidden bg-placeholder">
            {hasCouverture ? (
              <Image
                src={urlForImage(couverture)
                  .width(900)
                  .fit("max")
                  .auto("format")
                  .url()}
                alt={couverture.alt ?? title}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-placeholder" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
