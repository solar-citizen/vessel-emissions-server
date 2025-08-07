# Vessel Emissions Server (NestJS + Prisma)

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
   - [Clone & Install](#1-clone--install)
   - [Environment Variables](#2-environment-variables-create-env)
   - [Database Setup & Migrations](#3-database)
   - [Seeding Data](#4-seeding-data)
5. [Running](#running)
   - [Important Note](#important-note)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

## Overview

The server ingests JSON data (vessels, daily‐log‐emissions, Poseidon Principle references), calculates quarterly deviations, and exposes a REST endpoint(-s).

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- decimal.js for precision math

## Prerequisites

- Node.js v18+ and npm
- PostgreSQL v17+ (untested: may work with v16)

## Setup

### 1. **Clone & Install**

If you didn't create main folder:

```bash
mkdir vessel-emissions
cd vessel-emissions
```

Else:

```bash
cd vessel-emissions
git clone https://github.com/solar-citizen/vessel-emissions-server.git
cd vessel-emissions-server
npm i
```

### 2. **Environment Variables** Create `.env`:

```ini
// replace with actual values
DB_URL=postgresql://postgres:__password__@__db_host__/__db_name__?schema=__schema__
```

### 3. **Database**

- Start Postgres

- Run migrations:

```bash
npx prisma migrate dev --name init
```

### 4. **Seeding Data**

```bash
npx ts-node prisma/seed.ts
```

## Running

`# Default port 3030`

```bash
npm run start:dev
```

### **Important Note:**

> For this task, the `data/vessels.json` file has been manually updated with real vessel names (by IMO lookup) and a `DWT` field has been added for accurate baseline calculations.

## API Endpoints

- `GET /emissions/deviation/:imo` — returns quarterly deviations

## Troubleshooting

- Re-generate client: `npx prisma generate`
- If schema changes (e.g. you add/remove fields):

```bash
npx prisma migrate dev --name <migration_name>
```

then

```bash
npx prisma generate
```

- If you only change seed data (JSON files) and schema is unchanged: re-run the seed script to update the database:

```bash
npx ts-node prisma/seed.ts
```

- **Updating existing rows on seed**: By default the seed script uses `upsert` with an empty `update` block for vessels, so DWT and Name changes won't apply. To apply changes, edit `prisma/seed.ts`:

```ts
await prisma.vessel.upsert({
  where: { IMONo: v.IMONo },
  create: v,
  update: v, // apply all fields from JSON
});
```

Then re-run:

```bash
npx ts-node prisma/seed.ts
```
