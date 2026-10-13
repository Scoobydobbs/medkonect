'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProBadgePill } from '@/components/ProBadgePill';
import { DigitalIdCard } from '@/components/DigitalIdCard';
import { QrScannerModal } from '@/components/QrScannerModal';
import { UserRole, Shift } from '@/lib/types';
import {
  Stethoscope,
  Building2,
  MapPin,
  Clock,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Award,
  Filter,
  CreditCard,
  Camera,
  RotateCcw,
} from 'lucide-react';

export default function WorkersTalentPage() {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    shifts,
    credentials,
    applyForShift,
    checkInShift,
    checkOutShift,
    requestShiftReplacement,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [applyFeedback, setApplyFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [showQrModal, setShowQrModal] = useState<string | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [activeScanShift, setActiveScanShift] = useState<{ id: string; title: string } | null>(null);
  const [replacementShift, setReplacementShift] = useState<Shift | null>(null);
  const [replacementReason, setReplacementReason] = useState<string>('Sudden clinical emergency / fever');

  // Worker credentials
  const currentCred = credentials.find((c) => c.userId === currentUser.id);
  const isRevoked = currentCred?.verificationStatus === 'REVOKED' || currentUser.verificationStatus === 'REVOKED';

  // Filter shifts
  const openShifts = shifts.filter((s) => {
    if (s.status !== 'OPEN') return false;
    if (roleFilter !== 'all' && s.roleRequired !== roleFilter) return false;
    if (selectedCity !== 'all' && s.hospitalCity !== selectedCity) return false;
    return true;
  });

  // Shifts where current worker is assigned
  const myAssignedShifts = shifts.filter(
    (s) => s.assignedWorkerId === currentUser.id && s.status !== 'COMPLETED'
  );

  const handleApply = (shiftId: string) => {
    const res = applyForShift(shiftId);
    setApplyFeedback({ message: res.message, isError: !res.success });
    setTimeout(() => setApplyFeedback(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>Healthcare Staff & Practitioner Talent Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Find Shifts & Grow Your Medical Career
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Doctors, Nurses, Technicians & Support Staff. Zero agency cuts, direct escrow payouts & Pro Badges.
          </p>
        </div>

        {/* Quick Practitioner Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Viewing as:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = allUsers.find((user) => user.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            {allUsers
              .filter((u) => ['doctor', 'nurse', 'technician', 'support_staff'].includes(u.role))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.role.replace('_', ' ')})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Worker Profile & Wallet Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold">{currentUser.fullName}</h2>
              {currentUser.badgeLevel && <ProBadgePill level={currentUser.badgeLevel} size="md" />}
              {isRevoked ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Registration Suspended / Revoked
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Council Verified
                </span>
              )}
            </div>

            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-y-1 gap-x-4">
              <span>
                <strong>Role:</strong> {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
              <span>
                <strong>Specialty:</strong> {currentUser.specialty || 'General Duty'}
              </span>
              <span>
                <strong>Council Reg:</strong> {currentUser.registrationNumber || 'Pending'}
              </span>
              <span>
                <strong>City:</strong> {currentUser.city}, {currentUser.state}
              </span>
            </div>

            {/* Reputation & Pro Badge Progress */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Award className="w-4 h-4" />
                <span>★ {currentUser.averageRating} Rating</span>
                <span className="text-slate-400">({currentUser.totalShiftsCompleted} Completed Shifts)</span>
              </div>
              <div className="text-teal-300 text-[11px] font-medium">
                {currentUser.badgeLevel === 'PRO'
                  ? '💎 Elite Pro Standing: Priority hospital selection & expedited payout approval.'
                  : 'Complete more verified shifts to reach MedKonect PRO status!'}
              </div>
            </div>
          </div>

          {/* Wallet Balance & Instant Payout */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex flex-col justify-between min-w-[200px]">
            <span className="text-xs font-medium text-slate-300">Escrow Wallet Balance</span>
            <div className="text-3xl font-extrabold text-emerald-400 my-2">
              ₹{(currentUser.walletBalanceInr || 0).toLocaleString('en-IN')}
            </div>
            <button
              onClick={() =>
                alert(`Withdrawal of ₹${(currentUser.walletBalanceInr || 0).toLocaleString('en-IN')} initiated to UPI ID (${currentUser.phone}@okhdfcbank)! Funds will reflect in 30 seconds.`)
              }
              className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              Transfer to Bank / UPI
            </button>

            <button
              onClick={() => setShowIdCardModal(true)}
              className="w-full mt-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              View Official Digital Council ID
            </button>
          </div>
        </div>
      </div>

      {/* Application Feedback Toast */}
      {applyFeedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
            applyFeedback.isError
              ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {applyFeedback.isError ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{applyFeedback.message}</span>
          </div>
          <button onClick={() => setApplyFeedback(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Duty / Assigned Shifts for Current Worker */}
      {myAssignedShifts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>My Active Duty Shifts ({myAssignedShifts.length})</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {myAssignedShifts.map((shift) => (
              <div
                key={shift.id}
                className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-teal-700 dark:text-teal-300">
                      {shift.hospitalName} ({shift.hospitalCity})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      {shift.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{shift.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pay: ₹{shift.payRateInr.toLocaleString('en-IN')} (Escrow Locked) · {shift.specialty}
                  </p>
                  {shift.checkInTime && (
                    <div className="text-[11px] text-emerald-600 font-medium">
                      ✓ Checked-in at: {new Date(shift.checkInTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {shift.status === 'ASSIGNED' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveScanShift({ id: shift.id, title: shift.title })}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                      >
                        <Camera className="w-4 h-4" />
                        Scan Gate QR
                      </button>
                      <button
                        onClick={() => setReplacementShift(shift)}
                        className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        title="Broadcast emergency replacement request to verified peers in seconds"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Request Replacement
                      </button>
                    </div>
                  ) : shift.status === 'IN_PROGRESS' ? (
                    <button
                      onClick={() => checkOutShift(shift.id)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Duty (Check-Out)
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar for Open Shifts */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Explore Hospital Shifts</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {openShifts.length} Open
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Healthcare Roles</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
              <option value="technician">Technicians</option>
              <option value="support_staff">Support Staff & Attendants</option>
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>

        {/* Shift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openShifts.map((shift) => (
            <div
              key={shift.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md">
                    {shift.roleRequired.replace('_', ' ')}
                  </span>
                  {shift.urgency === 'EMERGENCY_ICU' ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Emergency ICU
                    </span>
                  ) : shift.urgency === 'HIGH' ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-md">
                      High Priority
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{shift.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{shift.hospitalName}</span>
                  <span>·</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{shift.hospitalCity}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {shift.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{shift.payRateInr.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">✓ Escrow Guaranteed</span>
                </div>

                <button
                  onClick={() => handleApply(shift.id)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span>1-Click Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera QR Scanner Modal */}
      {activeScanShift && (
        <QrScannerModal
          shiftTitle={activeScanShift.title}
          onSuccess={() => {
            checkInShift(activeScanShift.id);
            setActiveScanShift(null);
            setShowQrModal(activeScanShift.id);
          }}
          onClose={() => setActiveScanShift(null)}
        />
      )}

      {/* Official Digital Council ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <DigitalIdCard
              user={currentUser}
              credential={currentCred}
              onClose={() => setShowIdCardModal(false)}
            />
          </div>
        </div>
      )}

      {/* QR Check-in Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hospital Arrival QR Verified!
            </h3>
            <p className="text-xs text-slate-500">
              Reporting verified at hospital gates. Cryptographic shift contract anchor generated on the audit ledger.
            </p>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-24 h-24 text-teal-600 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-600 font-bold">
                ✓ Check-In Recorded: {new Date().toLocaleTimeString()}
              </span>
            </div>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md"
            >
              Close & Begin Duty
            </button>
          </div>
        </div>
      )}

      {/* Duty Replacement Modal */}
      {replacementShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-rose-600">
              <RotateCcw className="w-4 h-4" />
              Request Shift Replacement (Duty Swap)
            </h3>
            <p className="text-xs text-slate-500">
              Can&apos;t attend this shift? MedKonect will immediately broadcast an urgent coverage request to all verified matching peers in your city so the hospital is never left empty-handed.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Reason for Replacement Request
                </label>
                <textarea
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setReplacementShift(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    requestShiftReplacement(replacementShift.id, replacementReason);
                    setReplacementShift(null);
                    alert('Duty replacement broadcasted! Matching verified peers in your city have been notified.');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Confirm & Broadcast Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
