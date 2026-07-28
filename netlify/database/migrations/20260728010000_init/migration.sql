-- Cuts by Scrap — initial schema + seed data for Netlify DB (Postgres)
-- Mirrors prisma/schema.prisma exactly (quoted identifiers preserve case for Prisma Client).

CREATE TABLE "Service" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "duration" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "PortfolioImage" (
  "id" TEXT PRIMARY KEY,
  "url" TEXT NOT NULL,
  "beforeUrl" TEXT,
  "category" TEXT NOT NULL,
  "caption" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "rating" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "approved" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "FaqItem" (
  "id" TEXT PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY,
  "serviceId" TEXT NOT NULL REFERENCES "Service"("id"),
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "notes" TEXT,
  "date" TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "reminderSent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

CREATE TABLE "BusinessHours" (
  "id" TEXT PRIMARY KEY,
  "dayOfWeek" INTEGER NOT NULL UNIQUE,
  "isOpen" BOOLEAN NOT NULL DEFAULT true,
  "openTime" TEXT NOT NULL DEFAULT '09:00',
  "closeTime" TEXT NOT NULL DEFAULT '18:00',
  "lunchStart" TEXT,
  "lunchEnd" TEXT
);

CREATE TABLE "BlockedDate" (
  "id" TEXT PRIMARY KEY,
  "date" TEXT NOT NULL UNIQUE,
  "reason" TEXT
);

CREATE TABLE "SiteSettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'singleton',
  "heroHeadline" TEXT NOT NULL DEFAULT 'CUTS BY SCRAP',
  "heroSubheadline" TEXT NOT NULL DEFAULT 'Student Barber. Precision Cuts. Built Different.',
  "aboutText" TEXT NOT NULL DEFAULT '',
  "contactPhone" TEXT NOT NULL DEFAULT '',
  "contactEmail" TEXT NOT NULL DEFAULT '',
  "instagram" TEXT NOT NULL DEFAULT '',
  "facebook" TEXT NOT NULL DEFAULT '',
  "tiktok" TEXT NOT NULL DEFAULT '',
  "address" TEXT NOT NULL DEFAULT '',
  "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
  "bookingEnabled" BOOLEAN NOT NULL DEFAULT true,
  "vacationMode" BOOLEAN NOT NULL DEFAULT false,
  "defaultAppointmentDuration" INTEGER NOT NULL DEFAULT 30,
  "maxAppointmentsPerDay" INTEGER NOT NULL DEFAULT 12,
  "logoUrl" TEXT NOT NULL DEFAULT '/logo.png'
);

CREATE TABLE "AdminUser" (
  "id" TEXT PRIMARY KEY DEFAULT 'singleton',
  "username" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL
);

-- Seed data -------------------------------------------------------------

INSERT INTO "AdminUser" ("id", "username", "passwordHash") VALUES
  ('singleton', 'admin', '$2b$12$IoHQTDmdydIWJu71ntRdF.3l8DJFJD/jOW09Lg5FFCgeYmOBQnbhq');

INSERT INTO "SiteSettings" ("id", "heroHeadline", "heroSubheadline", "aboutText", "contactPhone", "contactEmail", "instagram", "facebook", "tiktok", "address", "mapEmbedUrl", "bookingEnabled", "vacationMode", "defaultAppointmentDuration", "maxAppointmentsPerDay", "logoUrl") VALUES
  ('singleton', 'CUTS BY SCRAP', 'Student Barber. Precision Cuts. Built Different.',
   'Cuts by Scrap is run by a college student barber who''s passionate about the craft — professional fades, clean lineups, and sharp beard work with no shortcuts. Quality over quantity, with flexible scheduling that works around a student''s life. Every cut is a chance to build trust with a new client and grow the shop one appointment at a time.',
   '', '', '', '', '', '', '', true, false, 30, 12, '/logo.png');

INSERT INTO "Service" ("id", "name", "price", "duration", "description", "order") VALUES
  ('svc_taper_fade', 'Taper Fade & Lineup', 25, 30, 'Taper fades and lineups — a clean, precise cut tailored to your style.', 0),
  ('svc_kids_cut', 'Kids Cut', 18, 25, 'Patient, gentle cuts for the younger clients. Ages 10 and under.', 1),
  ('svc_beard_trim', 'Beard Trim', 12, 15, 'Sharp beard lineup and shape-up to keep it clean.', 2),
  ('svc_lineup_only', 'Lineup Only', 20, 15, 'A quick lineup and edge-up to stay fresh between full cuts.', 3),
  ('svc_hair_beard', 'Beard & Lineup + Taper Fade', 35, 45, 'The full package — a taper fade, lineup, and beard trim in one visit.', 4),
  ('svc_student_discount', 'Student Discount', 20, 30, 'A full haircut at a discounted rate — just show a valid student ID.', 5);

INSERT INTO "FaqItem" ("id", "question", "answer", "order") VALUES
  ('faq_book', 'How do I book?', 'Tap "Book Appointment," choose your service, pick a date and time, and fill in your info. You''ll get a confirmation once it''s approved.', 0),
  ('faq_walkins', 'Do you take walk-ins?', 'Walk-ins are welcome when the schedule allows, but booking ahead is the best way to guarantee your spot.', 1),
  ('faq_payment', 'What payment methods do you accept?', 'Cash, Cash App, and Zelle. No online payments are processed through this site.', 2),
  ('faq_arrival', 'How early should I arrive?', 'Please arrive 5–10 minutes early so we can start your appointment on time.', 3),
  ('faq_cancel', 'Can I cancel?', 'Yes — just reach out as soon as you can so that time slot can open up for another client.', 4),
  ('faq_location', 'Where are you located?', 'Check the Contact page for the current location, hours, and directions.', 5);

INSERT INTO "PortfolioImage" ("id", "url", "category", "featured", "order") VALUES
  ('pf_fade_1', '/portfolio/fade-lineup-1.jpg', 'FADE', true, 0),
  ('pf_fade_2', '/portfolio/curly-fade-1.jpg', 'FADE', false, 1),
  ('pf_taper_1', '/portfolio/taper-lineup-1.jpg', 'TAPER', true, 2),
  ('pf_taper_2', '/portfolio/curly-taper-1.jpg', 'TAPER', false, 3),
  ('pf_burst_1', '/portfolio/burst-fade-1.jpg', 'BURST_FADE', false, 4),
  ('pf_design_1', '/portfolio/braid-design-1.jpg', 'DESIGN', false, 5),
  ('pf_fade_3', '/portfolio/curly-fade-2.jpg', 'FADE', false, 6),
  ('pf_kids_1', '/portfolio/kids-cut-1.jpg', 'KIDS', true, 7),
  ('pf_kids_2', '/portfolio/kids-cut-2.jpg', 'KIDS', false, 8);

INSERT INTO "BusinessHours" ("id", "dayOfWeek", "isOpen", "openTime", "closeTime", "lunchStart", "lunchEnd") VALUES
  ('bh_sun', 0, false, '10:00', '18:00', NULL, NULL),
  ('bh_mon', 1, true, '10:00', '19:00', '13:00', '14:00'),
  ('bh_tue', 2, true, '10:00', '19:00', '13:00', '14:00'),
  ('bh_wed', 3, true, '10:00', '19:00', '13:00', '14:00'),
  ('bh_thu', 4, true, '10:00', '19:00', '13:00', '14:00'),
  ('bh_fri', 5, true, '10:00', '19:00', '13:00', '14:00'),
  ('bh_sat', 6, true, '10:00', '16:00', NULL, NULL);
