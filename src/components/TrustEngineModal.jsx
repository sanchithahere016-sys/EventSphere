import React from 'react';
import { X, ShieldCheck, Calculator, UserCheck, Users, FileCheck2, CheckCircle, Info } from 'lucide-react';
import { TRUST_WEIGHTS } from '../services/trustEngine';

export default function TrustEngineModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-soft">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Community-Powered Event Trust Engine
              </h2>
              <p className="text-xs text-slate-500">
                Mathematical Model & Anti-Misinformation Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Formula Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-indigo-50/50 to-accent-50 border border-brand-100">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              Core Weighted Formula
            </div>
            <div className="text-sm font-mono font-bold text-slate-800 bg-white p-3 rounded-xl border border-brand-200/80 shadow-xs leading-relaxed">
              Trust Score = (0.30 × Organizer Credibility) + (0.30 × Community Confirmation) + (0.25 × Evidence Quality) + (0.15 × Details Consistency)
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Every component is calculated independently on a normalized scale of 0 to 100, providing an unbiased composite score.
            </p>
          </div>

          {/* 4 Pillars Explained */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>1. Organizer Credibility (30%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates organizer track record, college institutional email domain verification, admin-approved profile credentials, and clean past event history without disciplinary flags.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Users className="w-4 h-4 shrink-0" />
                <span>2. Community Confirmation (30%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crowdsourced validation by authenticated campus members. Organizers cannot endorse their own listings. Community reports immediately deduct significant trust points.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>3. Evidence Quality (25%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Audits supporting artifacts submitted during event registration: official department sanction letters, venue booking receipts, high-res posters, and direct phone contact.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>4. Details Consistency (15%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algorithmic consistency check for valid timeline chronometry (start &lt; end time), verified campus building/hall names, and clear informational agenda.
              </p>
            </div>
          </div>

          {/* Scale Table */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Score Interpretation Thresholds
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50/60">
                <span className="font-bold text-emerald-800">80 – 100: High Trust</span>
                <span className="text-emerald-700">Exceptional evidence, verified organizer, strong community endorsement.</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50/60">
                <span className="font-bold text-amber-800">50 – 79: Moderate Trust</span>
                <span className="text-amber-700">Legitimate details, pending further community confirmations or review.</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50/60">
                <span className="font-bold text-rose-800">0 – 49: Low Trust</span>
                <span className="text-rose-700">Lacks supporting documents, unverified identity, or reported by community.</span>
              </div>
            </div>
          </div>

          {/* Essential Distinction */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Crucial System Safeguard:</strong> A High Trust score (80%+) provides transparent organic insight but does <em>not</em> grant an official college green checkmark. Only designated <strong>College Administrators</strong> can review physical evidence and grant official <strong>Verified</strong> status.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            Close Engine Overview
          </button>
        </div>
      </div>
    </div>
  );
}
