import React from 'react';
import { BadgeLevel } from '@/lib/types';
import { ShieldCheck, Award, Heart, Sparkles } from 'lucide-react';

interface ProBadgePillProps {
  level?: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ProBadgePill: React.FC<ProBadgePillProps> = ({
  level = 'STARTER',
  size = 'md',
  showDetails = false,
}) => {
  const badgeConfig = {
    PRO: {
      label: 'MedKonect PRO',
      desc: 'Top 5% Talent · Priority Escrow · 4.8+ Rating',
      icon: Sparkles,
      className:
        'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-sm ring-1 ring-emerald-500/30',
      iconClass: 'text-amber-300 animate-pulse',
    },
    HIGH_RATED: {
      label: 'High Rated',
      desc: '25+ Shifts · 4.6+ Rating · Hospital Recommended',
      icon: Award,
      className:
        'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700',
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
    FAVORITE: {
      label: 'Hospital Favorite',
      desc: '10+ Shifts · Zero No-Shows · Verified Reliable',
      icon: Heart,
      className:
        'bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-700',
      iconClass: 'text-blue-600 dark:text-blue-400',
    },
    STARTER: {
      label: 'Verified Starter',
      desc: 'Credential Checked · ID Cleared',
      icon: ShieldCheck,
      className:
        'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      iconClass: 'text-slate-600 dark:text-slate-400',
    },
  };

  const current = badgeConfig[level] || badgeConfig.STARTER;
  const IconComponent = current.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center rounded-full font-medium tracking-tight ${sizeStyles[size]} ${current.className}`}
      >
        <IconComponent className={`w-3.5 h-3.5 ${current.iconClass}`} />
        <span>{current.label}</span>
      </span>
      {showDetails && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-1">{current.desc}</span>
      )}
    </div>
  );
};
