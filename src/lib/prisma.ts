import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getConnectionString } from "@netlify/database";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveConnectionString(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    return getConnectionString();
  } catch {
    // No database configured yet (e.g. during `next build`'s static page-data
    // collection, which imports route modules without a runtime DB env).
    // Actual queries at request time will fail loudly instead, which is correct.
    return "postgresql://unconfigured";
  }
}

const adapter = new PrismaPg({ connectionString: resolveConnectionString() });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
