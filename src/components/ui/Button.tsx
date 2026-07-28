import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 font-heading uppercase tracking-wide font-semibold rounded-full transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-white via-chrome to-[#8a8a8a] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_28px_rgba(192,192,192,0.55)] hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-white border border-chrome/50 hover:border-chrome hover:shadow-[0_0_20px_rgba(192,192,192,0.3)] hover:-translate-y-0.5",
  ghost: "bg-white/5 text-white border border-border-dim hover:bg-white/10",
  danger:
    "bg-red-950/40 text-red-300 border border-red-900 hover:bg-red-900/40 hover:text-red-100",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
