import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Users,
  Building,
  Mail,
  Phone,
  Bookmark,
  QrCode,
  Share2,
  FileCheck2,
  AlertTriangle,
  ArrowLeft,
  Download,
  CalendarPlus,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import TrustScoreBadge from '../components/TrustScoreBadge';
import EventMap from '../components/EventMap';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../services/calendarService';

export default function EventDetailPage({
  eventId,
  onBack,
  onOpenConfirmation,
  onOpenReport,
  onOpenEvidence,
  onOpenQR,
  onOpenTrustEngine
}) {
  const { events, favourites, handleToggleFavourite } = useEvents();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500">The event you are looking for does not exist or may have been removed.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const isFav = favourites.includes(event.id);
  const isVerified = event.status === 'Verified';
  const isOwnEvent = currentUser && event.organizerId === currentUser.id;
  const alreadyConfirmed = currentUser && event.confirmations?.some(c => c.userId === currentUser.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventSphere!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Calendar Export */}
          <button
            onClick={() => downloadIcsFile(event)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-colors shadow-xs flex items-center gap-1.5"
            title="Download .ics Calendar File"
          >
            <CalendarPlus className="w-4 h-4 text-brand-600" />
            <span className="hidden sm:inline">Add to Calendar</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => handleToggleFavourite(event.id)}
            className={`p-2 rounded-xl border transition-colors shadow-xs ${
              isFav
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-white text-slate-700 border-slate-200 hover:text-rose-500 hover:bg-slate-50'
            }`}
            title={isFav ? 'Remove from favourites' : 'Save to favourites'}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Event Details + Right Trust Engine & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Details, Poster, Venue Map) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Hero Poster Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-soft bg-slate-100 aspect-[16/9]">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
                {event.category}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4" />
                  Officially Verified
                </span>
              ) : event.status === 'Reported' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md backdrop-blur-md">
                  <ShieldX className="w-4 h-4" />
                  Reported by Community
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md backdrop-blur-md">
                  <ShieldAlert className="w-4 h-4" />
                  Pending Review
                </span>
              )}
            </div>

            {/* Title & Timing on Poster Bottom */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {event.title}
              </h1>
              <p className="text-xs text-white/90 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-300" />
                <span>{event.date}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-brand-300" />
                <span>{event.startTime} - {event.endTime}</span>
              </p>
            </div>
          </div>

          {/* Quick Schedule, Venue & Capacity Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Date &amp; Time</p>
                <p className="text-xs font-bold text-slate-800 truncate">{event.date}</p>
                <p className="text-[11px] text-slate-500">{event.startTime} - {event.endTime}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Campus Venue</p>
                <p className="text-xs font-bold text-slate-800 truncate" title={event.venue}>{event.venue}</p>
                <p className="text-[11px] text-slate-500 truncate">{event.location}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Attendance</p>
                <p className="text-xs font-bold text-slate-800">
                  {event.checkIns?.length || 0} Checked In
                </p>
                <p className="text-[11px] text-slate-500">
                  {event.confirmations?.length || 0} Endorsements
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              About This Event
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Reputation Profile Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-600" />
                <span>Organizer Credibility</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Pillar Weight: 30%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {event.organizerName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct Contact: {event.contactEmail || event.organizerContact}
                </p>
                {event.contactPhone && (
                  <p className="text-xs text-slate-500">
                    Phone: {event.contactPhone}
                  </p>
                )}
              </div>

              <div className="text-right self-start sm:self-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>College Verified Organizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Evidence Button Callout */}
          <div className="p-6 bg-teal-50/70 rounded-3xl border border-teal-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-teal-950 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-600" />
                <span>Submitted Authorization Evidence</span>
              </h4>
              <p className="text-xs text-teal-800 leading-relaxed">
                Inspect official department sanction letters, venue reservations, and contact affidavits.
              </p>
            </div>
            <button
              onClick={() => onOpenEvidence(event)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Audit Supporting Evidence</span>
            </button>
          </div>

          {/* Interactive Venue Map */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <span>Campus Location &amp; Venue Map</span>
              </h3>
              <span className="text-xs text-slate-500">{event.venue}</span>
            </div>

            <EventMap
              events={[event]}
              selectedEvent={event}
              className="h-72"
            />
          </div>

          {/* Community Confirmations Ledger */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Community Confirmation Ledger</span>
              </h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {event.confirmations?.length || 0} Endorsements
              </span>
            </div>

            {event.confirmations?.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {event.confirmations.map((conf, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-800">{conf.userName}</span>
                        {conf.userRole && (
                          <span className="text-[10px] text-slate-400">({conf.userRole})</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 italic">
                        "{conf.note}"
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(conf.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No community members have confirmed this listing yet. Be the first to validate it!
              </p>
            )}
          </div>
        </div>

        {/* Right Column (Community Trust Engine Gauge & Actions) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Trust Score Gauge Card */}
          <TrustScoreGauge
            trustAnalysis={event.trustAnalysis}
            onOpenExplainer={onOpenTrustEngine}
          />

          {/* Primary Action Buttons */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Community Actions
            </h3>

            {/* Check-In Pass Button (If Verified) */}
            {isVerified ? (
              <button
                onClick={() => onOpenQR(event)}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>View Attendance QR Pass</span>
              </button>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                <QrCode className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span>QR Check-In unlocks when officially Verified</span>
              </div>
            )}

            {/* Confirm Accuracy Button */}
            <button
              onClick={() => onOpenConfirmation(event)}
              disabled={isOwnEvent || alreadyConfirmed}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                alreadyConfirmed
                  ? 'bg-purple-50 text-purple-700 border-purple-200 cursor-default'
                  : isOwnEvent
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {alreadyConfirmed
                  ? 'You Confirmed This Event'
                  : isOwnEvent
                  ? 'Organizer Cannot Confirm Own Event'
                  : 'Confirm Event Accuracy (+Trust)'}
              </span>
            </button>

            {/* Report Suspicious Listing Button */}
            <button
              onClick={() => onOpenReport(event)}
              className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Incorrect Venue / Suspicious Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
