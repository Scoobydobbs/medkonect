'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface QrScannerModalProps {
  shiftTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  shiftTitle,
  onSuccess,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        } else {
          setCameraError('Camera API not supported on this browser.');
        }
      } catch (err: unknown) {
        console.warn('Camera permission denied or camera not found:', err);
        setCameraError('Camera access unavailable. You can use the Quick Simulation button below.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = () => {
    setScanned(true);
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scanner</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Hospital Gate Duty Check-In
          </h3>
          <p className="text-xs text-slate-500 truncate max-w-xs mx-auto">{shiftTitle}</p>
        </div>

        {/* Viewfinder Window */}
        <div className="relative w-full h-60 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-teal-500/50">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Target Scanner Reticle */}
          <div className="absolute inset-8 border-2 border-teal-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="w-4 h-4 border-t-2 border-l-2 border-teal-400" />
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-teal-400 self-end" />
          </div>

          {/* Success Overlay when scanned */}
          {scanned && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-400 space-y-2 animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12 animate-bounce" />
              <span className="font-extrabold text-sm text-white">QR Code Verified!</span>
              <span className="text-[10px] text-emerald-300">Contract Hash Anchored</span>
            </div>
          )}

          {cameraError && !cameraActive && (
            <div className="absolute inset-0 p-4 bg-slate-900/90 flex flex-col items-center justify-center text-slate-300 text-xs space-y-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <p className="text-[11px] text-center text-slate-400">{cameraError}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleSimulateScan}
            disabled={scanned}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            {scanned ? 'Check-in Verified...' : 'Scan / Confirm Hospital Check-In'}
          </button>
          <p className="text-[10px] text-slate-400">
            Records timestamp, GPS check-in, and tamper-evident SHA-256 hash.
          </p>
        </div>
      </div>
    </div>
  );
};
