import { PrismaService } from 'prisma/prisma.service';
import type { QuarterEndLog } from './types';

/**
 * Fetches quarterly end logs for multiple vessels in a single optimized query
 */
export async function fetchQuarterlyEndLogs(
  prisma: PrismaService,
  imos: number[],
): Promise<QuarterEndLog[]> {
  return await prisma.$queryRaw<QuarterEndLog[]>`
    WITH quarterly_logs AS (
      SELECT
        "VesselID" as vessel_id,
        CONCAT(EXTRACT(YEAR FROM "TOUTC"), '-Q', EXTRACT(QUARTER FROM "TOUTC")) as quarter,
        "TOUTC",
        "AERCO2T2W",
        ROW_NUMBER() OVER (
          PARTITION BY "VesselID", EXTRACT(YEAR FROM "TOUTC"), EXTRACT(QUARTER FROM "TOUTC")
          ORDER BY "TOUTC" DESC
        ) as rn
      FROM "EmissionLog"
      WHERE "VesselID" = ANY(${imos})
    )
    SELECT vessel_id, quarter, "TOUTC" as toutc, "AERCO2T2W" as aerco2t2w
    FROM quarterly_logs
    WHERE rn = 1
    ORDER BY vessel_id, toutc
  `;
}
