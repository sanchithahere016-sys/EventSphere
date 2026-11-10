import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  FileCheck2,
  Calendar,
  Search,
  Filter,
  Check,
  X,
  Eye,
  AlertCircle,
  Copy,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import confetti from 'canvas-confetti';

export default function AdminDashboardPage({
  onViewEvent,
  onOpenEvidence,
  onOpenTrustEngine
}) {
  const { currentUser, isAdmin, users, toggleOrganizerVerification } = useAuth();
  const { events, approveEvent, rejectEvent } = useEvents();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'reported' | 'duplicates' | 'users' | 'all'
  const [rejectingEvent, setRejectingEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This portal is reserved for College Event Verification Administrators and Dean Reviewers.
        </p>
      </div>
    );
  }

  // KPI Calculations
  const totalUsers = users.length;
  const totalEvents = events.length;
  const pendingEvents = events.filter(e => e.status === 'Pending Verification');
  const verifiedEvents = events.filter(e => e.status === 'Verified');
  const rejectedEvents = events.filter(e => e.status === 'Rejected');
  const reportedEvents = events.filter(e => e.status === 'Reported' || (e.reports && e.reports.length > 0));

  let totalCheckIns = 0;
  events.forEach(e => {
    totalCheckIns += (e.checkIns?.length || 0);
  });

  // Duplicate candidates
  const suspectedDuplicates = events.filter(e => e.potentialDuplicateMatch);

  const handleApprove = (eventId) => {
    approveEvent(eventId);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
  };

  const handleOpenRejectModal = (ev) => {
    setRejectingEvent(ev);
    setRejectionReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingEvent || !rejectionReason.trim()) return;
    rejectEvent(rejectingEvent.id, rejectionReason.trim());
    setRejectingEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>Administrator Compliance Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Event Verification &amp; Trust Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.title || 'Dean/Admin'})
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Events</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalEvents}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-amber-700">Pending</p>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingEvents.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-emerald-700">Verified</p>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{verifiedEvents.length}</p>
        </div>
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-rose-700">Reported</p>
          <p className="text-2xl font-extrabold text-rose-800 mt-1">{reportedEvents.length}</p>
        </div>
        <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-500">Rejected</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{rejectedEvents.length}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-blue-700">Check-Ins</p>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">{totalCheckIns}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-100 text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Review Queue ({pendingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reported')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'reported'
              ? 'bg-rose-100 text-rose-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Disputed &amp; Reported ({reportedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'duplicates'
              ? 'bg-purple-100 text-purple-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Duplicate Conflicts ({suspectedDuplicates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'bg-blue-100 text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Organizer Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All Events Roster ({events.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingEvents.length > 0 ? (
            <div className="space-y-4">
              {pendingEvents.map(event => (
                <div
                  key={event.id}
                  className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-soft flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={event.posterUrl}
                      alt=""
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Pending Verification
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">{event.category}</span>
                        <TrustScoreBadge score={event.trustScore || 0} size="sm" />
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {event.title}
                      </h3>

                      <p className="text-xs text-slate-500">
                        📅 {event.date} • {event.startTime} - {event.endTime} | 📍 {event.venue}
                      </p>

                      <p className="text-xs text-slate-600">
                        Organizer: <strong>{event.organizerName}</strong> ({event.contactEmail})
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => onOpenEvidence(event)}
                      className="px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-teal-600" />
                      <span>Audit Evidence</span>
                    </button>

                    <button
                      onClick={() => onViewEvent(event.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => handleOpenRejectModal(event)}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(event.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-soft transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Grant Verified Status</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Review Queue Clear</h3>
              <p className="text-xs text-slate-500">
                All submitted events have been reviewed. Good job!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reported / Disputed Events */}
      {activeTab === 'reported' && (
        <div className="space-y-4">
          {reportedEvents.length > 0 ? (
            <div className="space-y-4">
              {reportedEvents.map(event => (
                <div
                  key={event.id}
                  className="p-6 rounded-3xl bg-white border border-rose-200 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                            {event.reports?.length || 0} Reports Filed
                          </span>
                          <span className="text-xs text-slate-400">Current Status: {event.status}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{event.title}</h3>
                        <p className="text-xs text-slate-500">
                          Venue: {event.venue} • Organizer: {event.organizerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewEvent(event.id)}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                      >
                        Inspect Event
                      </button>
                      <button
                        onClick={() => handleOpenRejectModal(event)}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                      >
                        Enforce Rejection
                      </button>
                    </div>
                  </div>

                  {/* Reports Breakdown Ledger */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-950">
                      Community Complaint Ledger:
                    </p>
                    <div className="space-y-2">
                      {event.reports?.map(rep => (
                        <div key={rep.id} className="p-2.5 bg-white rounded-xl border border-rose-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-800">
                              🚩 {rep.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Reported by: {rep.userName}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 italic">
                            "{rep.reason}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Zero Active Community Disputes</h3>
              <p className="text-xs text-slate-500">
                No events currently carry community complaint flags.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Duplicate Conflicts */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          {suspectedDuplicates.length > 0 ? (
            <div className="space-y-4">
              {suspectedDuplicates.map(event => {
                const dup = event.potentialDuplicateMatch;
                const existing = dup?.existingEvent;

                return (
                  <div key={event.id} className="p-6 rounded-3xl bg-white border border-purple-200 shadow-soft space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-purple-900">
                          Suspected Duplicate ({dup.confidence}% Match)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Status: {event.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Candidate Submission</span>
                        <p className="font-bold text-slate-900">{event.title}</p>
                        <p className="text-slate-500">Date: {event.date} • Venue: {event.venue}</p>
                      </div>

                      {existing && (
                        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-purple-700">Existing Prior Event</span>
                          <p className="font-bold text-slate-900">{existing.title}</p>
                          <p className="text-slate-500">Date: {existing.date} • Venue: {existing.venue}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewEvent(event.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
                      >
                        Compare in Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Suspected Duplicate Listings</h3>
              <p className="text-xs text-slate-500">
                The smart duplicate engine has not flagged any conflicting listings.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: User & Organizer Credentials */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Registered Organizers &amp; Reputation Roster
            </h3>
            <span className="text-xs text-slate-500">
              {users.length} Total Users
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map(u => (
              <div key={u.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{u.email}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {u.title || 'Campus Member'} • {u.institution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {u.isVerifiedOrganizer ? (
                    <button
                      onClick={() => toggleOrganizerVerification(u.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      title="Click to toggle status"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified Organizer</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleOrganizerVerification(u.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Verify Organizer</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: All Events Master Table */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Complete Event Directory</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {events.map(ev => (
              <div key={ev.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ev.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                      ev.status === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
                      ev.status === 'Reported' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ev.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">{ev.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.title}</h4>
                  <p className="text-xs text-slate-500">
                    {ev.date} | {ev.venue} | Trust: {ev.trustScore}%
                  </p>
                </div>
                <button
                  onClick={() => onViewEvent(ev.id)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal with Mandatory Feedback Reason */}
      {rejectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Reject Event Submission
              </h3>
              <button
                onClick={() => setRejectingEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Rejecting: <strong>{rejectingEvent.title}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rejection Reason (Sent to Organizer) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Venue booking letter is unverified, missing faculty advisor approval, or unauthorized commercial solicitation..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
