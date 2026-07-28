import { cn } from "@/lib/cn";

export function GlassCard({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]",
        hover && "glow-silver",
        className
      )}
    >
      {children}
    </div>
  );
}
