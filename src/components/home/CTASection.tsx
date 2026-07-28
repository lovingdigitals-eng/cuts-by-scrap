import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function CTASection() {
  return (
    <Section>
      <Reveal>
        <div className="glass glow-silver relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]" />
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-chrome-gradient sm:text-4xl">
            Ready For A Fresh Cut?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Book in a couple taps — pick your service, pick a time, and show up looking built different.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/book" size="lg">
              Book Appointment
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Get In Touch
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
