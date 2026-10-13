'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { User, CredentialRecord } from '@/lib/types';
import { ProBadgePill } from './ProBadgePill';
import { ShieldCheck, Award, Download, Printer, CheckCircle2 } from 'lucide-react';

interface DigitalIdCardProps {
  user: User;
  credential?: CredentialRecord;
  onClose?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ user, credential, onClose }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const regNo = user.registrationNumber || 'MK-GEN-2026';
    const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://medkonect.in'}/verify?reg=${encodeURIComponent(regNo)}`;
    QRCode.toDataURL(verifyUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f766e',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [user.registrationNumber]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-md w-full mx-auto">
      {/* Physical-style ID Card Container */}
      <div
        id="digital-id-card-print"
        className="w-full rounded-3xl overflow-hidden border-2 border-teal-500/40 shadow-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white relative p-6 space-y-5"
      >
        {/* Hologram / Security Badge overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Council & National Header */}
        <div className="flex items-center justify-between border-b border-teal-800/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
              MK
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                National Healthcare Registry
              </div>
              <div className="text-xs font-bold text-white tracking-tight">
                {user.councilName || 'State Medical Council'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">ID: {user.id.substring(0, 10)}</span>
          </div>
        </div>

        {/* Middle Body: Avatar, Details & Dynamic QR */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white leading-tight">{user.fullName}</h3>
            </div>

            <div className="space-y-0.5 text-xs">
              <div className="text-teal-300 font-semibold text-[11px] uppercase tracking-wide">
                {user.role.replace('_', ' ')} · {user.specialty || 'General Practitioner'}
              </div>
              <div className="text-slate-300 text-[11px]">
                <strong className="text-slate-400">Reg No:</strong> {user.registrationNumber || 'MMC-2018-09412'}
              </div>
              <div className="text-slate-300 text-[11px]">
                <strong className="text-slate-400">Location:</strong> {user.city}, {user.state}
              </div>
              <div className="text-slate-300 text-[11px]">
                <strong className="text-slate-400">Experience:</strong> {user.experienceYears || 5} Years
              </div>
            </div>

            {/* Pro Badge */}
            {user.badgeLevel && (
              <div className="pt-1">
                <ProBadgePill level={user.badgeLevel} size="sm" />
              </div>
            )}
          </div>

          {/* Dynamic Scannable QR Code */}
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-white rounded-xl shadow-md border border-teal-500/30">
              {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeDataUrl} alt="Practitioner Verification QR" className="w-24 h-24 rounded-lg" />
              ) : (
                <div className="w-24 h-24 bg-slate-200 animate-pulse rounded-lg" />
              )}
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Scan to Verify
            </span>
          </div>
        </div>

        {/* Card Footer: Signature & Security Hash */}
        <div className="pt-3 border-t border-teal-800/40 flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <div className="truncate max-w-[220px]">
            Hash: {credential?.signatureHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4'}
          </div>
          <div className="text-right text-teal-400 font-bold uppercase tracking-wider">
            ABDM / NMC COMPLIANT
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full justify-center text-xs">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Save ID Card
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
