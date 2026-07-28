import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getConnectionString } from "@netlify/database";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? getConnectionString(),
});
const prisma = new PrismaClient({ adapter });

const services = [
  {
    name: "Taper Fade & Lineup",
    price: 25,
    duration: 30,
    description: "Taper fades and lineups — a clean, precise cut tailored to your style.",
    order: 0,
  },
  {
    name: "Kids Cut",
    price: 18,
    duration: 25,
    description: "Patient, gentle cuts for the younger clients. Ages 10 and under.",
    order: 1,
  },
  {
    name: "Beard Trim",
    price: 12,
    duration: 15,
    description: "Sharp beard lineup and shape-up to keep it clean.",
    order: 2,
  },
  {
    name: "Lineup Only",
    price: 20,
    duration: 15,
    description: "A quick lineup and edge-up to stay fresh between full cuts.",
    order: 3,
  },
  {
    name: "Beard & Lineup + Taper Fade",
    price: 35,
    duration: 45,
    description: "The full package — a taper fade, lineup, and beard trim in one visit.",
    order: 4,
  },
  {
    name: "Student Discount",
    price: 20,
    duration: 30,
    description: "A full haircut at a discounted rate — just show a valid student ID.",
    order: 5,
  },
];

const faqs = [
  {
    question: "How do I book?",
    answer:
      "Tap \"Book Appointment,\" choose your service, pick a date and time, and fill in your info. You'll get a confirmation once it's approved.",
    order: 0,
  },
  {
    question: "Do you take walk-ins?",
    answer:
      "Walk-ins are welcome when the schedule allows, but booking ahead is the best way to guarantee your spot.",
    order: 1,
  },
  {
    question: "What payment methods do you accept?",
    answer: "Cash, Cash App, and Zelle. No online payments are processed through this site.",
    order: 2,
  },
  {
    question: "How early should I arrive?",
    answer: "Please arrive 5–10 minutes early so we can start your appointment on time.",
    order: 3,
  },
  {
    question: "Can I cancel?",
    answer:
      "Yes — just reach out as soon as you can so that time slot can open up for another client.",
    order: 4,
  },
  {
    question: "Where are you located?",
    answer: "Check the Contact page for the current location, hours, and directions.",
    order: 5,
  },
];

const portfolioImages = [
  { url: "/portfolio/fade-lineup-1.jpg", category: "FADE", order: 0, featured: true },
  { url: "/portfolio/curly-fade-1.jpg", category: "FADE", order: 1 },
  { url: "/portfolio/taper-lineup-1.jpg", category: "TAPER", order: 2, featured: true },
  { url: "/portfolio/curly-taper-1.jpg", category: "TAPER", order: 3 },
  { url: "/portfolio/burst-fade-1.jpg", category: "BURST_FADE", order: 4 },
  { url: "/portfolio/braid-design-1.jpg", category: "DESIGN", order: 5 },
  { url: "/portfolio/curly-fade-2.jpg", category: "FADE", order: 6 },
  { url: "/portfolio/kids-cut-1.jpg", category: "KIDS", order: 7, featured: true },
  { url: "/portfolio/kids-cut-2.jpg", category: "KIDS", order: 8 },
];

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe#2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { id: "singleton" },
    update: { username: adminUsername, passwordHash },
    create: { id: "singleton", username: adminUsername, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "CUTS BY SCRAP",
      heroSubheadline: "Student Barber. Precision Cuts. Built Different.",
      aboutText:
        "Cuts by Scrap is run by a college student barber who's passionate about the craft — professional fades, clean lineups, and sharp beard work with no shortcuts. Quality over quantity, with flexible scheduling that works around a student's life. Every cut is a chance to build trust with a new client and grow the shop one appointment at a time.",
      contactPhone: "",
      contactEmail: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      address: "",
      mapEmbedUrl: "",
      bookingEnabled: true,
      vacationMode: false,
      defaultAppointmentDuration: 30,
      maxAppointmentsPerDay: 12,
      logoUrl: "/logo.png",
    },
  });

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }

  for (const image of portfolioImages) {
    const existing = await prisma.portfolioImage.findFirst({ where: { url: image.url } });
    if (!existing) {
      await prisma.portfolioImage.create({ data: image });
    }
  }

  // Mon–Fri 10:00–19:00 w/ lunch 13:00–14:00, Sat 10:00–16:00, Sun closed
  const hours = [
    { dayOfWeek: 0, isOpen: false, openTime: "10:00", closeTime: "18:00" },
    { dayOfWeek: 1, isOpen: true, openTime: "10:00", closeTime: "19:00", lunchStart: "13:00", lunchEnd: "14:00" },
    { dayOfWeek: 2, isOpen: true, openTime: "10:00", closeTime: "19:00", lunchStart: "13:00", lunchEnd: "14:00" },
    { dayOfWeek: 3, isOpen: true, openTime: "10:00", closeTime: "19:00", lunchStart: "13:00", lunchEnd: "14:00" },
    { dayOfWeek: 4, isOpen: true, openTime: "10:00", closeTime: "19:00", lunchStart: "13:00", lunchEnd: "14:00" },
    { dayOfWeek: 5, isOpen: true, openTime: "10:00", closeTime: "19:00", lunchStart: "13:00", lunchEnd: "14:00" },
    { dayOfWeek: 6, isOpen: true, openTime: "10:00", closeTime: "16:00" },
  ];

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: {},
      create: h,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login -> username: "${adminUsername}", password: (from ADMIN_PASSWORD env var)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
