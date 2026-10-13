'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ProBadgePill } from '@/components/ProBadgePill';
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  Video,
  Pill,
  Award,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    hospitals,
    shifts,
    credentials,
    revokeCredential,
    tamperContract,
  } = useApp();

  const openShiftsCount = shifts.filter((s) => s.status === 'OPEN').length;
  const verifiedTalentCount = credentials.filter((c) => c.verificationStatus === 'VERIFIED').length;
  const proTalentCount = allUsers.filter((u) => u.badgeLevel === 'PRO').length;
  const totalEscrowInr = shifts
    .filter((s) => s.escrowFunded && s.status !== 'COMPLETED')
    .reduce((acc, s) => acc + s.payRateInr, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl border border-teal-800/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Unified Indian Healthcare Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            The Operating System for Healthcare Talent, Hospitals & Care Delivery.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Verified Doctors (NMC), Nurses (INC), Lab Technicians & Ward Attendants matched with affiliated hospitals.
            Transparent escrow payouts, explainable matching, and on-chain tamper-evidence.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/hospital"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 inline-flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Hospital Roster & Shifts
            </Link>
            <Link
              href="/workers"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur border border-white/10 transition-all inline-flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              Talent Marketplace
            </Link>
            <Link
              href="/verify"
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-sm border border-emerald-500/30 transition-all inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Council Verifier
            </Link>
          </div>
        </div>
      </div>

      {/* Live Platform Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Affiliated Hospitals</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {hospitals.length}
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
              Apollo, Fortis, Manipal & KEM
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Open Shifts</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {openShiftsCount}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              ₹{totalEscrowInr.toLocaleString('en-IN')} locked in escrow
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Verified Talent</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {verifiedTalentCount}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
              NMC, INC & State Council registered
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>MedKonect PROs</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {proTalentCount}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              4.8+ Rating · Priority shifts
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Simulation / Council Presentation Sandbox */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 border border-teal-200 dark:border-teal-800/40 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Live Demonstration Sandbox
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
            1-Click Council Tests
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Trigger live tests to see how MedKonect handles instant council revocation, contract tampering, and role switches:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              revokeCredential('cred-1', 'Simulated disciplinary suspension triggered during council live demo');
              alert('Triggered: Dr. Priya Sharma credential status set to REVOKED. Go to Talent Marketplace or Council Verifier to observe real-time exclusion!');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Simulate Council Revocation (Dr. Priya)
          </button>

          <button
            onClick={() => {
              tamperContract('shift-5');
              alert('Triggered: Stored shift-5 contract payload modified. Check the Council & Verify portal to observe cryptographic TAMPERED flag!');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Simulate Contract Tampering
          </button>

          <button
            onClick={() => {
              const apolloUser = allUsers.find((u) => u.role === 'hospital_admin');
              if (apolloUser) setCurrentUser(apolloUser);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Building2 className="w-3.5 h-3.5" />
            Switch to Apollo Medical Director
          </button>
        </div>
      </div>

      {/* 5 Portals Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Platform Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each portal is customized for its specific healthcare role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Hospital Portal */}
          <Link
            href="/hospital"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Affiliated Hospital Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Post locum and emergency shifts (ICU, OT, wards), browse ranked verified applicants, scan check-ins, and approve escrow payouts with ratings.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2">
              <span>Manage Shifts & Staffing</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Worker Talent Hub */}
          <Link
            href="/workers"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Healthcare Talent Marketplace
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                For Doctors, Nurses, Technicians, and Non-Medical staff. Browse shifts, 1-click apply, check-in to duty, earn INR ₹ directly, and level up to Pro Badges.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2">
              <span>View Open Shifts & Wallet</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. Council & Verifier */}
          <Link
            href="/verify"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Council & Public Verifier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                NMC and State Medical/Nursing Council portal. Verify medical licenses, experience certificates, instant revocation, and zero-auth QR checks.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
              <span>Verify Licenses & Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. Telecare & Diagnosis */}
          <Link
            href="/telecare"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Patient Telecare & Diagnosis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect patients with verified doctors for consultations, preliminary clinical diagnosis, and tamper-evident digital e-prescriptions.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 pt-2">
              <span>Consult Doctor & Prescriptions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 5. Pharmacy Supply Chain */}
          <Link
            href="/pharmacy"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                Pharmacy Procurement Network
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                B2B hospital emergency medicine restocking & patient prescription fulfillment through state-registered licensed pharmacies.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 pt-2">
              <span>Manage Orders & Inventory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 6. Active Persona Profile Card */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Current Active Session
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {currentUser.fullName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {currentUser.role.replace('_', ' ')} · {currentUser.city}
                  </div>
                </div>
                {currentUser.badgeLevel && <ProBadgePill level={currentUser.badgeLevel} size="md" />}
              </div>
              {currentUser.specialty && (
                <div className="text-xs text-teal-600 dark:text-teal-400 font-medium pt-1">
                  {currentUser.specialty}
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500">Wallet Balance:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{(currentUser.walletBalanceInr || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
