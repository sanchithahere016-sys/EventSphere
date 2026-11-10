import React, { useRef } from 'react';
import { X, QrCode, Download, Printer, CheckCircle2, Users, ShieldCheck, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import confetti from 'canvas-confetti';

export default function QRModal({ isOpen, onClose, event }) {
  const { currentUser } = useAuth();
  const { checkInUserToEvent } = useEvents();
  const qrRef = useRef(null);

  if (!isOpen || !event) return null;

  const isVerified = event.status === 'Verified';
  const qrString = event.qrCodeString || `ES-CHECKIN-${event.id}-DEFAULT`;
  const isCheckedIn = currentUser && event.checkIns?.some(c => c.userId === currentUser.id);
  const totalCheckIns = event.checkIns?.length || 0;

  const handleInstantCheckIn = () => {
    if (!currentUser) return;
    const res = checkInUserToEvent(event.id, event.qrCodeString);
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Event Check-In Pass
              </h2>
              <p className="text-xs text-slate-500">
                Official verified attendance token
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
        <div className="p-6 text-center space-y-5">
          {!isVerified ? (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-sm font-bold">QR Check-In Inactive</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Check-in QR codes are strictly restricted to <strong>Officially Verified</strong> events to prevent fraudulent attendance logging. This event is currently <em>{event.status}</em>.
              </p>
            </div>
          ) : (
            <>
              {/* QR Code Container */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-brand-200 shadow-soft">
                <div ref={qrRef} className="p-2 bg-white rounded-xl">
                  <QRCodeSVG
                    value={qrString}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="mt-2 text-[10px] font-mono font-semibold text-slate-400 select-all">
                  {qrString}
                </div>
              </div>

              {/* Event Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {event.date} • {event.startTime} - {event.endTime}
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Venue: {event.venue}
                </p>
              </div>

              {/* Attendance Tracker */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-around text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>{totalCheckIns} Recorded Check-Ins</span>
                </div>
                {event.maxCapacity && (
                  <span className="text-slate-400">
                    / {event.maxCapacity} Capacity
                  </span>
                )}
              </div>

              {/* Self Check-in button for interactive demo */}
              <div className="pt-1">
                {isCheckedIn ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are checked in to this event!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstantCheckIn}
                    disabled={!currentUser}
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check In Now (Simulate Attendee Scan)</span>
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Note: Check-in records participant entry; administrators require verified evidence for official event credibility.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
