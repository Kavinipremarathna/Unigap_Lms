import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    const certs = await this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certs.map((c) => ({
      id: c.id,
      certificateHash: c.certNumber,
      recipientName: c.user.name,
      recipientEmail: c.user.email,
      courseTitle: c.course.title,
      issueDate: c.issuedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      pdfUrl: c.pdfUrl ?? null,
    }));
  }

  async findAll() {
    const certs = await this.prisma.certificate.findMany({
      include: {
        course: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certs.map((c) => ({
      id: c.id,
      certificateHash: c.certNumber,
      recipientName: c.user.name,
      recipientEmail: c.user.email,
      courseTitle: c.course.title,
      issueDate: c.issuedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      pdfUrl: c.pdfUrl ?? null,
    }));
  }
}
