import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border-dim bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30",
        "outline-none transition-colors focus:border-chrome focus:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border-dim bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30",
        "outline-none transition-colors focus:border-chrome focus:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-border-dim bg-white/5 px-4 py-3 text-sm text-white",
        "outline-none transition-colors focus:border-chrome focus:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60", className)}
      {...props}
    >
      {children}
    </label>
  );
}
