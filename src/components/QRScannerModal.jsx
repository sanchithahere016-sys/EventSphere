import React, { useState, useEffect } from 'react';
import { X, Camera, QrCode, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function QRScannerModal({ isOpen, onClose }) {
  const { events, checkInUserToEvent } = useEvents();
  const { currentUser } = useAuth();
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  const verifiedEvents = events.filter(e => e.status === 'Verified' && e.qrCodeString);

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isOpen && scannerActive) {
      try {
        html5QrcodeScanner = new Html5QrcodeScanner(
          'reader',
          { fps: 10, qrbox: { width: 220, height: 220 } },
          false
        );

        html5QrcodeScanner.render(
          (decodedText) => {
            handleCodeScanned(decodedText);
            html5QrcodeScanner.clear().catch(console.error);
          },
          (error) => {
            // normal frame error, ignore
          }
        );
      } catch (e) {
        console.warn('Camera scanner initialization notice:', e);
      }
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(console.error);
      }
    };
  }, [isOpen, scannerActive]);

  if (!isOpen) return null;

  const handleCodeScanned = (code) => {
    // Find matching verified event
    const matchedEvent = verifiedEvents.find(e => e.qrCodeString === code.trim());
    if (matchedEvent) {
      const res = checkInUserToEvent(matchedEvent.id, code.trim());
      setScanResult({
        success: res.success,
        event: matchedEvent,
        message: res.message
      });
      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      setScanResult({
        success: false,
        message: 'Scanned QR code does not match any currently verified event.'
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeScanned(manualCode.trim());
  };

  const handleQuickDemoScan = (ev) => {
    if (!ev.qrCodeString) return;
    handleCodeScanned(ev.qrCodeString);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Event Attendance Scanner
              </h2>
              <p className="text-xs text-slate-500">
                Scan or simulate attendee check-in
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
          {/* Scan Result Feedback */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              } flex items-start gap-3`}
            >
              {scanResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <p className="font-bold">{scanResult.message}</p>
                {scanResult.event && (
                  <p className="text-slate-600 mt-1">
                    Checked in to: <strong>{scanResult.event.title}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Camera Scanner Toggle / Container */}
          <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            {scannerActive ? (
              <div>
                <div id="reader" className="w-full max-w-xs mx-auto overflow-hidden rounded-xl"></div>
                <button
                  onClick={() => setScannerActive(false)}
                  className="mt-3 text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  Turn off live camera
                </button>
              </div>
            ) : (
              <button
                onClick={() => setScannerActive(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-brand-500 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all"
              >
                <Camera className="w-4 h-4 text-brand-600" />
                <span>Launch Live Camera Scanner</span>
              </button>
            )}
          </div>

          {/* Quick 1-Click Demo Scanner (Great for presentation) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Test Scans
              </span>
              <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">
                Instant Verification
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Click any verified event below to simulate scanning its unique attendance token:
            </p>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {verifiedEvents.map(ev => {
                const isCheckedIn = currentUser && ev.checkIns?.some(c => c.userId === currentUser.id);

                return (
                  <button
                    key={ev.id}
                    onClick={() => handleQuickDemoScan(ev)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200/90 hover:border-brand-300 hover:bg-brand-50/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <QrCode className="w-4 h-4 text-brand-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700 truncate">
                          {ev.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {ev.venue} • {ev.checkIns?.length || 0} checked in
                        </p>
                      </div>
                    </div>
                    {isCheckedIn ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        Checked In
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-50 group-hover:bg-brand-600 group-hover:text-white px-2 py-0.5 rounded-full transition-colors shrink-0">
                        Scan Pass
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Or Enter QR Token String Manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ES-CHECKIN-ev-1-HACKSPHERE-2026-SECRET"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors shadow-xs"
              >
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
