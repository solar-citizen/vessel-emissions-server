import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { EmissionService } from './emission.service';
import { EmissionController } from './emission.controller';

@Module({
  imports: [
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
