import Image from "next/image";
import Link from "next/link";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface FooterSettings {
  logoUrl: string;
  contactPhone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

interface FooterHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export function Footer({
  settings,
  hours,
}: {
  settings: FooterSettings;
  hours: FooterHours[];
}) {
  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const socials = [
    { key: "instagram", label: "Instagram", href: settings.instagram },
    { key: "facebook", label: "Facebook", href: settings.facebook },
    { key: "tiktok", label: "TikTok", href: settings.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border-dim bg-[#050505]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-4 lg:px-16">
        <div>
          <Link href="/" className="flex items-center">
            <Image src={settings.logoUrl} alt="Scrap" width={900} height={407} className="h-10 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/50">
            Student barber. Precision cuts. Built different.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-chrome">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Services", "/services"],
              ["Portfolio", "/portfolio"],
              ["Book Appointment", "/book"],
              ["Reviews", "/reviews"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-chrome">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-chrome">
            Business Hours
          </h3>
          <ul className="mt-4 space-y-1.5 text-sm text-white/60">
            {sortedHours.map((h) => (
              <li key={h.dayOfWeek} className="flex justify-between gap-4">
                <span>{DAY_NAMES[h.dayOfWeek]}</span>
                <span>{h.isOpen ? `${h.openTime} – ${h.closeTime}` : "Closed"}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-chrome">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {settings.contactPhone && (
              <li>
                <a href={`tel:${settings.contactPhone}`} className="transition-colors hover:text-chrome">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-chrome"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 border-t border-border-dim px-6 py-6 text-center text-xs uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:justify-between sm:px-10 lg:px-16">
        <span>&copy; {new Date().getFullYear()} Cuts by Scrap. Built Different.</span>
        <div className="flex items-center gap-4">
          <a
            href="https://truceit-tech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-[0.2em] text-white/25 transition-colors hover:text-white/50"
          >
            Made by TruceIt Technologies
          </a>
          <Link href="/admin/login" className="tracking-[0.2em] text-white/25 transition-colors hover:text-white/50">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
