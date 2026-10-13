'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Hospital,
  Shift,
  CredentialRecord,
  Appointment,
  Prescription,
  Pharmacy,
  PharmacyOrder,
} from '@/lib/types';
import {
  initialUsers,
  initialHospitals,
  initialShifts,
  initialCredentials,
  initialAppointments,
  initialPrescriptions,
  initialPharmacies,
  initialOrders,
} from '@/lib/mock-data';
import { generateHash } from '@/lib/crypto';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  hospitals: Hospital[];
  shifts: Shift[];
  credentials: CredentialRecord[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  pharmacies: Pharmacy[];
  orders: PharmacyOrder[];
  // Actions
  applyForShift: (shiftId: string) => { success: boolean; message: string };
  checkInShift: (shiftId: string) => void;
  checkOutShift: (shiftId: string) => void;
  requestShiftReplacement: (shiftId: string, reason: string) => void;
  approveShiftPayout: (shiftId: string, rating: number, feedback: string) => void;
  postShift: (shiftData: Omit<Shift, 'id' | 'status' | 'escrowFunded'>) => void;
  revokeCredential: (credId: string, reason: string) => void;
  verifyCredentialDirect: (credId: string) => void;
  tamperContract: (shiftId: string) => void;
  bookAppointment: (doctor: User, symptoms: string) => Appointment;
  issuePrescription: (appointmentId: string, diagnosis: string, medicines: Prescription['medicines']) => void;
  createPharmacyOrder: (order: Omit<PharmacyOrder, 'id' | 'status' | 'orderedAt'>) => void;
  updateOrderStatus: (orderId: string, status: PharmacyOrder['status']) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default: Dr. Priya Sharma
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [credentials, setCredentials] = useState<CredentialRecord[]>(initialCredentials);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [orders, setOrders] = useState<PharmacyOrder[]>(initialOrders);

  // Sync current user when allUsers changes
  useEffect(() => {
    const updated = allUsers.find((u) => u.id === currentUser.id);
    if (updated) setCurrentUser(updated);
  }, [allUsers, currentUser.id]);

  const applyForShift = (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return { success: false, message: 'Shift not found' };

    // Validation check: Worker credentials
    const workerCred = credentials.find((c) => c.userId === currentUser.id);
    if (workerCred && workerCred.verificationStatus === 'REVOKED') {
      return {
        success: false,
        message: 'Application rejected: Your medical credential has been REVOKED by the Council.',
      };
    }

    if (currentUser.verificationStatus === 'REVOKED') {
      return {
        success: false,
        message: 'Application rejected: Your medical registration has been revoked.',
      };
    }

    // Assign worker
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'ASSIGNED',
              assignedWorkerId: currentUser.id,
              assignedWorkerName: currentUser.fullName,
            }
          : s
      )
    );
    return { success: true, message: `Successfully matched & applied for ${shift.title}!` };
  };

  const checkInShift = (shiftId: string) => {
    const now = new Date().toISOString();
    const contractHash = generateHash({
      shiftId,
      workerId: currentUser.id,
      timestamp: now,
      role: currentUser.role,
    });

    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'IN_PROGRESS',
              checkInTime: now,
              contractHash,
            }
          : s
      )
    );
  };

  const checkOutShift = (shiftId: string) => {
    const now = new Date().toISOString();
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'COMPLETED',
              checkOutTime: now,
              payoutStatus: 'ESCROW_HELD',
            }
          : s
      )
    );
  };

  const requestShiftReplacement = (shiftId: string, reason: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'OPEN',
              urgency: 'HIGH',
              title: `${s.title} [URGENT REPLACEMENT NEEDED]`,
              description: `Previous practitioner requested replacement: "${reason}". Immediate coverage required.`,
              assignedWorkerId: undefined,
              assignedWorkerName: undefined,
              checkInTime: undefined,
              contractHash: undefined,
            }
          : s
      )
    );
  };

  const approveShiftPayout = (shiftId: string, rating: number, feedback: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift || !shift.assignedWorkerId) return;

    const workerId = shift.assignedWorkerId;
    const payoutAmount = shift.payRateInr;

    // 1. Update Shift payout status
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'COMPLETED',
              payoutStatus: 'DISBURSED',
              hospitalRating: rating,
              hospitalFeedback: feedback,
            }
          : s
      )
    );

    // 2. Credit worker's wallet, update shift count and recalculate Pro Badge
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === workerId) {
          const totalShifts = (u.totalShiftsCompleted || 0) + 1;
          const currentAvg = u.averageRating || 5.0;
          const newAvg = Number(((currentAvg * (totalShifts - 1) + rating) / totalShifts).toFixed(2));
          const currentBal = u.walletBalanceInr || 0;

          // Compute Pro Badge level
          let badge: User['badgeLevel'] = 'STARTER';
          if (totalShifts >= 50 && newAvg >= 4.8) {
            badge = 'PRO';
          } else if (totalShifts >= 25 && newAvg >= 4.6) {
            badge = 'HIGH_RATED';
          } else if (totalShifts >= 10 && newAvg >= 4.4) {
            badge = 'FAVORITE';
          }

          return {
            ...u,
            totalShiftsCompleted: totalShifts,
            averageRating: newAvg,
            badgeLevel: badge,
            walletBalanceInr: currentBal + payoutAmount,
          };
        }
        return u;
      })
    );
  };

  const postShift = (shiftData: Omit<Shift, 'id' | 'status' | 'escrowFunded'>) => {
    const newShift: Shift = {
      ...shiftData,
      id: `shift-${Date.now()}`,
      status: 'OPEN',
      escrowFunded: true,
    };
    setShifts((prev) => [newShift, ...prev]);
  };

  const revokeCredential = (credId: string, reason: string) => {
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === credId
          ? {
              ...c,
              verificationStatus: 'REVOKED',
              revocationReason: reason,
            }
          : c
      )
    );

    const cred = credentials.find((c) => c.id === credId);
    if (cred) {
      setAllUsers((prev) =>
        prev.map((u) => (u.id === cred.userId ? { ...u, verificationStatus: 'REVOKED' } : u))
      );
    }
  };

  const verifyCredentialDirect = (credId: string) => {
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === credId
          ? {
              ...c,
              verificationStatus: 'VERIFIED',
              tamperFlag: false,
              revocationReason: undefined,
            }
          : c
      )
    );

    const cred = credentials.find((c) => c.id === credId);
    if (cred) {
      setAllUsers((prev) =>
        prev.map((u) => (u.id === cred.userId ? { ...u, verificationStatus: 'VERIFIED' } : u))
      );
    }
  };

  const tamperContract = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              contractHash: 'TAMPERED_000000000000000000000000000000000000000000000000000000',
            }
          : s
      )
    );
  };

  const bookAppointment = (doctor: User, symptoms: string): Appointment => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.fullName,
      patientPhone: currentUser.phone,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty || 'General Medicine',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      symptoms,
      status: 'SCHEDULED',
      consultationFeeInr: doctor.hourlyRateInr || 800,
    };
    setAppointments((prev) => [newAppt, ...prev]);
    return newAppt;
  };

  const issuePrescription = (
    appointmentId: string,
    diagnosis: string,
    medicines: Prescription['medicines']
  ) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    const newPresc: Prescription = {
      id: `presc-${Date.now()}`,
      appointmentId,
      patientId: appt ? appt.patientId : 'user-patient-1',
      patientName: appt ? appt.patientName : 'Patient',
      doctorId: currentUser.id,
      doctorName: currentUser.fullName,
      doctorLicense: currentUser.registrationNumber || 'NMC-VERIFIED',
      diagnosis,
      medicines,
      issuedDate: new Date().toISOString().split('T')[0],
      verificationHash: generateHash({
        appointmentId,
        doctor: currentUser.fullName,
        diagnosis,
        time: Date.now(),
      }),
    };

    setPrescriptions((prev) => [newPresc, ...prev]);
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'COMPLETED', prescriptionId: newPresc.id } : a))
    );
  };

  const createPharmacyOrder = (orderData: Omit<PharmacyOrder, 'id' | 'status' | 'orderedAt'>) => {
    const newOrder: PharmacyOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      status: 'PENDING',
      orderedAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: PharmacyOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const resetAllData = () => {
    setAllUsers(JSON.parse(JSON.stringify(initialUsers)));
    setCurrentUser(initialUsers[0]);
    setHospitals(JSON.parse(JSON.stringify(initialHospitals)));
    setShifts(JSON.parse(JSON.stringify(initialShifts)));
    setCredentials(JSON.parse(JSON.stringify(initialCredentials)));
    setAppointments(JSON.parse(JSON.stringify(initialAppointments)));
    setPrescriptions(JSON.parse(JSON.stringify(initialPrescriptions)));
    setPharmacies(JSON.parse(JSON.stringify(initialPharmacies)));
    setOrders(JSON.parse(JSON.stringify(initialOrders)));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        hospitals,
        shifts,
        credentials,
        appointments,
        prescriptions,
        pharmacies,
        orders,
        applyForShift,
        checkInShift,
        checkOutShift,
        requestShiftReplacement,
        approveShiftPayout,
        postShift,
        revokeCredential,
        verifyCredentialDirect,
        tamperContract,
        bookAppointment,
        issuePrescription,
        createPharmacyOrder,
        updateOrderStatus,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
