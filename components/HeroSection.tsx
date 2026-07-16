'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export default function HeroSection() {
  return (
    <section className="grid md:[grid-template-columns:1.1fr_0.9fr] gap-16 px-14 pt-[88px] pb-24 items-end">
      {/* Left column */}
      <div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
          className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-6"
        >
          Patrimoine oral &amp; écrit de Mase
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
          className="font-display font-normal text-[44px] md:text-[60px] leading-[1.1] max-w-[600px] m-0 mb-7 text-encre"
        >
          Sauvegarder la mémoire d&apos;un village, écrite et racontée
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.16, ease: 'easeOut' }}
          className="font-body text-[17px] leading-[1.6] text-secondaire max-w-[500px] m-0 mb-8"
        >
          La Fondation Æncrage rassemble, conserve et met en valeur le patrimoine
          immatériel lié à la société masatte — écrits, archives, voix et portraits.
        </motion.p>

        <motion.a
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.24, ease: 'easeOut' }}
          href="#deposer-1a"
          className="inline-flex items-center px-[22px] py-[14px] bg-encre text-papier no-underline font-mono text-[11px] font-medium tracking-[0.18em] uppercase transition-[background-color,transform] duration-200 hover:bg-secondaire hover:-translate-y-0.5"
        >
          Déposer un témoignage
        </motion.a>
      </div>

      {/* Right column — image placeholder with brand bevel */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        className="w-full aspect-[4/5] bg-placeholder mt-8 md:mt-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 130px 100%, 0 calc(100% - 47px))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
