import { NextResponse } from 'next/server';
import { getNeonSql, initNeonDbTables, memoryStore } from '@/lib/db';

export async function GET() {
  const sql = getNeonSql();
  const hasNeonUrl = Boolean(process.env.DATABASE_URL);

  if (sql && hasNeonUrl) {
    try {
      const initResult = await initNeonDbTables();
      const testQueryResult = await sql`SELECT NOW() as current_server_time;`;

      return NextResponse.json({
        status: 'connected',
        driver: 'Neon Serverless PostgreSQL',
        databaseUrlConfigured: true,
        serverTime: testQueryResult[0]?.current_server_time,
        tableInit: initResult,
        memoryStoreStats: {
          users: memoryStore.users.length,
          hospitals: memoryStore.hospitals.length,
          shifts: memoryStore.shifts.length,
          credentials: memoryStore.credentials.length,
        },
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({
        status: 'error',
        driver: 'Neon Serverless PostgreSQL',
        databaseUrlConfigured: true,
        error: errorMsg,
        fallback: 'In-memory store is active for development.',
      });
    }
  }

  return NextResponse.json({
    status: 'in-memory-fallback',
    driver: 'High-Fidelity Memory & Mock Store',
    databaseUrlConfigured: false,
    message:
      'DATABASE_URL environment variable is not configured. Ready for Neon DB connection string.',
    memoryStoreStats: {
      users: memoryStore.users.length,
      hospitals: memoryStore.hospitals.length,
      shifts: memoryStore.shifts.length,
      credentials: memoryStore.credentials.length,
      orders: memoryStore.orders.length,
    },
  });
}
