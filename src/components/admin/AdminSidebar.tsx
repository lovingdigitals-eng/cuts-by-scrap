"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/hours", label: "Hours & Availability" },
  { href: "/admin/content", label: "Site Content" },
];

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="glass flex h-full w-64 shrink-0 flex-col border-r border-border-dim p-5">
      <div>
        <p className="font-heading text-lg font-bold uppercase tracking-wide text-chrome-gradient">
          Cuts by Scrap
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-white/40">Admin Dashboard</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors",
                active ? "bg-chrome/15 text-chrome" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-dim pt-4">
        <p className="mb-3 text-xs text-white/40">
          Signed in as <span className="text-white/70">{username}</span>
        </p>
        <Link
          href="/"
          className="mb-2 block rounded-lg px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white/60 hover:bg-white/5"
        >
          View Site
        </Link>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-border-dim px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/60 hover:border-red-900 hover:text-red-300"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
