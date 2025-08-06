import { PrismaClient } from '@prisma/client';

import dailyLogs from '../data/daily-log-emissions.json';
import ppRefs from '../data/pp-reference.json';
import vessels from '../data/vessels.json';

const prisma = new PrismaClient();

async function main() {
  // Vessels
  for (const v of vessels) {
    await prisma.vessel.upsert({
      where: { IMONo: v.IMONo },
      create: v,
      update: {},
    });
  }

  // Daily Logs
  await prisma.emissionLog.createMany({
    data: dailyLogs.map(
      ({ EID, VesselID, FromUTC, TOUTC, TotT2WCO2, AERCO2T2W }) => ({
        EID,
        VesselID,
        FromUTC: new Date(FromUTC),
        TOUTC: new Date(TOUTC),
        TotT2WCO2,
        AERCO2T2W,
      }),
    ),
    skipDuplicates: true,
  });

  // PP Reference
  await prisma.cE_PPSCCReferenceLine.createMany({
    data: ppRefs,
    skipDuplicates: true,
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
