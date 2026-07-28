import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import {
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  CashIcon,
  CashAppIcon,
  ZelleIcon,
} from "@/components/contact/icons";
import { faqJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Cuts by Scrap — phone, social media, business hours, and location.",
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function ContactPage() {
  const [settings, hours, faqs] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  const contacts = [
    settings?.contactPhone && { icon: PhoneIcon, label: settings.contactPhone, href: `tel:${settings.contactPhone}` },
    settings?.contactEmail && { icon: MailIcon, label: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    settings?.instagram && { icon: InstagramIcon, label: "Instagram", href: settings.instagram },
    settings?.facebook && { icon: FacebookIcon, label: "Facebook", href: settings.facebook },
    settings?.tiktok && { icon: TikTokIcon, label: "TikTok", href: settings.tiktok },
  ].filter(Boolean) as { icon: typeof PhoneIcon; label: string; href: string }[];

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}
      <Section className="pt-16">
        <SectionHeading eyebrow="Contact" title="Get In Touch" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full p-8">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
                Reach Out
              </h3>
              {contacts.length === 0 ? (
                <p className="mt-4 text-sm text-white/50">Contact details coming soon.</p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {contacts.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-chrome"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-chrome/30 text-chrome">
                          <c.icon className="h-4 w-4" />
                        </span>
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mt-8 font-heading text-lg font-bold uppercase tracking-wide text-chrome">
                Payment Methods
              </h3>
              <div className="mt-4 flex gap-3">
                {[
                  { icon: CashIcon, label: "Cash" },
                  { icon: CashAppIcon, label: "Cash App" },
                  { icon: ZelleIcon, label: "Zelle" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="flex items-center gap-2 rounded-full border border-border-dim bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70"
                  >
                    <p.icon className="h-4 w-4 text-chrome" />
                    {p.label}
                  </span>
                ))}
              </div>

              {settings?.address && (
                <p className="mt-8 text-sm text-white/60">{settings.address}</p>
              )}
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="h-full p-8">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
                Business Hours
              </h3>
              <ul className="mt-5 space-y-2">
                {hours.map((h) => (
                  <li key={h.dayOfWeek} className="flex justify-between border-b border-border-dim/60 py-2 text-sm">
                    <span className="text-white/70">{DAY_NAMES[h.dayOfWeek]}</span>
                    <span className="text-white/50">
                      {h.isOpen ? `${h.openTime} – ${h.closeTime}` : "Closed"}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>

        {settings?.mapEmbedUrl && (
          <Reveal delay={0.15} className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-border-dim">
              <iframe
                src={settings.mapEmbedUrl}
                loading="lazy"
                className="h-80 w-full"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                title="Cuts by Scrap location"
              />
            </div>
          </Reveal>
        )}
      </Section>

      <Section className="bg-surface/40">
        <SectionHeading eyebrow="FAQ" title="Good To Know" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </Section>
    </>
  );
}
