import { Controller, Get, UseGuards, Request, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CertificatesService } from './certificates.service';

@Controller('api/certificates')
export class CertificatesController {
  constructor(
    @Inject(CertificatesService)
    private readonly certificatesService: CertificatesService,
  ) {}

  /** Returns only the certificates belonging to the currently logged-in user */
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyCertificates(@Request() req: any) {
    return this.certificatesService.findByUser(req.user.id);
  }

  /** Admin-only: returns all issued certificates across the platform */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllCertificates() {
    return this.certificatesService.findAll();
  }
}
