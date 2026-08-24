import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:Kavini%40123*@127.0.0.1:5433/unigap";
process.env.DATABASE_URL = dbUrl;

const adapter = new PrismaPg({ connectionString: dbUrl });

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
