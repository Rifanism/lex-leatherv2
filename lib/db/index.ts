import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

const globalForPool = globalThis as unknown as { __pgPool?: Pool }

const isProduction = process.env.NODE_ENV === 'production'
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

const isLocalhost = Boolean(
  connectionString?.includes('localhost') ||
    connectionString?.includes('127.0.0.1'),
)
const isExplicitDisable = Boolean(connectionString?.includes('sslmode=disable'))

const useSSL =
  !isLocalhost &&
  !isExplicitDisable &&
  (isProduction ||
    Boolean(connectionString?.includes('sslmode=require')) ||
    Boolean(connectionString?.includes('neon.tech')))

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
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  })

if (!isProduction) globalForPool.__pgPool = pool

export const db = drizzle(pool, { schema })
