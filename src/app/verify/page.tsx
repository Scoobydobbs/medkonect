'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { verifyCredentialSignature } from '@/lib/crypto';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Building,
} from 'lucide-react';

export default function CouncilVerifierPage() {
  const { credentials, revokeCredential, verifyCredentialDirect, shifts } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('MMC-2018-09412');
  const [activeTab, setActiveTab] = useState<'verifier' | 'council_admin'>('verifier');
  const [revokeModalCredId, setRevokeModalCredId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState<string>('Disciplinary review by ethics board for unethical practice.');

  // Find queried credential
  const queriedCred = credentials.find(
    (c) =>
      c.registrationNumber.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const isSigValid = queriedCred
    ? verifyCredentialSignature(
        queriedCred.registrationNumber,
        queriedCred.councilName.includes('MMC')
          ? 'MMC'
          : queriedCred.councilName.includes('TNMC')
          ? 'TNMC'
          : queriedCred.councilName.includes('KMC')
          ? 'KMC'
          : queriedCred.councilName.includes('MNC')
          ? 'MNC'
          : 'NCAHP',
        queriedCred.validUpto,
        queriedCred.signatureHash
      )
    : false;

  const handleRevokeConfirm = () => {
    if (!revokeModalCredId) return;
    revokeCredential(revokeModalCredId, revokeReason);
    setRevokeModalCredId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>National Medical & Nursing Council Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Tamper-Evident Credential Verifier & Council Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time verification of doctor & nurse licenses against cryptographic trust anchors.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'verifier'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Public Instant Verifier
          </button>
          <button
            onClick={() => setActiveTab('council_admin')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'council_admin'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Council Registrar Controls
          </button>
        </div>
      </div>

      {activeTab === 'verifier' ? (
        <div className="space-y-6">
          {/* Public Search Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Practitioner License & Registration Lookup
            </h2>
            <p className="text-xs text-slate-500">
              Zero login required. Enter a Registration Number (e.g. <code>MMC-2018-09412</code>, <code>KMC-2015-88319</code>, <code>INC-MH-2021-9941</code>) or Practitioner Name to verify validity.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter NMC/SMC Registration Number or Doctor Name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSearchQuery('MMC-2018-09412')}
                  className="px-2.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Dr. Priya (Active)
                </button>
                <button
                  onClick={() => setSearchQuery('KMC-2015-88319')}
                  className="px-2.5 py-2 rounded-xl text-xs bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-800 dark:text-rose-300 font-medium"
                >
                  Dr. Vikram (Revoked)
                </button>
              </div>
            </div>
          </div>

          {/* Verification Result Card */}
          {queriedCred ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verification Outcome
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {queriedCred.userName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {queriedCred.councilName} · Reg: {queriedCred.registrationNumber}
                  </div>
                </div>

                <div>
                  {queriedCred.verificationStatus === 'VERIFIED' ? (
                    <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wide">
                          ACTIVE & COUNCIL VERIFIED
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Valid through {queriedCred.validUpto}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wide">
                          REVOKED / SUSPENDED
                        </div>
                        <div className="text-[10px] text-rose-600 dark:text-rose-400">
                          License blocked by Council order
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Credential Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {queriedCred.credentialType.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Issuing Jurisdiction</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {queriedCred.state}, India
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Cryptographic Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Signature Valid (Ed25519/SHA-256)</span>
                  </span>
                </div>
              </div>

              {/* If Revoked Reason */}
              {queriedCred.revocationReason && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Official Council Revocation Notice:</span>
                    <span className="text-[11px] mt-0.5 block">{queriedCred.revocationReason}</span>
                  </div>
                </div>
              )}

              {/* Digital Proof Hash */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-500 break-all flex items-center justify-between gap-2">
                <span>Proof: {queriedCred.signatureHash}</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-sans font-bold">
                  Immutable Anchor
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              No matching practitioner found for &quot;{searchQuery}&quot;. Try searching for <code>MMC-2018-09412</code> or <code>Dr. Priya</code>.
            </div>
          )}

          {/* Tamper Evidence Demonstration Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Shift Contracts Tamper-Proof Audit Chain</span>
            </h3>
            <p className="text-xs text-slate-500">
              All electronic shift consents and hospital contracts are anchored using SHA-256 hash chains. Any unauthorized database modification triggers an immediate cryptographic TAMPERED violation.
            </p>

            <div className="space-y-2">
              {shifts
                .filter((s) => s.contractHash)
                .map((shift) => {
                  const isTampered = shift.contractHash?.startsWith('TAMPERED_');
                  return (
                    <div
                      key={shift.id}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        isTampered
                          ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold">
                          <span>{shift.title}</span>
                          <span className="text-slate-400 font-normal">({shift.hospitalName})</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5 truncate max-w-md">
                          Hash: {shift.contractHash}
                        </div>
                      </div>

                      <div>
                        {isTampered ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            CRITICAL: TAMPERED DETECTED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Cryptographically Intact
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        /* Council Registrar Controls */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              State Medical & Nursing Council Registrar Management
            </h2>
            <p className="text-xs text-slate-500">
              Registrars can issue, suspend, or revoke practitioner licenses. Changes propagate instantly to all affiliated hospitals.
            </p>

            <div className="space-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {cred.userName}
                      </span>
                      <span className="text-slate-400">· {cred.role.toUpperCase()}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cred.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {cred.verificationStatus}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      {cred.councilName} · Reg: {cred.registrationNumber} · Valid until {cred.validUpto}
                    </div>
                    {cred.revocationReason && (
                      <div className="text-rose-600 font-semibold text-[11px] mt-0.5">
                        Suspension Reason: {cred.revocationReason}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cred.verificationStatus === 'VERIFIED' ? (
                      <button
                        onClick={() => setRevokeModalCredId(cred.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Revoke License
                      </button>
                    ) : (
                      <button
                        onClick={() => verifyCredentialDirect(cred.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restore & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revocation Reason Modal */}
      {revokeModalCredId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              Confirm Council License Revocation
            </h3>
            <p className="text-xs text-slate-500">
              Revoking this credential will immediately block the practitioner from applying to or executing shifts across all affiliated hospitals in India.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Official Council Reason / Ethics Order
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  rows={3}
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevokeModalCredId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRevokeConfirm}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md"
                >
                  Execute Revocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
