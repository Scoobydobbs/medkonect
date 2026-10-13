import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ShieldCheck, HeartPulse, Building2, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MedKonect | Indian Healthcare Marketplace & Talent Operating System',
  description:
    'Verified Doctors, Nurses, Technicians & Hospital Staff Marketplace with Escrow Shift Payouts, Telecare Diagnosis & Pharmacy Procurement.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 mt-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                      MK
                    </div>
                    <span className="font-bold text-base tracking-tight">MedKonect India</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Connecting verified healthcare professionals, affiliated hospitals, diagnostic telecare, and pharmacy networks across India.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>NMC, INC & NABH Aligned Ecosystem</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Healthcare Ecosystem
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li><Link href="/hospital" className="hover:text-teal-600">Hospital Shift Roster</Link></li>
                    <li><Link href="/workers" className="hover:text-teal-600">Doctors & Nurses Talent Hub</Link></li>
                    <li><Link href="/workers" className="hover:text-teal-600">Technicians & Non-Medical Jobs</Link></li>
                    <li><Link href="/verify" className="hover:text-teal-600">State Medical Council Verifier</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Patient & Supply Chain
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li><Link href="/telecare" className="hover:text-teal-600">Doctor Teleconsultation</Link></li>
                    <li><Link href="/telecare" className="hover:text-teal-600">Verified E-Prescriptions</Link></li>
                    <li><Link href="/pharmacy" className="hover:text-teal-600">Hospital B2B Medicine Restock</Link></li>
                    <li><Link href="/pharmacy" className="hover:text-teal-600">Registered Pharmacy Directory</Link></li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    National Helpline
                  </h4>
                  <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    1800-MED-KONECT (Toll Free)
                  </p>
                  <p>Deployed on Vercel · Powered by Neon Serverless DB</p>
                  <p>© 2026 MedKonect India. Built for Indian Healthcare Operations.</p>
                </div>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
