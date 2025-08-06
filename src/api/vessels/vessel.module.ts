import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { VesselService } from './vessel.service';
import { VesselController } from './vessel.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
  ],
  controllers: [VesselController],
  providers: [VesselService],
  exports: [VesselService],
})
export class VesselModule {}
