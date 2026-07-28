"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero({ logoUrl, headline, subheadline }: { logoUrl: string; headline: string; subheadline: string }) {
  const subLines = subheadline.split(".").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] h-[400px] w-[400px] rounded-full bg-white/[0.03] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 3px)",
          }}
        />
      </div>

      <h1 className="sr-only">{headline}</h1>

      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-4 w-full"
      >
        <div className="relative mx-auto aspect-[1100/487] w-full max-w-xs sm:max-w-xl lg:max-w-3xl">
          <div className="absolute inset-0 scale-110 rounded-3xl bg-white/10 blur-3xl" />
          <Image
            src={logoUrl}
            alt="Scrap"
            fill
            sizes="(min-width: 1024px) 768px, (min-width: 640px) 576px, 320px"
            className="relative object-contain drop-shadow-[0_0_50px_rgba(192,192,192,0.35)]"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="relative z-10 mt-6 flex flex-col gap-1 text-lg font-medium uppercase tracking-[0.15em] text-white/70 sm:text-xl"
      >
        {subLines.map((line) => (
          <span key={line}>{line}.</span>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Button href="/book" size="lg">
          Book Appointment
        </Button>
        <Button href="/portfolio" variant="secondary" size="lg">
          View Portfolio
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border border-white/30 p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
