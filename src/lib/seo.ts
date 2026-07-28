export interface BusinessInfo {
  name: string;
  url: string;
  phone?: string;
  email?: string;
  address?: string;
  image?: string;
  description?: string;
}

/**
 * schema.org has no literal "BarberShop" type. HairSalon is the correct
 * LocalBusiness subtype for a barbershop/salon and is what search engines
 * expect for this kind of local business.
 */
export function hairSalonJsonLd(info: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: info.name,
    url: info.url,
    image: info.image,
    description: info.description,
    telephone: info.phone || undefined,
    email: info.email || undefined,
    priceRange: "$",
    address: info.address
      ? {
          "@type": "PostalAddress",
          streetAddress: info.address,
        }
      : undefined,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
