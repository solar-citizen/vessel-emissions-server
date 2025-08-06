import { Vessel } from '@prisma/client';
import type { VesselOption, VesselSummary } from './types';

/**
 * Maps Prisma vessel data to VesselOption format
 */
export function mapToVesselOptions(
  vessels: Pick<Vessel, 'IMONo' | 'Name'>[],
): VesselOption[] {
  return vessels.map((vessel) => ({
    imo: vessel.IMONo,
    name: vessel.Name,
  }));
}

/**
 * Maps Prisma vessel data to VesselSummary format
 */
export function mapToVesselSummaries(
  vessels: Pick<Vessel, 'IMONo' | 'Name' | 'VesselType' | 'DWT'>[],
): VesselSummary[] {
  return vessels.map((vessel) => ({
    imo: vessel.IMONo,
    name: vessel.Name,
    vesselType: vessel.VesselType,
    dwt: vessel.DWT,
  }));
}
