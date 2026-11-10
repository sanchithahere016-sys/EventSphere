import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function ConfirmationModal({ isOpen, onClose, event }) {
  const { currentUser } = useAuth();
  const { confirmEvent } = useEvents();
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !event) return null;

  const isOwnEvent = currentUser && event.organizerId === currentUser.id;
  const alreadyConfirmed = currentUser && event.confirmations?.some(c => c.userId === currentUser.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser || isOwnEvent || alreadyConfirmed) return;

    setIsSubmitting(true);
    confirmEvent(event.id, note);
    setIsSubmitting(false);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Community Confirmation
              </h2>
              <p className="text-xs text-slate-500">
                Validate campus event authenticity
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-2xl">
            <p className="text-xs font-semibold text-purple-950 mb-1">
              You are endorsing:
            </p>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">
              {event.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Venue: {event.venue}
            </p>
          </div>

          {/* Validation Warnings */}
          {isOwnEvent && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>Organizers cannot confirm their own event listings. Community validation must be independent.</span>
            </div>
          )}

          {alreadyConfirmed && !isOwnEvent && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-800">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>You have already confirmed this event! Your contribution is counted in the trust score.</span>
            </div>
          )}

          {!currentUser && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Please log in to submit a community confirmation.</span>
            </div>
          )}

          {!isOwnEvent && !alreadyConfirmed && currentUser && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Verification Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Saw official posters in cafeteria, confirmed with faculty advisor, or attended previous editions."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your name ({currentUser.name}) and institution affiliation will appear in the confirmation ledger.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!currentUser || isOwnEvent || alreadyConfirmed || isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Event Accuracy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
