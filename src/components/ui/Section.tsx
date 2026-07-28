import { cn } from "@/lib/cn";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative px-6 py-20 sm:px-10 lg:px-16", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-12", align === "center" ? "text-center" : "text-left")}>
      {eyebrow && (
        <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-chrome">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-chrome-gradient sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base text-white/60 sm:text-lg",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
