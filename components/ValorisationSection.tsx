"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { spaces } from "@/lib/data";
import { shimmerBlurDataUrl } from "@/lib/blur";

export default function ValorisationSection() {
  return (
    <section id="valorisation-1a" className="px-6 md:px-14 py-7 md:py-11">
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0"
      >
        Valorisation
      </motion.p>
      <motion.h2
        {...fadeUp}
        transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        className="font-display font-normal text-[34px] leading-[1.15] max-w-160 m-0 mb-10 text-encre"
      >
        Des lieux pour donner à voir et à entendre les archives
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {spaces.map((space, i) => (
          <motion.div
            key={space.id}
            {...fadeUp}
            transition={{
              duration: 0.55,
              delay: 0.16 + i * 0.1,
              ease: "easeOut",
            }}
          >
            <div className="w-full aspect-4/3 bg-placeholder mb-4 overflow-hidden group relative">
              {space.image ? (
                <Image
                  src={space.image}
                  alt={space.name}
                  fill
                  sizes="(min-width: 768px) 65vw, 100vw"
                  placeholder="blur"
                  blurDataURL={shimmerBlurDataUrl()}
                  className="object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                />
              ) : (
                <div className="w-full h-full bg-placeholder transition-transform duration-400 group-hover:scale-[1.06]" />
              )}
            </div>
            <h3 className="font-display font-normal text-[20px] leading-[1.3] mb-2 text-encre">
              {space.name}
            </h3>
            <p className="font-body text-[14px] leading-normal text-secondaire m-0">
              {space.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
