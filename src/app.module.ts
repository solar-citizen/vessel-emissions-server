import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmissionModule } from './api/emissions/emission.module';
import { PrismaModule } from 'prisma/prisma.module';
import { VesselModule } from './api/vessels/vessel.module';

@Module({
  imports: [PrismaModule, EmissionModule, VesselModule],
  controllers: [AppController],
})
export class AppModule {}
