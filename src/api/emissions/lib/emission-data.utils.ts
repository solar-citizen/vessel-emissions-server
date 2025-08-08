import Decimal from 'decimal.js';
import { CE_PPSCCReferenceLine, Vessel } from '@prisma/client';

import { calculatePPSCCBaselines } from '#src/shared/calculate-pp-scc-baselines.util';
import { groupBy } from '#src/shared/group-by.util';

import type { ChartSeries, QuarterlyDeviation, QuarterEndLog } from './types';

/**
 * Groups factors by vessel type ID for efficient lookup
 */
export const groupFactorsByType = (factors: CE_PPSCCReferenceLine[]) =>
  groupBy(factors, (factor) => factor.VesselTypeID);

/**
 * Groups emission logs by vessel ID
 */
export const groupLogsByVessel = (logs: QuarterEndLog[]) =>
  groupBy(logs, (log) => log.vessel_id);

/**
 * Calculates quarterly deviations for a single vessel
 */
export function calculateVesselDeviations(
  vessel: Vessel,
  logs: QuarterEndLog[],
  factors: CE_PPSCCReferenceLine[],
): QuarterlyDeviation[] {
  return logs.map((log) => {
    const baselines = calculatePPSCCBaselines({
      factors,
      year: log.toutc.getUTCFullYear(),
      DWT: new Decimal(vessel.DWT),
    });

    const deviation = new Decimal(log.aerco2t2w)
      .minus(baselines.min)
      .dividedBy(baselines.min)
      .times(100);

    return {
      quarter: log.quarter,
      date: log.toutc,
      deviation: +deviation.toFixed(2),
      vesselName: vessel.Name,
      imo: vessel.IMONo,
    };
  });
}

/**
 * Converts vessels and their deviations to chart series format
 */
export function createChartSeries(
  vessels: Vessel[],
  deviationsMap: Map<number, QuarterlyDeviation[]>,
): ChartSeries[] {
  return vessels
    .map((vessel) => {
      const deviations = deviationsMap.get(vessel.IMONo) || [];
      return {
        name: vessel.Name,
        id: vessel.IMONo.toString(),
        data: deviations.map((d) => ({
          x: d.date.getTime(),
          y: d.deviation,
          quarter: d.quarter,
        })),
      };
    })
    .filter((s) => s.data.length > 0);
}
