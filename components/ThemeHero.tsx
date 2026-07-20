"use client";

import { motion } from "framer-motion";
import type { ThemePage } from "@/lib/fondsThemes";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function ThemeHero({ theme }: { theme: ThemePage }) {
  const totalFonds = theme.chapitres.reduce(
    (acc, c) => acc + c.fonds.length,
    0,
  );

  return (
    <section className="min-h-[calc(100dvh-5rem)] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:grid-rows-1 gap-8 md:gap-16 px-6 md:px-14 pt-8 md:pt-12 pb-16 md:pb-24 items-end">
      

      <motion.div
        {...fadeIn}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="hidden md:block w-full self-stretch bg-placeholder"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))",
        }}
        aria-hidden="true"
      />

      <div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-6"
        >
          Thématique
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          className="font-display font-normal text-[52px] leading-[1.1] text-encre m-0 mb-7"
        >
          {theme.name}
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
          className="font-body text-[17px] leading-[1.6] text-secondaire max-w-130 m-0 mb-6"
        >
          {theme.intro}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
          className="font-mono text-[11px] tracking-widest uppercase text-gris"
        >
          {theme.chapitres.length} chapitres · {totalFonds} fonds
        </motion.div>
      </div>
    </section>
  );
}
