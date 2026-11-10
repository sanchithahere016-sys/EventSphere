import React, { useState } from 'react';
import {
  FolderHeart,
  Bookmark,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  User,
  CheckCircle2,
  Trash2,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function MyEventsPage({
  onNavigate,
  onViewEvent,
  onOpenTrustEngine,
  onOpenQR
}) {
  const { currentUser, isAuthenticated } = useAuth();
  const { events, favourites } = useEvents();

  const [activeTab, setActiveTab] = useState('favourites'); // 'favourites' | 'checkins' | 'created'

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view your dashboard</h2>
        <p className="text-xs text-slate-500">
          Access your saved bookmarked events, attendance check-in passes, and organized event analytics.
        </p>
        <button
          onClick={() => onNavigate('auth')}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-soft hover:bg-brand-700 transition-all"
        >
          Login or Register
        </button>
      </div>
    );
  }

  // Filtered lists
  const savedEvents = events.filter(e => favourites.includes(e.id));
  const createdEvents = events.filter(e => e.organizerId === currentUser.id);

  // User's attendance check-ins across all events
  const userCheckIns = [];
  events.forEach(ev => {
    const matchingCheckIn = ev.checkIns?.find(c => c.userId === currentUser.id);
    if (matchingCheckIn) {
      userCheckIns.push({
        event: ev,
        checkIn: matchingCheckIn
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              {currentUser.institutionVerified && (
                <span className="p-1 bg-blue-100 text-blue-700 rounded-full" title="Institution Email Verified">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {currentUser.title || currentUser.role} • {currentUser.institution}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center min-w-[80px]">
            <p className="text-base font-extrabold text-slate-900">{savedEvents.length}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Saved</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center min-w-[80px]">
            <p className="text-base font-extrabold text-slate-900">{userCheckIns.length}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Check-Ins</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center min-w-[80px]">
            <p className="text-base font-extrabold text-slate-900">{createdEvents.length}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Created</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('favourites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'favourites'
              ? 'bg-rose-50 text-rose-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Favourites ({savedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checkins')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'checkins'
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Attendance Passes ({userCheckIns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'created'
              ? 'bg-purple-50 text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Events I Organized ({createdEvents.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Favourites */}
      {activeTab === 'favourites' && (
        <div>
          {savedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={onViewEvent}
                  onOpenTrustEngine={onOpenTrustEngine}
                  onOpenQR={onOpenQR}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No saved events yet</h3>
              <p className="text-xs text-slate-500">
                Click the bookmark icon on any event card to save it for quick access later.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Explore Events
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Attendance Passes & Check-ins */}
      {activeTab === 'checkins' && (
        <div className="space-y-4">
          {userCheckIns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCheckIns.map(({ event, checkIn }) => (
                <div
                  key={event.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Attendance Recorded
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(checkIn.scannedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {event.venue}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Scanned at: {new Date(checkIn.scannedAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onOpenQR(event)}
                      className="flex-1 py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                    <button
                      onClick={() => onViewEvent(event.id)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <QrCode className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No attendance records yet</h3>
              <p className="text-xs text-slate-500">
                When you check in at verified campus events, your attendance passes will be recorded here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Created Events */}
      {activeTab === 'created' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => onNavigate('submit')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Event</span>
            </button>
          </div>

          {createdEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={onViewEvent}
                  onOpenTrustEngine={onOpenTrustEngine}
                  onOpenQR={onOpenQR}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No organized events yet</h3>
              <p className="text-xs text-slate-500">
                You haven't submitted any event listings under this account.
              </p>
              <button
                onClick={() => onNavigate('submit')}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                Submit Your First Event
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
