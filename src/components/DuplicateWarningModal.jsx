import React from 'react';
import { AlertTriangle, Copy, ArrowRight, Check, X } from 'lucide-react';

export default function DuplicateWarningModal({ isOpen, onClose, duplicateMatch, newEventData, onConfirmSubmit }) {
  if (!isOpen || !duplicateMatch) return null;

  const existing = duplicateMatch.existingEvent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Duplicate Event Warning
              </h2>
              <p className="text-xs text-amber-100">
                Potential listing conflict detected ({duplicateMatch.confidence}% match confidence)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/90 text-xs text-amber-900 leading-relaxed font-medium">
            "A similar event may already exist. Please review the existing listing before submitting."
          </div>

          {/* Matched reasons pills */}
          <div className="flex flex-wrap gap-1.5">
            {duplicateMatch.reasons?.map((reason, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200"
              >
                • {reason}
              </span>
            ))}
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* New Event Candidate */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="font-bold text-brand-700 text-[11px] uppercase tracking-wider">
                Your Submission
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {newEventData.title}
              </p>
              <div className="text-slate-600 space-y-1">
                <p><strong>Date:</strong> {newEventData.date}</p>
                <p><strong>Time:</strong> {newEventData.startTime} - {newEventData.endTime}</p>
                <p><strong>Venue:</strong> {newEventData.venue}</p>
                <p><strong>Category:</strong> {newEventData.category}</p>
              </div>
            </div>

            {/* Existing Event in Database */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="font-bold text-amber-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>Existing Listing</span>
                <span className="font-semibold text-[10px] bg-amber-100 px-2 py-0.5 rounded-full">
                  Status: {existing.status}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {existing.title}
              </p>
              <div className="text-slate-600 space-y-1">
                <p><strong>Date:</strong> {existing.date}</p>
                <p><strong>Time:</strong> {existing.startTime} - {existing.endTime}</p>
                <p><strong>Venue:</strong> {existing.venue}</p>
                <p><strong>Organizer:</strong> {existing.organizerName}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            * To protect community members against fraudulent or double listings, administrators will review both listings side-by-side if you proceed.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Review & Edit Submission
          </button>
          <button
            type="button"
            onClick={onConfirmSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Proceed Anyway</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
