'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProBadgePill } from '@/components/ProBadgePill';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  BarChart3,
  Scale,
  Trash2,
} from 'lucide-react';

export default function AdminOpsPage() {
  const {
    allUsers,
    hospitals,
    shifts,
    credentials,
    revokeCredential,
    verifyCredentialDirect,
    tamperContract,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'escrow_disputes' | 'council_stream' | 'dpdp'>(
    'analytics'
  );
  const [disputeMessage, setDisputeMessage] = useState<string | null>(null);

  // Analytics Metrics
  const totalShifts = shifts.length;
  const completedShifts = shifts.filter((s) => s.status === 'COMPLETED').length;
  const fillRate = totalShifts > 0 ? Math.round((completedShifts / totalShifts) * 100) : 0;

  const totalEscrowHeld = shifts
    .filter((s) => s.escrowFunded && s.status !== 'COMPLETED')
    .reduce((acc, s) => acc + s.payRateInr, 0);

  const totalDisbursed = shifts
    .filter((s) => s.payoutStatus === 'DISBURSED')
    .reduce((acc, s) => acc + s.payRateInr, 0);

  const proCount = allUsers.filter((u) => u.badgeLevel === 'PRO').length;
  const highRatedCount = allUsers.filter((u) => u.badgeLevel === 'HIGH_RATED').length;
  const favoriteCount = allUsers.filter((u) => u.badgeLevel === 'FAVORITE').length;

  const handleResolveDispute = (shiftId: string, outcome: 'REFUND_HOSPITAL' | 'DISBURSE_WORKER') => {
    setDisputeMessage(
      `Dispute resolved on Shift ${shiftId}: ${
        outcome === 'REFUND_HOSPITAL'
          ? 'Full refund processed back to Hospital escrow balance.'
          : 'Payment disbursed to Worker with verified check-in proof.'
      }`
    );
    setTimeout(() => setDisputeMessage(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Platform Governance & Operations Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Staffing Analytics & Ops Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nationwide staffing fill metrics, escrow dispute arbitration, DPDP privacy compliance & audit logs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Staffing Analytics
          </button>
          <button
            onClick={() => setActiveTab('escrow_disputes')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'escrow_disputes'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Escrow & Disputes
          </button>
          <button
            onClick={() => setActiveTab('council_stream')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'council_stream'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Council Audit Stream
          </button>
          <button
            onClick={() => setActiveTab('dpdp')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'dpdp'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            DPDP Privacy & Erasure
          </button>
        </div>
      </div>

      {disputeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{disputeMessage}</span>
          </div>
          <button onClick={() => setDisputeMessage(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {activeTab === 'analytics' ? (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Shift Fill Rate</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {fillRate}%
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {completedShifts} of {totalShifts} Shifts Fulfilled
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Escrow Vault Held</span>
              <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                ₹{totalEscrowHeld.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Active hospital commitments
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Disbursed</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{totalDisbursed.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Paid to Doctors, Nurses & Staff
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Verified Practitioners</span>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {allUsers.filter((u) => u.verificationStatus === 'VERIFIED').length}
              </div>
              <div className="text-[11px] text-purple-600 font-medium mt-1">
                NMC & INC Cleared
              </div>
            </div>
          </div>

          {/* City Wage Trends & Pro Badge Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Wage Benchmark */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <span>Average Hourly Pay Benchmarks Across Metro Cities</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Transparent market rates to eliminate middleman margins.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Mumbai (Maharashtra)</span>
                    <span className="text-teal-600 font-bold">₹1,500/hr (Doc) · ₹650/hr (Nurse)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Bengaluru (Karnataka)</span>
                    <span className="text-teal-600 font-bold">₹1,400/hr (Doc) · ₹600/hr (Nurse)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Chennai (Tamil Nadu)</span>
                    <span className="text-teal-600 font-bold">₹1,250/hr (Doc) · ₹550/hr (Nurse)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Pune (Maharashtra)</span>
                    <span className="text-teal-600 font-bold">₹1,150/hr (Doc) · ₹500/hr (Nurse)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full w-[72%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Badge Standing Distribution */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Practitioner Reputation Distribution</span>
              </h3>
              <p className="text-xs text-slate-500">
                Categorized by hospital attendance, clinical ratings, and verified experience.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProBadgePill level="PRO" size="sm" />
                    <span className="text-slate-600 dark:text-slate-300">Top 5% Elite Tier</span>
                  </div>
                  <span className="font-extrabold text-sm text-teal-800 dark:text-teal-200">{proCount} Talent</span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProBadgePill level="HIGH_RATED" size="sm" />
                    <span className="text-slate-600 dark:text-slate-300">25+ Shifts · 4.6+ Rating</span>
                  </div>
                  <span className="font-extrabold text-sm text-amber-800 dark:text-amber-200">{highRatedCount} Talent</span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProBadgePill level="FAVORITE" size="sm" />
                    <span className="text-slate-600 dark:text-slate-300">Hospital Preferred</span>
                  </div>
                  <span className="font-extrabold text-sm text-blue-800 dark:text-blue-200">{favoriteCount} Talent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'escrow_disputes' ? (
        /* Escrow Arbitration */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Escrow Vault Shift Roster & Arbitration Console</span>
          </h2>
          <p className="text-xs text-slate-500">
            Platform administrators can arbitrate disputed shifts, verify gate check-in logs, and ensure fair fund disbursement.
          </p>

          <div className="space-y-3">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {shift.title}
                    </span>
                    <span className="text-slate-400">· {shift.hospitalName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        shift.payoutStatus === 'DISBURSED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {shift.payoutStatus || 'ESCROW_HELD'}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Assigned: <strong>{shift.assignedWorkerName || 'Awaiting Match'}</strong> · Shift Pay: ₹{shift.payRateInr.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {shift.status !== 'COMPLETED' && shift.assignedWorkerId && (
                    <>
                      <button
                        onClick={() => handleResolveDispute(shift.id, 'REFUND_HOSPITAL')}
                        className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 font-semibold text-xs"
                      >
                        Refund Hospital
                      </button>
                      <button
                        onClick={() => handleResolveDispute(shift.id, 'DISBURSE_WORKER')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        Disburse to Worker
                      </button>
                    </>
                  )}
                  {shift.payoutStatus === 'DISBURSED' && (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Disbursed & Closed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'council_stream' ? (
        /* Council Action Audit Stream */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>National Medical & Nursing Council Audit Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time feed of council registrations, disciplinary reviews, and license revocations.
          </p>

          <div className="space-y-3">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{cred.userName}</span>
                    <span className="text-slate-400">({cred.registrationNumber})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cred.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {cred.verificationStatus}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {cred.councilName} · Valid: {cred.validUpto}
                  </div>
                  {cred.revocationReason && (
                    <div className="text-rose-600 text-[11px] font-semibold mt-1">
                      Order: {cred.revocationReason}
                    </div>
                  )}
                </div>

                <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                  Sig: {cred.signatureHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DPDP Act Right to be Forgotten */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <Trash2 className="w-5 h-5" />
            <span>Digital Personal Data Protection (DPDP) Act Compliance</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Under India&apos;s DPDP Act, practitioners can exercise their <strong>Right to Erasure</strong>. MedKonect removes all identifying personal data (name, phone, Aadhaar) from the active database while retaining cryptographic SHA-256 hashes on the ledger to protect past hospital audit trails without exposing identity.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <span className="font-bold block">Privacy by Design Principle:</span>
            <p className="leading-relaxed">
              When an erasure request is executed, the practitioner&apos;s salt and plain-text credentials are wiped. The shift contract hashes on the ledger remain mathematically intact, but can no longer be linked back to the individual.
            </p>
          </div>

          <button
            onClick={() => {
              alert('DPDP Erasure Simulation: Test practitioner records anonymized. Personal PII scrubbed while cryptographic hashes preserved.');
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Simulate DPDP Account Erasure
          </button>
        </div>
      )}
    </div>
  );
}
