# Vessel Emissions Server (NestJS + Prisma)

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

1. **Clone & Install**

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

2. **Environment Variables** Create `.env`:

```ini
// replace with actual values
DB_URL=postgresql://postgres:__password__@__db_host__/__db_name__?schema=__schema__
```

3. **Database**

- Start Postgres

- Run migrations:

```bash
npx prisma migrate dev --name init
```

4. **Seeding Data**

```bash
npx ts-node prisma/seed.ts
```

## Running

```bash
npm run start:dev
# Default port 3030
```

## API Endpoints

- `GET /emissions/deviation/:imo` — returns quarterly deviations

## Troubleshooting

- Re-generate client: `npx prisma generate`
