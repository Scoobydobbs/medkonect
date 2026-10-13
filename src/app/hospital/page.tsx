'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProBadgePill } from '@/components/ProBadgePill';
import { Shift, UserRole } from '@/lib/types';
import {
  Building2,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  Star,
  Users,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function HospitalPortalPage() {
  const {
    hospitals,
    shifts,
    allUsers,
    credentials,
    postShift,
    approveShiftPayout,
  } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[1].id); // Fortis Mumbai default
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<Shift | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('Punctual, professional, and handled clinical duties flawlessly.');

  // Form state for new shift
  const [newRole, setNewRole] = useState<UserRole>('doctor');
  const [newSpecialty, setNewSpecialty] = useState<string>('Critical Care & ICU');
  const [newTitle, setNewTitle] = useState<string>('Senior ICU Night Intensivist');
  const [newDesc, setNewDesc] = useState<string>('Need emergency nocturnal intensivist for 20-bed ICU.');
  const [newPayRate, setNewPayRate] = useState<number>(15000);
  const [newUrgency, setNewUrgency] = useState<'NORMAL' | 'HIGH' | 'EMERGENCY_ICU'>('HIGH');

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const hospitalShifts = shifts.filter((s) => s.hospitalId === selectedHospitalId);

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const startTime = new Date(now.getTime() + 12 * 3600000).toISOString();
    const endTime = new Date(now.getTime() + 24 * 3600000).toISOString();

    postShift({
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      hospitalCity: currentHospital.city,
      roleRequired: newRole,
      specialty: newSpecialty,
      title: newTitle,
      description: newDesc,
      startTime,
      endTime,
      payRateInr: Number(newPayRate),
      urgency: newUrgency,
    });

    setShowPostModal(false);
  };

  const handleApproveAndPay = () => {
    if (!showRatingModal) return;
    approveShiftPayout(showRatingModal.id, ratingScore, feedbackText);
    setShowRatingModal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Affiliated Healthcare Institution Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentHospital.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentHospital.address} · {currentHospital.city}, {currentHospital.state}</span>
            {currentHospital.nabhAccredited && (
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                NABH Accredited
              </span>
            )}
          </p>
        </div>

        {/* Hospital Switcher & Post Shift button */}
        <div className="flex items-center gap-3">
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Shift
          </button>
        </div>
      </div>

      {/* Hospital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase">Hospital Bed Capacity</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {currentHospital.totalBeds} Beds
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">Affiliated & Verified Partner</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Shift Roster</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {hospitalShifts.filter((s) => s.status !== 'COMPLETED').length} Shifts
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Escrow deposits auto-secured
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase">Escrow Locked Funds</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹
            {hospitalShifts
              .filter((s) => s.escrowFunded && s.status !== 'COMPLETED')
              .reduce((acc, s) => acc + s.payRateInr, 0)
              .toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Protected in Escrow Vault</div>
        </div>
      </div>

      {/* Shifts Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Hospital Shift Roster</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {hospitalShifts.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {hospitalShifts.map((shift) => {
            // Find applicants or candidate matches
            const matchingCandidates = allUsers.filter((u) => u.role === shift.roleRequired);

            return (
              <div
                key={shift.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md">
                        {shift.roleRequired.replace('_', ' ')}
                      </span>
                      {shift.urgency === 'EMERGENCY_ICU' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Emergency ICU
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          shift.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : shift.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : shift.status === 'ASSIGNED'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {shift.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {shift.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {shift.specialty} · {shift.description}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ₹{shift.payRateInr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{shift.escrowFunded ? 'Escrow Secured' : 'Unfunded'}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned worker info if assigned */}
                {shift.assignedWorkerId && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                        {shift.assignedWorkerName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{shift.assignedWorkerName}</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-semibold">
                            Reported & Assigned
                          </span>
                        </div>
                        {shift.contractHash && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                            Hash: {shift.contractHash.substring(0, 28)}...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {shift.status === 'IN_PROGRESS' || shift.status === 'ASSIGNED' ? (
                        <button
                          onClick={() => setShowRatingModal(shift)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Duty & Disburse Escrow
                        </button>
                      ) : shift.status === 'COMPLETED' ? (
                        <div className="text-xs text-right">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{shift.hospitalRating} / 5 Stars Given</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Escrow Disbursed</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Candidate Matching List for OPEN shifts */}
                {shift.status === 'OPEN' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Explainable Candidate Matching Engine</span>
                    </div>

                    <div className="space-y-2">
                      {matchingCandidates.map((candidate) => {
                        const cred = credentials.find((c) => c.userId === candidate.id);
                        const isRevoked = cred?.verificationStatus === 'REVOKED' || candidate.verificationStatus === 'REVOKED';

                        return (
                          <div
                            key={candidate.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                              isRevoked
                                ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/40 opacity-75'
                                : 'bg-slate-50/50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {candidate.fullName}
                                </span>
                                {candidate.badgeLevel && (
                                  <ProBadgePill level={candidate.badgeLevel} size="sm" />
                                )}
                                <span className="text-slate-400">· {candidate.city}</span>
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                {candidate.specialty} · {candidate.experienceYears} Years Exp ·{' '}
                                <span className="text-amber-500 font-semibold">
                                  ★ {candidate.averageRating}
                                </span>{' '}
                                ({candidate.totalShiftsCompleted} shifts)
                              </div>

                              {/* Explainable Matching Reason */}
                              {isRevoked ? (
                                <div className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>
                                    EXCLUDED: Medical Council Registration REVOKED. Ineligible for hospital deployment.
                                  </span>
                                </div>
                              ) : (
                                <div className="text-teal-700 dark:text-teal-300 flex items-center gap-1 text-[11px] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                  <span>
                                    98% Match: Verified {candidate.councilName?.split('(')[0] || 'Council'} credentials, verified specialty & high reliability rating.
                                  </span>
                                </div>
                              )}
                            </div>

                            <div>
                              {isRevoked ? (
                                <span className="text-rose-600 font-bold text-[11px] px-2 py-1 bg-rose-100 dark:bg-rose-950 rounded">
                                  Blocked
                                </span>
                              ) : (
                                <span className="text-teal-700 dark:text-teal-300 font-semibold text-[11px] px-2.5 py-1 bg-teal-100 dark:bg-teal-950/70 rounded-lg">
                                  Ready to Deploy
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Shift Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Post Healthcare Shift / Requirement
            </h3>
            <p className="text-xs text-slate-500">
              Shift payout will be auto-reserved in the escrow vault to guarantee practitioner commitment.
            </p>

            <form onSubmit={handleCreateShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Role Required
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  <option value="doctor">Doctor (MBBS, MD, Specialist)</option>
                  <option value="nurse">Nurse (Staff Nurse, ICU, GNM)</option>
                  <option value="technician">Technician (Lab, CT/MRI, OT)</option>
                  <option value="support_staff">Support Staff (Ward Attendant, Housekeeping)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Specialty / Department
                </label>
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  placeholder="e.g. Critical Care & ICU, Blood Bank, OT Recovery"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Shift Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  placeholder="e.g. Emergency Night Intensivist"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Responsibilities & Instructions
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Shift Pay Rate (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={newPayRate}
                    onChange={(e) => setNewPayRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                    min={500}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Urgency Tier
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as 'NORMAL' | 'HIGH' | 'EMERGENCY_ICU')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  >
                    <option value="NORMAL">Standard Shift</option>
                    <option value="HIGH">High Priority</option>
                    <option value="EMERGENCY_ICU">🚨 Emergency ICU Coverage</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md"
                >
                  Lock Escrow & Publish Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review, Rating & Escrow Release Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Approve Duty & Release Escrow
            </h3>
            <p className="text-xs text-slate-500">
              Shift completed for <strong>{showRatingModal.title}</strong> by{' '}
              <strong>{showRatingModal.assignedWorkerName}</strong>. Rate performance to update their Pro Badge standing!
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Performance Rating (1 - 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 text-2xl focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingScore
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm ml-2 text-slate-800 dark:text-slate-200">
                    {ratingScore} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Hospital Management Feedback
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  rows={3}
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Disbursing from Escrow:</span>
                <span className="font-bold text-sm">₹{showRatingModal.payRateInr.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveAndPay}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
                >
                  Confirm & Transfer ₹{showRatingModal.payRateInr.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
