import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { VesselModule } from '#src/api/vessels/vessel.module';

import { EmissionService } from './emission.service';
import { EmissionController } from './emission.controller';

@Module({
  imports: [
    VesselModule,
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
  ],
  controllers: [EmissionController],
  providers: [EmissionService],
  exports: [EmissionService],
})
export class EmissionModule {}
