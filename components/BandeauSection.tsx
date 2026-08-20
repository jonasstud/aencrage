"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function BandeauSection() {
  return (
    <section className="bg-plume text-papier px-6 md:px-14 py-7 flex items-center justify-between flex-wrap gap-6">
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        className="font-display italic text-[20px] leading-[1.4] max-w-190 m-0"
      >
        Vous conservez des écrits, photographies ou enregistrements liés à Mase
        ? La fondation recueille dès aujourd&apos;hui les premiers témoignages.
      </motion.p>
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <Link
          href="/deposer"
          className="flex-none font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-papier no-underline border-b border-[rgba(255,255,255,0.6)] pb-1 transition-[border-color] duration-200 hover:border-papier"
        >
          En savoir plus →
        </Link>
      </motion.div>
    </section>
  );
}
