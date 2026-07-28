import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "success" | "warning" | "danger" | "muted";
}) {
  const tones: Record<string, string> = {
    default: "border-chrome/40 text-chrome bg-chrome/10",
    success: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
    warning: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    danger: "border-red-500/40 text-red-300 bg-red-500/10",
    muted: "border-border-dim text-white/50 bg-white/5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
