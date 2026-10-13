import { neon } from '@neondatabase/serverless';
import {
  initialHospitals,
  initialUsers,
  initialCredentials,
  initialShifts,
  initialAppointments,
  initialPrescriptions,
  initialPharmacies,
  initialOrders,
} from './mock-data';
import {
  User,
  Hospital,
  Shift,
  CredentialRecord,
  Appointment,
  Prescription,
  Pharmacy,
  PharmacyOrder,
} from './types';

// In-memory persistent store for development & instant demo fallback
class InMemoryStore {
  hospitals: Hospital[] = [...initialHospitals];
  users: User[] = [...initialUsers];
  credentials: CredentialRecord[] = [...initialCredentials];
  shifts: Shift[] = [...initialShifts];
  appointments: Appointment[] = [...initialAppointments];
  prescriptions: Prescription[] = [...initialPrescriptions];
  pharmacies: Pharmacy[] = [...initialPharmacies];
  orders: PharmacyOrder[] = [...initialOrders];

  reset() {
    this.hospitals = JSON.parse(JSON.stringify(initialHospitals));
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.credentials = JSON.parse(JSON.stringify(initialCredentials));
    this.shifts = JSON.parse(JSON.stringify(initialShifts));
    this.appointments = JSON.parse(JSON.stringify(initialAppointments));
    this.prescriptions = JSON.parse(JSON.stringify(initialPrescriptions));
    this.pharmacies = JSON.parse(JSON.stringify(initialPharmacies));
    this.orders = JSON.parse(JSON.stringify(initialOrders));
  }
}

// Global singleton across serverless invocations / hot reloads in dev
const globalForStore = globalThis as unknown as { medkonectStore?: InMemoryStore };
export const memoryStore = globalForStore.medkonectStore ?? new InMemoryStore();
if (process.env.NODE_ENV !== 'production') globalForStore.medkonectStore = memoryStore;

/**
 * Returns a Neon SQL executor if DATABASE_URL is configured
 */
export function getNeonSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

/**
 * Initializes Neon DB tables if not present
 */
export async function initNeonDbTables() {
  const sql = getNeonSql();
  if (!sql) return { status: 'in-memory-fallback', message: 'DATABASE_URL not set; using high-fidelity in-memory store.' };

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS mk_users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        role TEXT NOT NULL,
        city TEXT,
        state TEXT,
        badge_level TEXT,
        specialty TEXT,
        sub_category TEXT,
        registration_number TEXT,
        council_name TEXT,
        verification_status TEXT,
        experience_years INT,
        hourly_rate_inr INT,
        total_shifts_completed INT DEFAULT 0,
        average_rating NUMERIC(3, 2) DEFAULT 5.0,
        wallet_balance_inr INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mk_hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        address TEXT NOT NULL,
        nabh_accredited BOOLEAN DEFAULT FALSE,
        affiliation_status TEXT DEFAULT 'ACTIVE',
        total_beds INT DEFAULT 100,
        admin_user_id TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mk_shifts (
        id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        hospital_name TEXT NOT NULL,
        hospital_city TEXT NOT NULL,
        role_required TEXT NOT NULL,
        specialty TEXT,
        title TEXT NOT NULL,
        description TEXT,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        pay_rate_inr INT NOT NULL,
        escrow_funded BOOLEAN DEFAULT TRUE,
        status TEXT DEFAULT 'OPEN',
        urgency TEXT DEFAULT 'NORMAL',
        assigned_worker_id TEXT,
        assigned_worker_name TEXT,
        check_in_time TIMESTAMPTZ,
        check_out_time TIMESTAMPTZ,
        contract_hash TEXT,
        hospital_rating INT,
        hospital_feedback TEXT,
        payout_status TEXT DEFAULT 'ESCROW_HELD'
      );
    `;

    return { status: 'connected', message: 'Neon DB tables checked & initialized successfully.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Neon DB initialization error:', errorMsg);
    return { status: 'error', error: errorMsg };
  }
}
