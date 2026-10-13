# MedKonect (India) 🩺🏥

> **The Unified Indian Healthcare Operating System & Talent-to-Care Marketplace**  
> Verified Healthcare Professionals (Doctors, Nurses, Technicians, Ward Staff), Affiliated Hospitals, Escrow Shift Payouts, Telecare Diagnosis & B2B/B2C Pharmacy Procurement.

---

## 🌟 Key Highlights

1. **Healthcare Talent Marketplace (All Hospital Roles)**:
   - **Doctors (MBBS, MD, Specialists)**: Verified via National Medical Commission (NMC) & State Medical Councils (MMC, TNMC, KMC, DMC).
   - **Nurses (B.Sc, GNM, ICU)**: Verified via Indian Nursing Council (INC) & State Nursing Councils.
   - **Technicians**: Pathology Lab, CT/MRI, OT & Blood Bank Technicians verified via Degree/Experience certificates.
   - **Support & Non-Medical**: Patient Care Attendants (Ward Boys/Ayahs), Hospital Admin, Billing Clerks, and Housekeeping verified with Govt ID & past hospital clearances.
2. **Escrow Shift Vault & "Pro Badge" Reputation Engine**:
   - Hospitals lock shift funds (₹ INR) into escrow upon posting.
   - Workers report to hospital gates and check-in via QR / GPS.
   - Post-duty, hospital management approves the shift with 1–5 star ratings and clinical feedback.
   - Funds disburse directly to the worker's wallet/UPI account, leveling them up toward the prestigious **MedKonect PRO Badge** (higher pay, priority assignments).
3. **Council & Public Tamper-Evident Verifier**:
   - Zero-login public verifier checks doctor/nurse credentials against cryptographic signatures.
   - Real-time license revocation propagates immediately across all hospitals in India.
   - Shift contracts and attestations are chained using SHA-256 tamper-evident hash chains.
4. **Patient Telecare & Diagnosis Hub**:
   - Patients consult verified doctors and receive preliminary clinical impressions and tamper-evident e-prescriptions.
5. **Registered Pharmacy Supply Chain**:
   - B2B emergency medicine restocking for hospital ICUs and central stores.
   - Direct doorstep prescription fulfillment for patients.

---

## 🚀 Quick Start

### 1. Run Locally

```bash
# Clone or open directory
cd Medkonect

# Install dependencies (already installed)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Neon DB Configuration (PostgreSQL)

MedKonect is pre-configured with `@neondatabase/serverless` for instant connection pooling with zero cold starts.

1. Create a free PostgreSQL database at [Neon Console](https://console.neon.tech).
2. Create `.env.local` in the project root:
   ```env
   DATABASE_URL=postgres://username:password@ep-xyz-123.ap-southeast-1.aws.neon.tech/medkonect?sslmode=require
   ```
3. Visit [http://localhost:3000/api/db-status](http://localhost:3000/api/db-status) to verify connection health and auto-table initialization.
*(Note: If `DATABASE_URL` is omitted, the app runs on a resilient high-fidelity in-memory store so you can demo immediately!)*

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub / GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Add the `DATABASE_URL` environment variable in Vercel Project Settings.
4. Click **Deploy**. Vercel will automatically build the Next.js App Router and deploy serverless functions globally.

---

## 🎭 Interactive Demo Personas

Use the **Persona Switcher** in the top navigation to test all perspectives:
* **Dr. Priya Sharma** (Doctor PRO · Critical Care ICU)
* **Dr. Vikram Seth** (Suspended Doctor for Council Revocation demonstration)
* **Staff Nurse Ananya Das** (Nurse PRO · Cardio-Thoracic ICU)
* **Amit Verma** (Technician PRO · Blood Bank / Pathology)
* **Ramesh Pawar** (Support Staff PRO · Senior ICU Ward Attendant)
* **Apollo & Fortis Medical Directors** (Hospital Admin)
* **Rohan Iyer** (Patient Telecare)
* **K. Balaji** (Registered Pharmacist)
