import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

const globalForPool = globalThis as unknown as { __pgPool?: Pool }

const isProduction = process.env.NODE_ENV === 'production'
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
const useSSL = isProduction || connectionString?.includes('sslmode=require')

export const pool =
  globalForPool.__pgPool ??
  new Pool({
    connectionString,
    max: isProduction ? 10 : 5,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  })

if (!isProduction) globalForPool.__pgPool = pool

export const db = drizzle(pool, { schema })
