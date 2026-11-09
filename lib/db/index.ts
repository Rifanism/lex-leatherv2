import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

const globalForPool = globalThis as unknown as { __pgPool?: Pool }

const isProduction = process.env.NODE_ENV === 'production'
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
const useSSL = isProduction || connectionString?.includes('sslmode=require')

if (isProduction && !connectionString) {
  console.error(
    '⚠️ [Lex Leather DB] DATABASE_URL atau POSTGRES_URL belum disetel di Vercel Environment Variables!',
  )
}

export const pool =
  globalForPool.__pgPool ??
  new Pool({
    connectionString: connectionString || undefined,
    max: isProduction ? 10 : 5,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  })

if (!isProduction) globalForPool.__pgPool = pool

export const db = drizzle(pool, { schema })
