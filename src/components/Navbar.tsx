'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ProBadgePill } from './ProBadgePill';
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  Video,
  Pill,
  Wallet,
  RotateCcw,
  UserCircle2,
  Menu,
  X,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, allUsers, resetAllData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/hospital', label: 'Hospitals', icon: Building2 },
    { href: '/workers', label: 'Talent & Shifts', icon: Stethoscope },
    { href: '/verify', label: 'Council & Verify', icon: ShieldCheck },
    { href: '/telecare', label: 'Telecare & Diagnosis', icon: Video },
    { href: '/pharmacy', label: 'Pharmacy Hub', icon: Pill },
    { href: '/admin', label: 'Ops & Analytics', icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter">MK</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MedKonect
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  India
                </span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Healthcare Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Current User & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Wallet pill if worker */}
            {currentUser.walletBalanceInr !== undefined && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50">
                <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>₹{currentUser.walletBalanceInr.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Role Switcher Button */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 bg-slate-50 dark:bg-slate-800 text-left transition-all"
              title="Click to switch simulated demo persona"
            >
              <UserCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div className="flex flex-col text-xs leading-tight">
                <span className="font-semibold text-slate-800 dark:text-slate-100 max-w-[130px] truncate">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              {currentUser.badgeLevel && (
                <div className="hidden sm:block ml-1">
                  <ProBadgePill level={currentUser.badgeLevel} size="sm" />
                </div>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Switch Demo Persona / Role
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select any persona to experience the platform from their perspective.
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {allUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowRoleModal(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </div>
                      {user.badgeLevel && <ProBadgePill level={user.badgeLevel} size="sm" />}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize flex items-center justify-between">
                      <span>{user.role.replace('_', ' ')}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{user.city}</span>
                    </div>
                    {user.specialty && (
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 truncate">
                        {user.specialty}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  resetAllData();
                  setShowRoleModal(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Demo Data
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
