import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Bookmark,
  Users,
  QrCode,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';
import { useEvents } from '../context/EventContext';

export default function EventCard({
  event,
  onViewDetails,
  onOpenTrustEngine = null,
  onOpenQR = null
}) {
  const { favourites, handleToggleFavourite } = useEvents();
  const isFav = favourites.includes(event.id);

  // Status badge styling
  const getStatusBadge = () => {
    switch (event.status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case 'Reported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-xs">
            <ShieldX className="w-3.5 h-3.5" />
            Reported
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700/90 text-white backdrop-blur-md shadow-xs">
            Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-700/90 text-white backdrop-blur-md shadow-xs">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const confirmCount = event.confirmations?.length || 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
            {event.category}
          </span>
        </div>

        {/* Status Badge & Bookmark Button */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {getStatusBadge()}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavourite(event.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
              isFav
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={isFav ? 'Remove from favourites' : 'Save to favourites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Floating Trust Score Badge over poster bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <TrustScoreBadge
            score={event.trustScore || 0}
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              if (onOpenTrustEngine) onOpenTrustEngine(event);
            }}
          />

          {confirmCount > 0 && (
            <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-300" />
              <span>{confirmCount} confirmed</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3
            onClick={() => onViewDetails(event.id)}
            className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 cursor-pointer"
            title={event.title}
          >
            {event.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Schedule & Venue Meta */}
        <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="font-semibold text-slate-800">{event.date}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">{event.startTime} - {event.endTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate text-slate-600" title={event.venue}>
              {event.venue}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {event.organizerName}
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-2 flex items-center gap-2">
          {event.status === 'Verified' && onOpenQR && (
            <button
              onClick={() => onOpenQR(event)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/50 transition-all shadow-xs"
              title="View QR Check-In Pass"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onViewDetails(event.id)}
            className="flex-1 py-2 px-3.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 group/btn"
          >
            <span>Explore Event</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
