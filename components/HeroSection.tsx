"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const heroImages = [
  "/images/hero/hero-1.webp",
  "/images/hero/hero-2.webp",
  "/images/hero/hero-3.webp",
  "/images/hero/hero-4.webp",
  "/images/hero/hero-5.webp",
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:grid-rows-1 gap-8 md:gap-16 px-6 md:px-14 pt-8 md:pt-12 pb-8 md:pb-12 items-end">
      {/* Left column */}
      <div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-6"
        >
          Patrimoine oral &amp; écrit de Mase
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          className="font-display font-normal text-[44px] md:text-[60px] leading-[1.1] max-w-150 m-0 mb-7 text-encre"
        >
          Sauvegarder la mémoire d&apos;un village, écrite et racontée
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
          className="font-body text-[17px] leading-[1.6] text-secondaire max-w-140 m-0 mb-8"
        >
          La Fondation æncrage rassemble, conserve et met en valeur le
          patrimoine oral et écrit lié à la société masatte. (correspondances
          diverses, textes officiels, travaux de recherche, articles de presse,
          émissions radio-tv, photographies et films, témoignages et portraits,
          ... )
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
        >
          <Link
            href="/deposer"
            className="inline-flex items-center px-5.5 py-3.5 bg-encre text-papier no-underline font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-[background-color,transform] duration-200 hover:bg-secondaire hover:-translate-y-0.5"
          >
            Déposer un fonds
          </Link>
        </motion.div>
      </div>

      {/* Right column — hero image with brand bevel */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="order-first md:order-last relative w-full h-64 md:h-auto self-stretch bg-placeholder"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
        }}
        aria-hidden="true"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[index]}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              preload={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
