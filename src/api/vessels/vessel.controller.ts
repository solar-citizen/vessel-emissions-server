import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { VesselService } from './vessel.service';

@ApiTags('vessels')
@Controller('vessels')
@UseInterceptors(CacheInterceptor)
export class VesselController {
  constructor(private readonly svc: VesselService) {}

  @Get('vessels')
  @CacheTTL(3600)
  async getVessels() {
    return await this.svc.getAllVessels();
  }
}
