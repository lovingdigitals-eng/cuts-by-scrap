import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const POINTS = [
  "College student barber",
  "Passionate about the craft",
  "Professional fades & clean cuts",
  "Quality over quantity",
  "Flexible scheduling",
  "Growing one client at a time",
];

export function AboutPreview({
  aboutText,
  aboutPhotoUrl,
}: {
  aboutText: string;
  aboutPhotoUrl: string;
}) {
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-border-dim shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <Image
              src={aboutPhotoUrl}
              alt="Scrap, barber behind Cuts by Scrap"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-chrome">
            About
          </p>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-chrome-gradient sm:text-4xl">
            Built On The Grind
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">{aboutText}</p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-white/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-chrome" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/about" variant="secondary">
              More About Scrap
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
