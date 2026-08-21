import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../../lib/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  get user() {
    return prisma.user;
  }

  get course() {
    return prisma.course;
  }

  get instructor() {
    return prisma.instructor;
  }

  get enrollment() {
    return prisma.enrollment;
  }

  get certificate() {
    return prisma.certificate;
  }

  get achievement() {
    return prisma.achievement;
  }

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
