import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    const socketPath = process.env.INSTANCE_UNIX_SOCKET
    const client = postgres(connectionString, {
      ...(socketPath ? { host: socketPath } : {}),
      max: 1,
      idle_timeout: 20,
    })
    _db = drizzle(client, { schema })
  }
  return _db
}
