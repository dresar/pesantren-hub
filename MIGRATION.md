# Database Migration: MySQL to PostgreSQL (Neon)

## Overview
This document details the migration process from MySQL to PostgreSQL (Neon). The application has been updated to use PostgreSQL drivers and the schema has been converted.

## Changes

### 1. Dependencies
- Added: `pg`, `@neondatabase/serverless`
- Updated: `drizzle-orm`, `drizzle-kit`
- Retained: `mysql2` (for data migration script only)

### 2. Schema Conversion
The Drizzle schema (`server/db/schema.ts`) has been rewritten for PostgreSQL:
- **Auto-increment**: `serial` / `bigserial`
- **Boolean**: `boolean` (was `tinyint` in MySQL)
- **DateTime**: `timestamp`
- **Text**: `text` (replaced `longtext`)

The original MySQL schema is preserved at `server/db/schema.mysql.ts` for reference and data migration.

### 3. Configuration
- `.env`: Updated `DATABASE_URL` to point to Neon PostgreSQL. Old MySQL URL saved as `MYSQL_DATABASE_URL`.
- `drizzle.config.ts`: Driver switched to `'pg'`.
- `server/db/index.ts`: Updated to initialize `drizzle-orm/node-postgres`.

## Migration Steps

### Schema Migration
The schema has already been pushed to the Neon database using:
```bash
npx drizzle-kit push:pg
```

### Data Migration
A script is available to transfer data from the local MySQL database to Neon.
**Prerequisite**: The local MySQL server must be running and accessible at `MYSQL_DATABASE_URL`.

To run the data migration:
```bash
npx tsx scripts/migrate-data.ts
```

*Note: If you encounter connection errors (ECONNREFUSED), ensure your local MySQL server is started.*

### Verification
You can verify the database connection and table existence using:
```bash
npx tsx scripts/check-db.ts
```

## Rollback Plan
If you need to revert to MySQL:
1. Rename `server/db/schema.ts` back to `server/db/schema.pg.ts`.
2. Rename `server/db/schema.mysql.ts` back to `server/db/schema.ts`.
3. Revert `drizzle.config.ts` driver to `'mysql2'`.
4. Revert `server/db/index.ts` to use `mysql2` pool.
5. Restore `.env` `DATABASE_URL` to the MySQL connection string.
