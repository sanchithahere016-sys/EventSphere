import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert, Download, Building, Phone, Mail, ExternalLink } from 'lucide-react';

export default function EvidenceViewerModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  const evidence = event.evidence || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Supporting Evidence Audit
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-xs">
                {event.title}
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
        <div className="p-6 space-y-5">
          {/* Document Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Authorization Document
              </span>
              {evidence.hasDocuments ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  <ShieldAlert className="w-3.5 h-3.5" /> Missing Document
                </span>
              )}
            </div>

            {evidence.hasDocuments ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {evidence.documentName || 'Official_Approval_Document.pdf'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {evidence.documentType || 'College Sanction Letter'}
                    </p>
                  </div>
                </div>
                {evidence.documentUrl && (
                  <a
                    href={evidence.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="View Document"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No formal sanction letter or reservation slip was submitted during event registration.
              </p>
            )}
          </div>

          {/* Venue & Booking Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Venue Reservation & Room Booking Proof
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-700 pt-1">
              <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{event.venue}</p>
                <p className="text-slate-500">{event.location}, {event.city}</p>
                {evidence.bookingProof && (
                  <p className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200/80 p-2 rounded-lg mt-2 font-medium">
                    Booking Note: {evidence.bookingProof}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Verification */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Organizer Direct Contact Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="truncate text-slate-700 font-medium">
                  {event.contactEmail || event.organizerContact || 'No email provided'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate text-slate-700 font-medium">
                  {event.contactPhone || 'No direct phone provided'}
                </span>
              </div>
            </div>
            {evidence.contactInfo && (
              <p className="text-[11px] text-slate-500">
                Campus Location: {evidence.contactInfo}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
