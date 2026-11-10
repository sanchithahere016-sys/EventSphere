import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Grid,
  Map as MapIcon,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import EventCard from '../components/EventCard';
import EventMap from '../components/EventMap';
import { useEvents } from '../context/EventContext';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../data/initialEvents';

export default function ExplorePage({
  onViewEvent,
  onOpenTrustEngine,
  onOpenQR
}) {
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy
  } = useEvents();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Statuses');
    setSelectedDateFilter('all');
    setSelectedCity('All Locations');
    setSortBy('trust');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'All Statuses' ||
    selectedDateFilter !== 'all' ||
    selectedCity !== 'All Locations';

  const cities = ['All Locations', 'Bengaluru', 'North Campus', 'Central Campus', 'West Campus'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>Community Event Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus &amp; Local Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover verified events backed by supporting evidence and student confirmations
          </p>
        </div>

        {/* View Mode Toggle (Grid vs Interactive Map) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-auto border border-slate-200/80">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="space-y-4">
        {/* Search Bar + Secondary Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, club, venue, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium shadow-xs"
            />
          </div>

          {/* Location Filter */}
          <div className="md:col-span-2 relative">
            <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-2 relative">
            <Calendar className="w-4 h-4 text-brand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="today">Today Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer"
            >
              <option value="trust">Sort: Highest Trust Score</option>
              <option value="confirmations">Sort: Most Confirmations</option>
              <option value="date">Sort: Soonest Date</option>
              <option value="popular">Sort: Most Checked-In</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {EVENT_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Status Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
              Status Filter:
            </span>
            {EVENT_STATUSES.map(status => {
              const isSelected = selectedStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Active Filter Clear */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onOpenTrustEngine}
          className="text-brand-600 hover:underline font-semibold"
        >
          Understand Trust Scores →
        </button>
      </div>

      {/* Main View: Grid vs Interactive Map */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <EventMap
            events={filteredEvents}
            onSelectEvent={onViewEvent}
            className="h-[520px]"
          />
          <p className="text-xs text-slate-500 text-center">
            * Interactive Leaflet Map powered by OpenStreetMap tiles. Click any pin to inspect event preview and verified venue location.
          </p>
        </div>
      ) : (
        <>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
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
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No matching events found
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any events matching your selected search keywords and filter options.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
