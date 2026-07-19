"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { actions, filterOptions, type FilterOption } from "@/lib/data";

export default function ActivitesSection() {
  const [filter, setFilter] = useState<FilterOption>("Tous");

  const filteredActions =
    filter === "Tous" ? actions : actions.filter((a) => a.cat === filter);

  return (
    <section id="activites-1a" className="px-14 py-24">
      {/* Header row */}
      <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris mb-3 m-0">
            Activités
          </p>
          <h2 className="font-display font-normal text-[34px] leading-[1.15] m-0 text-encre">
            Les actions de la fondation
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3.5 py-2 border border-encre rounded-xs font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase cursor-pointer transition-[background-color,color] duration-200 ${
                filter === option
                  ? "bg-encre text-papier"
                  : "bg-velin text-encre"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid — key forces remount on filter change, replaying animations */}
      <div
        key={filter}
        className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(19,20,23,0.1)] border border-[rgba(19,20,23,0.1)]"
      >
        {filteredActions.map((action, i) => (
          <motion.div
            key={`${action.cat}-${i}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
            className="bg-papier px-8 py-7 transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_24px_rgba(117,143,178,0.18)] hover:-translate-y-0.5"
          >
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-plume mb-2.5 m-0">
              {action.cat}
            </p>
            <p className="font-body text-[15px] leading-[1.55] text-encre m-0">
              {action.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
