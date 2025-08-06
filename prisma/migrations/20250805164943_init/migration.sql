-- CreateTable
CREATE TABLE "public"."Vessel" (
    "IMONo" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "VesselType" INTEGER NOT NULL,
    "DWT" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("IMONo")
);

-- CreateTable
CREATE TABLE "public"."EmissionLog" (
    "EID" SERIAL NOT NULL,
    "VesselID" INTEGER NOT NULL,
    "FromUTC" TIMESTAMP(3) NOT NULL,
    "TOUTC" TIMESTAMP(3) NOT NULL,
    "AERCO2T2W" DOUBLE PRECISION NOT NULL,
    "TotT2WCO2" DOUBLE PRECISION,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmissionLog_pkey" PRIMARY KEY ("EID")
);

-- CreateTable
CREATE TABLE "public"."CE_PPSCCReferenceLine" (
    "RowID" INTEGER NOT NULL,
    "Category" TEXT NOT NULL,
    "VesselTypeID" INTEGER NOT NULL,
    "Size" TEXT NOT NULL,
    "Traj" TEXT NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "c" DOUBLE PRECISION NOT NULL,
    "d" DOUBLE PRECISION NOT NULL,
    "e" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CE_PPSCCReferenceLine_pkey" PRIMARY KEY ("RowID")
);

-- CreateIndex
CREATE INDEX "EmissionLog_VesselID_TOUTC_idx" ON "public"."EmissionLog"("VesselID", "TOUTC");

-- AddForeignKey
ALTER TABLE "public"."EmissionLog" ADD CONSTRAINT "EmissionLog_VesselID_fkey" FOREIGN KEY ("VesselID") REFERENCES "public"."Vessel"("IMONo") ON DELETE RESTRICT ON UPDATE CASCADE;
