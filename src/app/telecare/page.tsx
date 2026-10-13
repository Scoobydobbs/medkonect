'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MedicineItem, User } from '@/lib/types';
import { ProBadgePill } from '@/components/ProBadgePill';
import {
  Video,
  FileText,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Pill,
  Send,
  PlusCircle,
  Trash2,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function TelecarePage() {
  const {
    currentUser,
    allUsers,
    appointments,
    prescriptions,
    bookAppointment,
    issuePrescription,
    createPharmacyOrder,
    pharmacies,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'patient_view' | 'doctor_view'>('patient_view');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('user-doc-1');
  const [symptomsInput, setSymptomsInput] = useState<string>('Mild shortness of breath and fever (100°F) for past 2 days.');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Doctor prescribing state
  const [selectedApptId, setSelectedApptId] = useState<string>(appointments[0]?.id || '');
  const [diagnosisInput, setDiagnosisInput] = useState<string>('Mild upper respiratory tract infection with viral bronchitis.');
  const [prescMedicines, setPrescMedicines] = useState<MedicineItem[]>([
    {
      name: 'Paracetamol 650mg (Dolo 650)',
      dosage: '1 Tab',
      frequency: 'TDS (Thrice daily)',
      durationDays: 5,
      instructions: 'Take after food',
    },
    {
      name: 'Azithromycin 500mg',
      dosage: '1 Tab',
      frequency: 'OD (Once daily)',
      durationDays: 3,
      instructions: 'Complete 3 day course after lunch',
    },
  ]);

  const verifiedDoctors = allUsers.filter(
    (u) => u.role === 'doctor' && u.verificationStatus === 'VERIFIED'
  );

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = verifiedDoctors.find((d) => d.id === selectedDoctorId);
    if (!doc) return;

    const newAppt = bookAppointment(doc, symptomsInput);
    setBookingSuccess(`Appointment booked successfully with ${doc.fullName} for ₹${newAppt.consultationFeeInr}!`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const handleAddMedicineRow = () => {
    setPrescMedicines([
      ...prescMedicines,
      {
        name: 'Pantoprazole 40mg (Pan 40)',
        dosage: '1 Tab',
        frequency: 'OD (Before breakfast)',
        durationDays: 5,
        instructions: 'Take empty stomach',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setPrescMedicines(prescMedicines.filter((_, i) => i !== index));
  };

  const handleIssuePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptId) return;

    issuePrescription(selectedApptId, diagnosisInput, prescMedicines);
    alert('Cryptographically signed e-prescription issued successfully!');
  };

  const handleRouteToPharmacy = (prescId: string) => {
    const p = prescriptions.find((pr) => pr.id === prescId);
    if (!p) return;

    createPharmacyOrder({
      pharmacyId: pharmacies[0].id,
      pharmacyName: pharmacies[0].name,
      orderType: 'PATIENT_PRESCRIPTION',
      orderedBy: `${p.patientName} (via MedKonect Rx)`,
      destinationHospitalOrPatient: 'Doorstep Patient Delivery, Chennai',
      items: p.medicines.map((m) => ({
        name: m.name,
        quantity: 1,
        unitPriceInr: 95,
      })),
      totalInr: p.medicines.length * 95,
    });

    alert(`Prescription routed to ${pharmacies[0].name}! Delivery dispatched.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>Digital Clinical Care Delivery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Patient Telecare, Diagnosis & E-Prescriptions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consult verified NMC doctors, obtain preliminary clinical diagnosis, and get tamper-evident digital prescriptions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('patient_view')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'patient_view'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Patient Consultation Booking
          </button>
          <button
            onClick={() => setActiveTab('doctor_view')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'doctor_view'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Doctor Clinical Portal
          </button>
        </div>
      </div>

      {activeTab === 'patient_view' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Book Doctor Consultation</span>
              </h2>
              <p className="text-xs text-slate-500">
                All doctors on MedKonect have active, council-verified registration credentials.
              </p>

              {bookingSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Select Verified Doctor
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  >
                    {verifiedDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.fullName} ({doc.specialty}) · ₹{doc.hourlyRateInr || 800}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Describe Symptoms / Concern
                  </label>
                  <textarea
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Confirm & Schedule Video Visit
                </button>
              </form>
            </div>
          </div>

          {/* Active Appointments & Live Video Consultations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Scheduled Telecare Appointments</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {appointments.length} Visits
                </span>
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {appt.doctorName}
                        </span>
                        <span className="text-xs text-slate-400">({appt.doctorSpecialty})</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Patient: <strong>{appt.patientName}</strong> · Symptoms: {appt.symptoms}
                      </p>
                    </div>

                    <a
                      href={`/telecare/room/${appt.id}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Enter Live Video Room
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions & Consultation History */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Digital E-Prescriptions & Clinical Diagnoses</span>
              </h2>

              <div className="space-y-4">
              {prescriptions.map((presc) => (
                <div
                  key={presc.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          {presc.doctorName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {presc.doctorLicense}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Patient: {presc.patientName} · Date: {presc.issuedDate}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRouteToPharmacy(presc.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      Fulfill via Partner Pharmacy
                    </button>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/50 text-xs">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">
                      Clinical Diagnosis / Impression:
                    </span>
                    <span className="text-purple-800 dark:text-purple-200">{presc.diagnosis}</span>
                  </div>

                  {/* Medicines Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Prescribed Medications:
                    </span>
                    <div className="space-y-2">
                      {presc.medicines.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {med.name}
                            </span>
                            <span className="text-slate-500 text-[11px] block mt-0.5">
                              {med.dosage} · {med.frequency} · {med.durationDays} Days
                            </span>
                          </div>
                          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                            {med.instructions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proof Hash */}
                  <div className="font-mono text-[10px] text-slate-400 break-all pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Rx Tamper-Proof Hash: {presc.verificationHash}</span>
                    <span className="text-emerald-600 font-sans font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Valid E-Signature
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* Doctor Clinical Prescribing View */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Doctor Clinical Consultation & E-Prescribing Terminal
            </h2>
            <p className="text-xs text-slate-500">
              Review patient symptoms, formulate diagnosis, and digitally sign e-prescriptions.
            </p>
          </div>

          <form onSubmit={handleIssuePrescriptionSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Select Patient Appointment
                </label>
                <select
                  value={selectedApptId}
                  onChange={(e) => setSelectedApptId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.patientName} ({a.symptoms.substring(0, 35)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Clinical Impression / Diagnosis
                </label>
                <input
                  type="text"
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  required
                />
              </div>
            </div>

            {/* Dynamic Medication List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Prescribed Medication List
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Medication
                </button>
              </div>

              {prescMedicines.map((med, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                >
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => {
                      const updated = [...prescMedicines];
                      updated[idx].name = e.target.value;
                      setPrescMedicines(updated);
                    }}
                    placeholder="Medicine Name"
                    className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => {
                      const updated = [...prescMedicines];
                      updated[idx].frequency = e.target.value;
                      setPrescMedicines(updated);
                    }}
                    placeholder="Frequency"
                    className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) => {
                      const updated = [...prescMedicines];
                      updated[idx].instructions = e.target.value;
                      setPrescMedicines(updated);
                    }}
                    placeholder="Instructions"
                    className="px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium"
                  />
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicineRow(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Sign & Issue Tamper-Evident E-Prescription
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
