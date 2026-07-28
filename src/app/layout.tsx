import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cuts by Scrap | Student Barber — Precision Cuts, Built Different",
    template: "%s | Cuts by Scrap",
  },
  description:
    "Cuts by Scrap is a college student barber delivering premium fades, tapers, and beard work. Book your next cut online.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Cuts by Scrap",
    title: "Cuts by Scrap | Student Barber — Precision Cuts, Built Different",
    description:
      "Premium fades, tapers, and beard work from a college student barber. Book your next cut online.",
    images: [{ url: "/logo.png", width: 1200, height: 1200, alt: "Cuts by Scrap" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuts by Scrap | Student Barber",
    description: "Premium fades, tapers, and beard work. Book your next cut online.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background bg-noise text-foreground">
        {children}
      </body>
    </html>
  );
}
