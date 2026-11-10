import React from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  QrCode,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import EventCard from '../components/EventCard';
import TrustScoreBadge from '../components/TrustScoreBadge';
import { useEvents } from '../context/EventContext';
import { EVENT_CATEGORIES } from '../data/initialEvents';

export default function HomePage({
  onNavigate,
  onViewEvent,
  onOpenTrustEngine,
  onOpenQR
}) {
  const {
    events,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity
  } = useEvents();

  // Featured verified events
  const featuredEvents = events.filter(e => e.status === 'Verified' && e.featured);
  // Upcoming events
  const upcomingEvents = events.filter(e => e.status === 'Verified' && !e.featured).slice(0, 4);
  // Pending review examples (demonstrating transparency)
  const pendingEvents = events.filter(e => e.status === 'Pending Verification').slice(0, 2);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('explore');
  };

  const cities = ['All Locations', 'Bengaluru', 'North Campus', 'Central Campus', 'West Campus'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-brand-50/60 via-indigo-50/30 to-transparent">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-400/10 via-accent-400/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200/80 shadow-soft text-xs font-bold text-brand-700 animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>Community-Powered Event Discovery & Trust Engine</span>
            </div>

            {/* Headline & Subtitle */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find Your Community.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600">
                Discover What's Happening Around You.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Explore local events, connect with people and discover trusted experiences in your neighbourhood.
            </p>

            {/* 4. Hero Search Bar with Location & Category Filters */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-2.5 sm:p-3 bg-white rounded-3xl shadow-soft-lg border border-slate-200/90 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2.5"
            >
              {/* Keyword Search Input */}
              <div className="flex-1 w-full flex items-center gap-3 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search hackathons, cultural fests, sports, workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              {/* Location Selector */}
              <div className="w-full md:w-48 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-slate-700 font-medium cursor-pointer"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="w-full md:w-48 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-slate-700 font-medium cursor-pointer"
                >
                  {EVENT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Metrics Banner */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Admin Evidence Audited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Crowdsourced Validation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-500" />
                <span>Verified QR Check-In</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Verified Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Campus Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Verified Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Officially sanctioned campus festivals and flagship technology conferences
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto group"
          >
            <span>View all verified events</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featuredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewEvent}
              onOpenTrustEngine={onOpenTrustEngine}
              onOpenQR={onOpenQR}
            />
          ))}
        </div>
      </section>

      {/* 6. Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Calendar Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Community Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Workshops, athletic competitions, and volunteer drives this month
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto group"
          >
            <span>Browse full schedule</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewEvent}
              onOpenTrustEngine={onOpenTrustEngine}
              onOpenQR={onOpenQR}
            />
          ))}
        </div>
      </section>

      {/* 7. How EventSphere Works Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden relative shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Community Verification Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              How EventSphere Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A 4-step pipeline that combines organizer accountability, crowdsourced student verification, and administrative audit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 relative group hover:border-brand-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-white">
                Organizer Submits
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus organizers submit event schedule, official posters, venue booking letters, and contact credentials. Starts as <strong>Pending Verification</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 relative group hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-white">
                Trust Engine Calculates
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our mathematical engine calculates an instant composite trust score based on evidence quality, schedule consistency, and organizer credibility.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 relative group hover:border-teal-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-white">
                Community Confirms
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Registered students endorse accurate listings or flag suspicious locations. Confirmations dynamically raise the trust score; reports penalize it.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 relative group hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                04
              </div>
              <h3 className="text-base font-bold text-white">
                Admin Verifies &amp; QR Active
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                College Administrators review physical permission slips and grant official <strong>Verified</strong> status, unlocking the live attendance QR pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Community Trust & Verification Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-50 via-white to-purple-50 border border-brand-100 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>The Core Innovation</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Community-Powered Event Trust Engine
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike ordinary event boards where anyone can post unverifiable listings, EventSphere evaluates every event against four transparent pillars using our weighted mathematical formula:
              </p>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs font-mono text-xs font-bold text-slate-800">
                Trust Score = (0.30 × Organizer) + (0.30 × Community) + (0.25 × Evidence) + (0.15 × Consistency)
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenTrustEngine}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Inspect Complete Mathematical Model
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  Learn About System Architecture
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">High Trust (80 - 100%)</p>
                  <p className="text-[11px] text-slate-500">Verified documents &amp; strong community backing</p>
                </div>
                <TrustScoreBadge score={94} size="md" />
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Moderate Trust (50 - 79%)</p>
                  <p className="text-[11px] text-slate-500">Credible organizer, awaiting more confirmations</p>
                </div>
                <TrustScoreBadge score={68} size="md" />
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Low Trust (0 - 49%)</p>
                  <p className="text-[11px] text-slate-500">Missing documentation or flagged by students</p>
                </div>
                <TrustScoreBadge score={28} size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call-To-Action: "Have an Event? Share It With Your Community" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-soft-lg">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-200 bg-white/10 px-3 py-1 rounded-full">
              For Student Clubs, Chapters &amp; Organizers
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Have an Event? Share It With Your Community.
            </h2>

            <p className="text-sm sm:text-base text-brand-100 leading-relaxed">
              Submit your campus conference, sports cup, or cultural fest. Provide supporting documents, build your community trust score, and issue verified attendance QR passes.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('submit')}
                className="px-6 py-3.5 bg-white text-brand-700 hover:bg-brand-50 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Submit Event for Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs sm:text-sm font-bold transition-all"
              >
                Explore Current Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
