import { PrismaService } from 'prisma/prisma.service';

/**
 * Common vessel query configurations
 */
export const VesselQueries = {
  /**
   * Query configuration for vessel options (minimal data for dropdowns)
   */
  OPTIONS_SELECT: {
    select: {
      IMONo: true,
      Name: true,
    },
    orderBy: {
      Name: 'asc' as const,
    },
  },

  /**
   * Query configuration for vessel summaries (list view data)
   */
  SUMMARY_SELECT: {
    select: {
      IMONo: true,
      Name: true,
      VesselType: true,
      DWT: true,
    },
  },
} as const;

/**
 * Fetches vessels for dropdown/select components
 */
export async function fetchVesselOptions(prisma: PrismaService) {
  return await prisma.vessel.findMany(VesselQueries.OPTIONS_SELECT);
}

/**
 * Fetches vessels for list/summary views
 */
export async function fetchVesselSummaries(prisma: PrismaService) {
  return await prisma.vessel.findMany(VesselQueries.SUMMARY_SELECT);
}

/**
 * Fetches a single vessel by IMO
 */
export async function fetchVesselByIMO(prisma: PrismaService, imo: number) {
  return await prisma.vessel.findUnique({
    where: { IMONo: imo },
  });
}
