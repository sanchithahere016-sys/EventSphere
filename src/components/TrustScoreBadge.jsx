import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Sparkles } from 'lucide-react';

export default function TrustScoreBadge({ score = 0, size = 'md', showLabel = true, onClick = null }) {
  let colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
  let Icon = ShieldX;
  let level = 'Low Trust';

  if (score >= 80) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    Icon = ShieldCheck;
    level = 'High Trust';
  } else if (score >= 50) {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    Icon = ShieldAlert;
    level = 'Moderate Trust';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2 shadow-sm'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center rounded-full border transition-all ${colorStyles} ${sizeClasses[size] || sizeClasses.md} ${
        onClick ? 'cursor-pointer hover:shadow hover:scale-105 active:scale-95' : 'cursor-default'
      }`}
      title={`Community Trust Score: ${score}/100 (${level})`}
    >
      <Icon className={`${iconSizes[size] || iconSizes.md} shrink-0`} />
      <span className="tabular-nums font-bold">{score}%</span>
      {showLabel && (
        <span className="hidden sm:inline font-medium opacity-90">{level}</span>
      )}
    </button>
  );
}
