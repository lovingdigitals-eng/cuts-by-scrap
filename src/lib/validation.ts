import { z } from "zod";

export const PORTFOLIO_CATEGORIES = [
  "FADE",
  "TAPER",
  "BURST_FADE",
  "DESIGN",
  "BEARD",
  "KIDS",
] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Choose a service"),
  date: z.string().regex(dateRegex, "Invalid date"),
  startTime: z.string().regex(timeRegex, "Invalid time"),
  customerName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9()+\-.\s]+$/, "Enter a valid phone number"),
  email: z
    .union([z.literal(""), z.string().email("Enter a valid email")])
    .optional(),
  notes: z.string().trim().max(500).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const serviceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  price: z.coerce.number().min(0),
  duration: z.coerce.number().int().min(5).max(480),
  description: z.string().trim().max(400),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const portfolioImageSchema = z.object({
  url: z.string().min(1),
  beforeUrl: z.string().optional().nullable(),
  category: z.enum(PORTFOLIO_CATEGORIES),
  caption: z.string().trim().max(200).optional().nullable(),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});
export type PortfolioImageInput = z.infer<typeof portfolioImageSchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(1).max(80),
  avatarUrl: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(1).max(1000),
  date: z.string().optional(),
  featured: z.boolean().default(false),
  approved: z.boolean().default(true),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(1).max(200),
  answer: z.string().trim().min(1).max(1000),
  order: z.coerce.number().int().default(0),
});
export type FaqInput = z.infer<typeof faqSchema>;

export const businessHoursSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().regex(timeRegex),
  closeTime: z.string().regex(timeRegex),
  lunchStart: z.string().regex(timeRegex).optional().nullable(),
  lunchEnd: z.string().regex(timeRegex).optional().nullable(),
});
export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;

export const blockedDateSchema = z.object({
  date: z.string().regex(dateRegex),
  reason: z.string().trim().max(200).optional().nullable(),
});
export type BlockedDateInput = z.infer<typeof blockedDateSchema>;

export const siteSettingsSchema = z.object({
  heroHeadline: z.string().trim().max(120).optional(),
  heroSubheadline: z.string().trim().max(200).optional(),
  aboutText: z.string().trim().max(4000).optional(),
  contactPhone: z.string().trim().max(30).optional(),
  contactEmail: z.union([z.literal(""), z.string().email()]).optional(),
  instagram: z.string().trim().max(200).optional(),
  facebook: z.string().trim().max(200).optional(),
  tiktok: z.string().trim().max(200).optional(),
  address: z.string().trim().max(300).optional(),
  mapEmbedUrl: z.string().trim().max(2000).optional(),
  bookingEnabled: z.boolean().optional(),
  vacationMode: z.boolean().optional(),
  defaultAppointmentDuration: z.coerce.number().int().min(5).max(480).optional(),
  maxAppointmentsPerDay: z.coerce.number().int().min(1).max(100).optional(),
  logoUrl: z.string().trim().max(300).optional(),
  aboutPhotoUrl: z.string().trim().max(300).optional(),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const appointmentStatusSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
});

export const rescheduleSchema = z.object({
  date: z.string().regex(dateRegex),
  startTime: z.string().regex(timeRegex),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
