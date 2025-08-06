import { Injectable, Logger } from '@nestjs/common';
import { VesselService } from '#src/api/vessels/vessel.service';
import { PrismaService } from 'prisma/prisma.service';
import {
  groupFactorsByType,
  groupLogsByVessel,
  calculateVesselDeviations,
  createChartSeries,
  fetchQuarterlyEndLogs,
  type ChartResponse,
  type QuarterlyDeviation,
} from './lib';

@Injectable()
export class EmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vesselService: VesselService,
  ) {}

  private readonly logger = new Logger(EmissionService.name);

  async getChartData(options: {
    vesselIds?: number[];
    maxVessels?: number;
  }): Promise<ChartResponse> {
    const { vesselIds, maxVessels = 10 } = options;

    const vessels = await this.getTargetVessels(vesselIds, maxVessels);

    if (vessels.length === 0) {
      this.logger.warn('No vessels to process—returning empty chart');
      return { series: [], availableVessels: [] };
    }

    const allDeviations = await this.getBatchDeviations(
      vessels.map((v) => v.IMONo),
    );

    const series = createChartSeries(vessels, allDeviations);

    return {
      series,
      availableVessels: await this.vesselService.getAllVesselOptions(),
    };
  }

  private async getTargetVessels(vesselIds?: number[], maxVessels?: number) {
    return vesselIds?.length
      ? await this.prisma.vessel.findMany({
          where: { IMONo: { in: vesselIds } },
        })
      : await this.prisma.vessel.findMany({
          take: maxVessels,
          orderBy: { Name: 'asc' },
        });
  }

  private async getBatchDeviations(
    imos: number[],
  ): Promise<Map<number, QuarterlyDeviation[]>> {
    if (imos.length === 0) {
      return new Map();
    }

    // Fetch all required data
    const vessels = await this.prisma.vessel.findMany({
      where: { IMONo: { in: imos } },
    });

    const vesselMap = new Map(vessels.map((v) => [v.IMONo, v]));
    const vesselTypes = [...new Set(vessels.map((v) => v.VesselType))];

    const allFactors = await this.prisma.cE_PPSCCReferenceLine.findMany({
      where: {
        VesselTypeID: { in: vesselTypes },
        Category: 'PP',
      },
    });

    const allQuarterEndLogs = await fetchQuarterlyEndLogs(this.prisma, imos);

    // Process data using utilities
    const factorsByType = groupFactorsByType(allFactors);
    const logsByVessel = groupLogsByVessel(allQuarterEndLogs);
    const result = new Map<number, QuarterlyDeviation[]>();

    // Calculate deviations for each vessel
    for (const [vesselId, logs] of logsByVessel) {
      const vessel = vesselMap.get(vesselId);
      if (!vessel) {
        this.logger.warn(`Vessel ${vesselId} not found in vessel map`);
        continue;
      }

      const factors = factorsByType.get(vessel.VesselType);
      if (!factors || factors.length === 0) {
        this.logger.warn(
          `No PP factors found for vessel type ${vessel.VesselType}`,
        );
        continue;
      }

      const deviations = calculateVesselDeviations(vessel, logs, factors);
      result.set(vesselId, deviations);
    }

    return result;
  }
}
