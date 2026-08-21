import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5433,
  user: "postgres",
  password: "Kavini@123*",
  database: "unigap",
});
const adapter = new PrismaPg(pool);

console.log("PRISMA INITIALIZING WITH ADAPTER HOST 127.0.0.1:5433, DATABASE_URL:", process.env.DATABASE_URL);
export const prisma = new PrismaClient({ adapter });
