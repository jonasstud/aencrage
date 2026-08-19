import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 px-14 py-16 items-center max-h-[calc(100svh-89px)]">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-6">
            Erreur 404
          </p>
          <h1 className="font-display font-normal text-[52px] leading-[1.15] max-w-140 text-encre mb-7">
            Cette page s'est égarée dans les archives
          </h1>
          <p className="font-body text-[17px] leading-[1.6] text-secondaire max-w-120 mb-8">
            La page que vous cherchez n'existe pas ou a été déplacée. Elle n'a
            peut-être jamais été déposée dans nos fonds.
          </p>
          <div className="flex gap-6 items-center flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center px-5.5 py-3.5 bg-encre text-papier font-mono text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-secondaire hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/fonds"
              className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-encre border-b border-transparent hover:border-plume pb-0.5 transition-[border-color] duration-200"
            >
              Voir les fonds d'archives →
            </Link>
          </div>
        </div>

        <div
          className="hidden md:flex aspect-[4/5] max-h-[calc(100svh-89px-8rem)] w-full bg-placeholder items-center justify-center"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
          }}
          aria-hidden="true"
        >
          <span className="font-display italic leading-none text-plume select-none text-[clamp(60px,15vh,180px)]">
            404
          </span>
        </div>
      </main>
    </>
  );
}
