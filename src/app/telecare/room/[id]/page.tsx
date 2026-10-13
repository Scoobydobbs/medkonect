'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MedicineItem } from '@/lib/types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  FileText,
  PlusCircle,
  Trash2,
  Sparkles,
  Send,
  Pill,
} from 'lucide-react';

export default function VideoConsultationRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { appointments, currentUser, issuePrescription, createPharmacyOrder, pharmacies } = useApp();

  const appointmentId = params?.id as string;
  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);

  // Live Vitals State
  const [heartRate, setHeartRate] = useState<number>(76);
  const [spo2, setSpo2] = useState<number>(98);
  const [bloodPressure, setBloodPressure] = useState<string>('118/78');
  const [temperature, setTemperature] = useState<string>('98.4°F');

  // On-call prescription draft
  const [diagnosis, setDiagnosis] = useState<string>('Acute viral pharyngitis with mild bronchial irritation');
  const [prescMedicines, setPrescMedicines] = useState<MedicineItem[]>([
    {
      name: 'Paracetamol 650mg (Dolo 650)',
      dosage: '1 Tab',
      frequency: 'TDS (Thrice daily)',
      durationDays: 5,
      instructions: 'Take after meals for fever relief',
    },
    {
      name: 'Levocetirizine 5mg (Levocet)',
      dosage: '1 Tab',
      frequency: 'OD (Bedtime)',
      durationDays: 5,
      instructions: 'Take at night for allergic cough',
    },
  ]);
  const [rxIssued, setRxIssued] = useState<boolean>(false);

  // Start local camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }
        }
      } catch (e) {
        console.warn('Camera/mic access disabled in mock environment:', e);
      }
    }
    initCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Timer & subtle vitals fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
      // Small realistic fluctuations
      if (Math.random() > 0.7) {
        setHeartRate((prev) => 74 + Math.floor(Math.random() * 6));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSignPrescription = () => {
    issuePrescription(appointment.id, diagnosis, prescMedicines);
    setRxIssued(true);
  };

  const handleRouteToPharmacy = () => {
    createPharmacyOrder({
      pharmacyId: pharmacies[0].id,
      pharmacyName: pharmacies[0].name,
      orderType: 'PATIENT_PRESCRIPTION',
      orderedBy: `${appointment.patientName} (Live Telecare Rx)`,
      destinationHospitalOrPatient: 'Doorstep Delivery, Chennai',
      items: prescMedicines.map((m) => ({
        name: m.name,
        quantity: 1,
        unitPriceInr: 85,
      })),
      totalInr: prescMedicines.length * 85,
    });
    alert(`Prescription routed to ${pharmacies[0].name}! Delivery scheduled.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Teleconsultation Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
                Live Clinical Consultation Room
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live: {formatSeconds(callDuration)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Doctor: <strong>{appointment.doctorName}</strong> · Patient: <strong>{appointment.patientName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/telecare')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20"
          >
            <PhoneOff className="w-4 h-4" />
            End Consultation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video Feeds & Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Camera Window */}
            <div className="relative h-64 sm:h-80 bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-xl flex items-center justify-center group">
              <video
                ref={localVideoRef}
                className={`w-full h-full object-cover ${videoEnabled ? 'block' : 'hidden'}`}
                playsInline
                muted
              />
              {!videoEnabled && (
                <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-300">
                    {appointment.patientName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold">Camera Paused</span>
                </div>
              )}

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur text-white text-[11px] font-semibold flex items-center gap-1.5">
                <span>{appointment.patientName} (Patient)</span>
              </div>
            </div>

            {/* Doctor Camera Window */}
            <div className="relative h-64 sm:h-80 bg-slate-900 rounded-3xl overflow-hidden border-2 border-teal-500/50 shadow-xl flex items-center justify-center">
              {/* Simulated Doctor Feed with pulse avatar */}
              <div className="flex flex-col items-center justify-center text-center p-4 space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    DR
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{appointment.doctorName}</h4>
                  <p className="text-[11px] text-teal-400 font-medium">{appointment.doctorSpecialty}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">NMC Verified Consultant</p>
                </div>
              </div>

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-teal-950/80 backdrop-blur border border-teal-500/30 text-teal-300 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Physician Feed</span>
              </div>
            </div>
          </div>

          {/* Call Controls Toolbar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-3 rounded-xl border text-sm transition-all ${
                audioEnabled
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}
              title={audioEnabled ? 'Mute Mic' : 'Unmute Mic'}
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-3 rounded-xl border text-sm transition-all ${
                videoEnabled
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}
              title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>

          {/* Real-Time Patient Vitals HUD */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Real-Time Clinical Vitals Telemetry
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">ABDM STREAM ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  Heart Rate
                </span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  SpO2 Saturation
                </span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {spo2} <span className="text-xs font-normal text-slate-400">%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400">Blood Pressure</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {bloodPressure} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  Temperature
                </span>
                <div className="text-xl font-extrabold text-white mt-1">{temperature}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: On-Call Prescription & Diagnosis Pad (1 col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Live Prescription Pad
                </h3>
              </div>
              {rxIssued && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Signed & Issued
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Clinical Impression / Diagnosis
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  rows={2}
                />
              </div>

              {/* Medicine list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Medications ({prescMedicines.length})
                  </label>
                  <button
                    onClick={() =>
                      setPrescMedicines([
                        ...prescMedicines,
                        {
                          name: 'Pantoprazole 40mg (Pan 40)',
                          dosage: '1 Tab',
                          frequency: 'OD',
                          durationDays: 5,
                          instructions: 'Before breakfast',
                        },
                      ])
                    }
                    className="text-purple-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {prescMedicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{med.name}</div>
                        <div className="text-slate-400">
                          {med.dosage} · {med.frequency} · {med.durationDays} Days
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setPrescMedicines(prescMedicines.filter((_, i) => i !== idx))
                        }
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {!rxIssued ? (
                  <button
                    onClick={handleSignPrescription}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Sign & Issue E-Prescription
                  </button>
                ) : (
                  <button
                    onClick={handleRouteToPharmacy}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <Pill className="w-4 h-4" />
                    Route Rx to Partner Pharmacy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
