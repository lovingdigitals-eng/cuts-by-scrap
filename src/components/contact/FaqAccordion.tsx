"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border-dim rounded-2xl border border-border-dim">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-heading text-sm font-semibold uppercase tracking-wide text-white sm:text-base">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-chrome/40 text-chrome"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("overflow-hidden")}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
