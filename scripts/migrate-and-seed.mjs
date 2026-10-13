import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// Read .env.local manually
let connectionString = process.env.DATABASE_URL;
if (!connectionString && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      connectionString = trimmed.replace('DATABASE_URL=', '').replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!connectionString) {
  console.error('DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log('Connecting to Neon PostgreSQL...');
  const res = await sql`SELECT version(), NOW() as current_time;`;
  console.log('✓ Successfully connected to Neon DB!');
  console.log('PostgreSQL Version:', res[0].version.split(' ')[0], res[0].version.split(' ')[1]);
  console.log('Server Time:', res[0].current_time);

  console.log('\nCreating tables...');

  // 1. Users
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
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ mk_users ready');

  // 2. Hospitals
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
  console.log('✓ mk_hospitals ready');

  // 3. Shifts
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
  console.log('✓ mk_shifts ready');

  // 4. Credentials
  await sql`
    CREATE TABLE IF NOT EXISTS mk_credentials (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL,
      credential_type TEXT NOT NULL,
      council_name TEXT NOT NULL,
      registration_number TEXT NOT NULL,
      state TEXT NOT NULL,
      valid_upto DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED',
      signature_hash TEXT NOT NULL,
      tamper_flag BOOLEAN DEFAULT FALSE,
      issued_at DATE,
      revocation_reason TEXT
    );
  `;
  console.log('✓ mk_credentials ready');

  // 5. Appointments & Prescriptions
  await sql`
    CREATE TABLE IF NOT EXISTS mk_appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      patient_phone TEXT,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      doctor_specialty TEXT,
      scheduled_at TIMESTAMPTZ NOT NULL,
      symptoms TEXT,
      diagnosis_notes TEXT,
      status TEXT DEFAULT 'SCHEDULED',
      consultation_fee_inr INT DEFAULT 800,
      prescription_id TEXT
    );
  `;
  console.log('✓ mk_appointments ready');

  await sql`
    CREATE TABLE IF NOT EXISTS mk_prescriptions (
      id TEXT PRIMARY KEY,
      appointment_id TEXT,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      doctor_license TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      medicines JSONB NOT NULL,
      issued_date DATE DEFAULT CURRENT_DATE,
      verification_hash TEXT NOT NULL
    );
  `;
  console.log('✓ mk_prescriptions ready');

  // 6. Pharmacies & Orders
  await sql`
    CREATE TABLE IF NOT EXISTS mk_pharmacies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      license_number TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_registered BOOLEAN DEFAULT TRUE
    );
  `;
  console.log('✓ mk_pharmacies ready');

  await sql`
    CREATE TABLE IF NOT EXISTS mk_pharmacy_orders (
      id TEXT PRIMARY KEY,
      pharmacy_id TEXT NOT NULL,
      pharmacy_name TEXT NOT NULL,
      order_type TEXT NOT NULL,
      ordered_by TEXT NOT NULL,
      destination TEXT NOT NULL,
      items JSONB NOT NULL,
      total_inr INT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      ordered_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✓ mk_pharmacy_orders ready');

  // Check counts
  const userCount = await sql`SELECT count(*) FROM mk_users;`;
  console.log(`\nExisting records in Neon DB: ${userCount[0].count} users.`);

  if (Number(userCount[0].count) === 0) {
    console.log('Seeding initial data into Neon DB...');
    // Seed users
    await sql`
      INSERT INTO mk_users (id, full_name, email, phone, role, city, state, badge_level, specialty, sub_category, registration_number, council_name, verification_status, experience_years, hourly_rate_inr, total_shifts_completed, average_rating, wallet_balance_inr)
      VALUES 
        ('user-doc-1', 'Dr. Priya Sharma', 'priya.sharma@medkonect.in', '+91 98201 44521', 'doctor', 'Mumbai', 'Maharashtra', 'PRO', 'Critical Care & ICU', 'MD Anesthesiology / Intensivist', 'MMC-2018-09412', 'Maharashtra Medical Council (MMC)', 'VERIFIED', 8, 1500, 74, 4.95, 68000),
        ('user-doc-2', 'Dr. Rajesh Kumar', 'rajesh.kumar@medkonect.in', '+91 94440 22381', 'doctor', 'Chennai', 'Tamil Nadu', 'HIGH_RATED', 'General Medicine', 'MBBS, DNB Family Medicine', 'TNMC-2020-41029', 'Tamil Nadu Medical Council (TNMC)', 'VERIFIED', 5, 1000, 38, 4.82, 32000),
        ('user-doc-3', 'Dr. Vikram Seth', 'vikram.seth@medkonect.in', '+91 98801 11234', 'doctor', 'Bengaluru', 'Karnataka', 'STARTER', 'Orthopedic Surgery', 'MBBS, MS Orthopedics', 'KMC-2015-88319', 'Karnataka Medical Council (KMC)', 'REVOKED', 11, 1800, 12, 3.10, 0),
        ('user-nurse-1', 'Staff Nurse Ananya Das', 'ananya.das@medkonect.in', '+91 91672 88410', 'nurse', 'Mumbai', 'Maharashtra', 'PRO', 'Cardio-Thoracic & ICU', 'B.Sc Nursing, BLS/ACLS Certified', 'INC-MH-2021-9941', 'Maharashtra Nursing Council (MNC)', 'VERIFIED', 6, 650, 86, 4.96, 41500),
        ('user-tech-1', 'Amit Verma', 'amit.verma@medkonect.in', '+91 98231 66723', 'technician', 'Pune', 'Maharashtra', 'PRO', 'Pathology & Blood Bank', 'B.Sc MLT, NABH Quality Certified', 'MAH-AHP-2019-332', 'Allied & Healthcare Council', 'VERIFIED', 7, 450, 62, 4.90, 26000),
        ('user-supp-1', 'Ramesh Pawar', 'ramesh.pawar@medkonect.in', '+91 97654 32190', 'support_staff', 'Mumbai', 'Maharashtra', 'PRO', 'Patient Care Attendant', 'Senior ICU Ward Boy & Patient Transfer', 'VERIFIED-ID-MH-7712', 'MedKonect Verified Police & Hospital Clearance', 'VERIFIED', 9, 300, 110, 4.98, 33000),
        ('user-patient-1', 'Rohan Iyer', 'rohan.iyer@gmail.com', '+91 98410 77654', 'patient', 'Chennai', 'Tamil Nadu', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 5.0, 5000),
        ('user-admin-apollo', 'Dr. Sundaram Raman (Medical Director)', 'admin.apollo@medkonect.in', '+91 98400 99881', 'hospital_admin', 'Chennai', 'Tamil Nadu', NULL, NULL, NULL, NULL, NULL, NULL, 20, 0, 0, 5.0, 0);
    `;

    // Seed Hospitals
    await sql`
      INSERT INTO mk_hospitals (id, name, city, state, address, nabh_accredited, affiliation_status, total_beds, admin_user_id)
      VALUES
        ('hosp-1', 'Apollo Speciality Hospital', 'Chennai', 'Tamil Nadu', '21 Greams Lane, Thousand Lights, Chennai', TRUE, 'ACTIVE', 550, 'user-admin-apollo'),
        ('hosp-2', 'Fortis Memorial Hospital', 'Mumbai', 'Maharashtra', 'Mulund Goregaon Link Rd, Bhandup West, Mumbai', TRUE, 'ACTIVE', 320, 'user-admin-fortis'),
        ('hosp-3', 'Manipal Hospital', 'Bengaluru', 'Karnataka', '98 HAL Old Airport Rd, Kodihalli, Bengaluru', TRUE, 'ACTIVE', 600, 'user-admin-manipal'),
        ('hosp-4', 'K.E.M. Memorial Hospital', 'Pune', 'Maharashtra', '489 Rasta Peth, Sardar Moodliar Rd, Pune', TRUE, 'ACTIVE', 450, 'user-admin-kem');
    `;

    // Seed Shifts
    await sql`
      INSERT INTO mk_shifts (id, hospital_id, hospital_name, hospital_city, role_required, specialty, title, description, start_time, end_time, pay_rate_inr, escrow_funded, status, urgency)
      VALUES
        ('shift-1', 'hosp-2', 'Fortis Memorial Hospital', 'Mumbai', 'doctor', 'Critical Care & ICU', 'Urgent Night ICU Intensivist (12 Hours)', 'Lead nocturnal coverage in 24-bed medical ICU. Must be proficient in central lines and mechanical ventilation.', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 18000, TRUE, 'OPEN', 'EMERGENCY_ICU'),
        ('shift-2', 'hosp-1', 'Apollo Speciality Hospital', 'Chennai', 'nurse', 'Cardio-Thoracic & ICU', 'Senior Cardiac Recovery Nurse (Day Shift)', 'Post-CABG and valve replacement recovery monitoring. Arterial line monitoring and inotrope titrations.', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 5200, TRUE, 'OPEN', 'HIGH'),
        ('shift-3', 'hosp-4', 'K.E.M. Memorial Hospital', 'Pune', 'technician', 'Pathology & Blood Bank', 'Blood Bank Cross-Matching Technician', 'Immediate cross-matching, apheresis unit maintenance and component separation for elective surgeries.', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 3600, TRUE, 'OPEN', 'NORMAL');
    `;

    // Seed Credentials
    await sql`
      INSERT INTO mk_credentials (id, user_id, user_name, role, credential_type, council_name, registration_number, state, valid_upto, verification_status, signature_hash, issued_at)
      VALUES
        ('cred-1', 'user-doc-1', 'Dr. Priya Sharma', 'doctor', 'NMC_LICENSE', 'Maharashtra Medical Council (MMC)', 'MMC-2018-09412', 'Maharashtra', '2029-12-31', 'VERIFIED', '7b4e9f2a01d5c883e1f04b2c99d0e123', '2018-08-15'),
        ('cred-2', 'user-doc-2', 'Dr. Rajesh Kumar', 'doctor', 'NMC_LICENSE', 'Tamil Nadu Medical Council (TNMC)', 'TNMC-2020-41029', 'Tamil Nadu', '2030-05-15', 'VERIFIED', '1c8e77a201b5d992f0a15c3d88e1f456', '2020-05-20'),
        ('cred-3', 'user-doc-3', 'Dr. Vikram Seth', 'doctor', 'NMC_LICENSE', 'Karnataka Medical Council (KMC)', 'KMC-2015-88319', 'Karnataka', '2026-10-10', 'REVOKED', '3d9f88b312c6e003a1b26d4e99f2a789', '2015-06-10');
    `;

    // Seed Pharmacies
    await sql`
      INSERT INTO mk_pharmacies (id, name, owner_name, license_number, city, state, address, phone, is_registered)
      VALUES
        ('pharma-1', 'Apollo Pharmacy Express', 'K. Balaji (Reg. Pharmacist)', 'TN-CHE-20B-99812', 'Chennai', 'Tamil Nadu', 'Shop 4, Greams Road, Thousand Lights, Chennai', '+91 44 2829 0200', TRUE),
        ('pharma-2', 'MedPlus Health Services', 'Sunil Rao', 'MH-MUM-21B-44109', 'Mumbai', 'Maharashtra', 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai', '+91 22 2640 1234', TRUE);
    `;

    console.log('✓ Initial data successfully seeded into Neon DB!');
  }

  const finalCheck = await sql`
    SELECT 
      (SELECT count(*) FROM mk_users) as users,
      (SELECT count(*) FROM mk_hospitals) as hospitals,
      (SELECT count(*) FROM mk_shifts) as shifts,
      (SELECT count(*) FROM mk_credentials) as credentials,
      (SELECT count(*) FROM mk_pharmacies) as pharmacies;
  `;
  console.log('\nFinal Neon Database Table Counts:');
  console.log(finalCheck[0]);
}

main().catch((err) => {
  console.error('Database migration/seed error:', err);
  process.exit(1);
});
