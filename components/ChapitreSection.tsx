"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import FondCard from "@/components/FondCard";
import type { Chapitre, Fond } from "@/lib/fondsThemes";

type Props = {
  chapitre: Chapitre;
  index: number;
  onOpen: (fond: Fond) => void;
  idPrefix?: string;
};

export default function ChapitreSection({ chapitre, index, onOpen, idPrefix = "" }: Props) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <section id={`${idPrefix}chapitre-${chapitre.id}`}>
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        className="flex items-baseline gap-4 border-b border-encre pb-5 mb-8"
      >
        <span className="font-mono text-[13px] text-laiton tracking-widest">
          {num}
        </span>
        <h2 className="font-display text-[32px] leading-[1.1] text-encre">
          {chapitre.name}
        </h2>
      </motion.div>

      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {chapitre.fonds.map((fond, i) => (
          <motion.div
            key={fond.id}
            {...fadeUp}
            transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
          >
            <FondCard fond={fond} onOpen={onOpen} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
