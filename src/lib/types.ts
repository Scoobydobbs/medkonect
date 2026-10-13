export type UserRole =
  | 'doctor'
  | 'nurse'
  | 'technician'
  | 'support_staff'
  | 'hospital_admin'
  | 'patient'
  | 'pharmacy'
  | 'council_admin';

export type BadgeLevel = 'STARTER' | 'FAVORITE' | 'HIGH_RATED' | 'PRO';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city: string;
  state: string;
  badgeLevel?: BadgeLevel;
  specialty?: string;
  subCategory?: string;
  registrationNumber?: string;
  councilName?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REVOKED' | 'REJECTED';
  experienceYears?: number;
  hourlyRateInr?: number;
  totalShiftsCompleted?: number;
  averageRating?: number;
  walletBalanceInr?: number;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  nabhAccredited: boolean;
  affiliationStatus: 'ACTIVE' | 'PENDING';
  totalBeds: number;
  adminUserId: string;
}

export type ShiftStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Shift {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCity: string;
  roleRequired: UserRole;
  specialty: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  payRateInr: number;
  escrowFunded: boolean;
  status: ShiftStatus;
  urgency: 'NORMAL' | 'HIGH' | 'EMERGENCY_ICU';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  contractHash?: string;
  hospitalRating?: number;
  hospitalFeedback?: string;
  payoutStatus?: 'ESCROW_HELD' | 'APPROVED' | 'DISBURSED';
}

export interface CredentialRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  credentialType: 'NMC_LICENSE' | 'INC_LICENSE' | 'EXPERIENCE_CERT' | 'ALLIED_DIPLOMA';
  councilName: string;
  registrationNumber: string;
  state: string;
  validUpto: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REVOKED';
  signatureHash: string;
  tamperFlag?: boolean;
  issuedAt: string;
  revocationReason?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  scheduledAt: string;
  symptoms: string;
  diagnosisNotes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  consultationFeeInr: number;
  prescriptionId?: string;
}

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  medicines: MedicineItem[];
  diagnosis: string;
  issuedDate: string;
  pharmacyOrderId?: string;
  verificationHash: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  ownerName: string;
  licenseNumber: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  isRegistered: boolean;
}

export interface PharmacyOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  orderType: 'PATIENT_PRESCRIPTION' | 'HOSPITAL_B2B_RESTOCK';
  orderedBy: string;
  destinationHospitalOrPatient: string;
  items: { name: string; quantity: number; unitPriceInr: number }[];
  totalInr: number;
  status: 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED';
  orderedAt: string;
}
