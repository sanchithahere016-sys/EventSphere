import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Calculator,
  UserCheck,
  Users,
  FileCheck2,
  CheckCircle,
  QrCode,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

export default function AboutPage({ onOpenTrustEngine }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-brand-600" />
          <span>Engineering College Community Project</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About EventSphere
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          A community-powered platform engineered to address the growing challenge of misleading, duplicate, and fraudulent event listings in collegiate and regional ecosystems.
        </p>
      </div>

      {/* The Problem & Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-200/80 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">The Problem</span>
          <h2 className="text-xl font-bold text-slate-900">
            Unregulated Event Feeds &amp; Phantom Listings
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conventional platforms allow unverified organizers to post listings with zero accountability. Students often travel to unverified venues only to find unauthorized fees, altered timings, or completely nonexistent gatherings.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The Solution</span>
          <h2 className="text-xl font-bold text-slate-900">
            Community-Powered Event Trust Engine
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            EventSphere introduces a transparent four-factor mathematical scoring engine. Listings undergo crowdsourced confirmation, evidence auditing, and duplicate detection, while official verification remains guarded by authorized administrators.
          </p>
        </div>
      </div>

      {/* Trust Engine Formula Details */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Mathematical Model</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">The Trust Score Algorithm</h2>
          </div>
          <button
            onClick={onOpenTrustEngine}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Launch Interactive Engine Modal
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs sm:text-sm font-bold text-slate-800 text-center leading-relaxed">
          Trust Score = (0.30 × Organizer Credibility) + (0.30 × Community Confirmation) + (0.25 × Evidence Quality) + (0.15 × Details Consistency)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              30%
            </div>
            <h3 className="text-sm font-bold text-slate-900">Organizer Credibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Institutional email validation (.edu / .ac.in), administrative profile check, and track record of completed events.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              30%
            </div>
            <h3 className="text-sm font-bold text-slate-900">Community Confirmation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unique student confirmations increase trust; reported community flags penalize the score immediately.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              25%
            </div>
            <h3 className="text-sm font-bold text-slate-900">Evidence Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Department sanction letters, booking reservation slips, and high-resolution official posters.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              15%
            </div>
            <h3 className="text-sm font-bold text-slate-900">Details Consistency</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chronological schedule validity (start &lt; end), detailed agenda length, and clear campus venue designations.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Architecture</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Full-Stack Technology Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <p className="text-slate-400 font-medium">Frontend</p>
            <p className="text-sm font-bold text-white mt-1">React.js &amp; Vite</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <p className="text-slate-400 font-medium">Styling</p>
            <p className="text-sm font-bold text-white mt-1">Tailwind CSS</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <p className="text-slate-400 font-medium">Backend &amp; DB</p>
            <p className="text-sm font-bold text-white mt-1">Firebase Firestore</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <p className="text-slate-400 font-medium">Maps &amp; QR</p>
            <p className="text-sm font-bold text-white mt-1">OpenStreetMap &amp; QR</p>
          </div>
        </div>
      </div>
    </div>
  );
}
