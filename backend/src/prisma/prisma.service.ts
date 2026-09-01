import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const dbUrl = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString: dbUrl });
const prismaInstance = new PrismaClient({ adapter });

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  get user() {
    return prismaInstance.user;
  }

  get course() {
    return prismaInstance.course;
  }

  get instructor() {
    return prismaInstance.instructor;
  }

  get enrollment() {
    return prismaInstance.enrollment;
  }

  get certificate() {
    return prismaInstance.certificate;
  }

  get achievement() {
    return prismaInstance.achievement;
  }

  async onModuleInit() {
    await prismaInstance.$connect();
    console.log('✅ PrismaService connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await prismaInstance.$disconnect();
  }
}
