import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Vessel } from '@prisma/client';

import { PrismaService } from 'prisma/prisma.service';
import {
  fetchVesselOptions,
  fetchVesselSummaries,
  fetchVesselByIMO,
  mapToVesselOptions,
  mapToVesselSummaries,
  type VesselOption,
  type VesselSummary,
} from './lib';

@Injectable()
export class VesselService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(VesselService.name);

  async getAllVesselOptions(): Promise<VesselOption[]> {
    this.logger.log('Fetching all vessel options');
    const vessels = await fetchVesselOptions(this.prisma);
    return mapToVesselOptions(vessels);
  }

  async getAllVessels(): Promise<VesselSummary[]> {
    this.logger.log('Fetching all vessels');
    const vessels = await fetchVesselSummaries(this.prisma);
    return mapToVesselSummaries(vessels);
  }

  async getVessel(imo: number): Promise<Vessel> {
    this.logger.log(`Fetching vessel with imo: ${imo}`);
    const vessel = await fetchVesselByIMO(this.prisma, imo);
    if (!vessel) {
      throw new NotFoundException(`Vessel with IMO ${imo} not found`);
    }
    return vessel;
  }
}
