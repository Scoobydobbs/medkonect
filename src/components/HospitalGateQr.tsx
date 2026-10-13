'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Shift } from '@/lib/types';
import { Building2, QrCode, Clock, ShieldCheck, Printer } from 'lucide-react';

interface HospitalGateQrProps {
  shift: Shift;
  onClose?: () => void;
}

export const HospitalGateQr: React.FC<HospitalGateQrProps> = ({ shift, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const payload = JSON.stringify({
      action: 'MEDKONECT_HOSPITAL_CHECKIN',
      shiftId: shift.id,
      hospitalId: shift.hospitalId,
      hospitalName: shift.hospitalName,
      title: shift.title,
      timestamp: new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f766e',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('Error generating gate QR:', err));
  }, [shift]);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 max-w-sm w-full mx-auto shadow-2xl">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full">
          <Building2 className="w-3.5 h-3.5" />
          <span>Hospital Duty Check-In Gate</span>
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
          {shift.hospitalName}
        </h3>
        <p className="text-xs text-slate-500">
          {shift.title} · {shift.hospitalCity}
        </p>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrUrl} alt="Hospital Shift Gate QR" className="w-48 h-48 rounded-xl shadow-sm" />
        ) : (
          <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-xl" />
        )}
        <span className="text-[10px] text-slate-400 font-mono mt-2">
          Shift ID: {shift.id}
        </span>
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Point Camera to Check-In & Anchor Contract</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Escrow payment: ₹{shift.payRateInr.toLocaleString('en-IN')} reserved.
        </p>
      </div>

      <div className="flex items-center gap-2 justify-center pt-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Gate QR Poster
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
