import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserCheck,
  Users,
  FileCheck2,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export default function TrustScoreGauge({ trustAnalysis, onOpenExplainer = null }) {
  if (!trustAnalysis) return null;

  const { totalScore, trustLevel, components } = trustAnalysis;

  // Gauge parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  let strokeColor = '#ef4444'; // Red
  let levelBg = 'bg-rose-50 text-rose-700 border-rose-200';
  let LevelIcon = ShieldX;

  if (totalScore >= 80) {
    strokeColor = '#10b981'; // Green
    levelBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    LevelIcon = ShieldCheck;
  } else if (totalScore >= 50) {
    strokeColor = '#f59e0b'; // Amber
    levelBg = 'bg-amber-50 text-amber-700 border-amber-200';
    LevelIcon = ShieldAlert;
  }

  const pillars = [
    {
      key: 'organizerCredibility',
      title: 'Organizer Credibility',
      weight: '30%',
      icon: UserCheck,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-100 text-blue-800',
      data: components.organizerCredibility
    },
    {
      key: 'communityConfirmation',
      title: 'Community Confirmation',
      weight: '30%',
      icon: Users,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-100 text-purple-800',
      data: components.communityConfirmation
    },
    {
      key: 'evidenceQuality',
      title: 'Evidence Quality',
      weight: '25%',
      icon: FileCheck2,
      color: 'bg-teal-600',
      lightColor: 'bg-teal-100 text-teal-800',
      data: components.evidenceQuality
    },
    {
      key: 'detailsConsistency',
      title: 'Details Consistency',
      weight: '15%',
      icon: CheckCircle,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-100 text-indigo-800',
      data: components.detailsConsistency
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Event Trust Engine Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent multi-factor verification scoring
          </p>
        </div>

        {onOpenExplainer && (
          <button
            onClick={onOpenExplainer}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            How it works
          </button>
        )}
      </div>

      {/* Main Gauge & Overview */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 130 130">
            {/* Background ring */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              className="text-slate-100"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalScore}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              Trust Score
            </span>
          </div>
        </div>

        {/* Rating Assessment & Level */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2.5 shadow-xs">
            <LevelIcon className="w-4 h-4" />
            <span>{trustLevel}</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            {trustAnalysis.levelDescription}
          </p>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-normal">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Verification Policy:</span> High trust indicates strong organic confidence, but official <strong>Verified</strong> status is exclusively confirmed by College Administrators.
            </div>
          </div>
        </div>
      </div>

      {/* Component-wise Breakdown Bars */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Scoring Component Breakdown
        </div>

        {pillars.map(pillar => {
          const Icon = pillar.icon;
          const score = pillar.data?.rawScore || 0;
          const weighted = pillar.data?.weightedScore || 0;

          return (
            <div key={pillar.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{pillar.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Weight: {pillar.weight})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{score}/100</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (contrib: +{weighted} pts)
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${pillar.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>

              {/* Summary note */}
              <p className="text-[11px] text-slate-500 italic">
                {pillar.data?.summary || 'Calculated based on verified data'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
