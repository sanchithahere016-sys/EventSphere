import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  FileCheck2,
  ShieldAlert,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useToast } from '../context/ToastContext';
import { EVENT_CATEGORIES } from '../data/initialEvents';
import { processFileUpload } from '../services/storageService';
import { detectDuplicates } from '../services/duplicateDetector';
import DuplicateWarningModal from '../components/DuplicateWarningModal';

export default function SubmitEventPage({ onNavigate, onViewEvent }) {
  const { currentUser, isOrganizer, isAuthenticated } = useAuth();
  const { events, submitEvent } = useEvents();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: EVENT_CATEGORIES[1], // 'College Events'
    date: '',
    startTime: '10:00',
    endTime: '16:00',
    venue: '',
    location: 'Apex Institute of Technology, Bengaluru',
    city: 'Bengaluru',
    contactEmail: currentUser?.email || '',
    contactPhone: currentUser?.contactPhone || '',
    maxCapacity: '250',
    registrationRequired: true,
    posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    evidenceDocumentName: '',
    evidenceDocumentType: 'Official Department Sanction Letter',
    evidenceBookingProof: '',
    evidenceContactInfo: ''
  });

  const [posterFile, setPosterFile] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePosterChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadRes = await processFileUpload(file);
        setPosterFile(uploadRes);
        setFormData(prev => ({ ...prev, posterUrl: uploadRes.url }));
        showToast('Poster preview loaded successfully!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleEvidenceChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadRes = await processFileUpload(file);
        setEvidenceFile(uploadRes);
        setFormData(prev => ({
          ...prev,
          evidenceDocumentName: file.name
        }));
        showToast('Supporting document attached!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in before submitting an event.', 'warning');
      onNavigate('auth');
      return;
    }

    // Validation
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      showToast('Event title must be at least 5 characters.', 'warning');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 25) {
      showToast('Please provide a detailed description (minimum 25 characters).', 'warning');
      return;
    }
    if (!formData.date) {
      showToast('Please select an event date.', 'warning');
      return;
    }
    if (!formData.venue.trim()) {
      showToast('Please specify the exact hall/venue.', 'warning');
      return;
    }

    // Check duplicate similarity
    const duplicateCheck = detectDuplicates(formData, events);
    if (duplicateCheck.hasPossibleDuplicate) {
      setDuplicateWarning(duplicateCheck.topMatch);
      return;
    }

    // Execute submission
    executeSubmission();
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue.trim(),
        location: formData.location.trim(),
        city: formData.city,
        coordinates: [12.9716, 77.5946], // Campus Hub default coords
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        maxCapacity: parseInt(formData.maxCapacity, 10) || 100,
        registrationRequired: formData.registrationRequired,
        posterUrl: formData.posterUrl,
        evidence: {
          hasPoster: Boolean(formData.posterUrl),
          hasDocuments: Boolean(formData.evidenceDocumentName || evidenceFile),
          documentName: formData.evidenceDocumentName || (evidenceFile ? evidenceFile.name : null),
          documentUrl: evidenceFile?.url || null,
          documentType: formData.evidenceDocumentType,
          bookingProof: formData.evidenceBookingProof || 'Venue requisition submitted',
          contactInfo: formData.evidenceContactInfo || `${formData.contactEmail} / ${formData.contactPhone}`
        }
      };

      const result = await submitEvent(eventPayload);
      setDuplicateWarning(null);
      if (result?.event?.id) {
        onViewEvent(result.event.id);
      } else {
        onNavigate('explore');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <span>Organizer Submission Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit Event for Community &amp; Admin Validation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          All listings are analyzed by our Community Trust Engine and placed in <strong>Pending Verification</strong> status until administrative review.
        </p>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Event Overview &amp; Category
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. RoboWars 2026: Inter-Collegiate Combat Robotics Challenge"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
                >
                  {EVENT_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Expected Capacity
                </label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 300"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Event Description *
              </label>
              <textarea
                required
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event format, schedule agenda, eligibility criteria, prize pool, and registration guidelines in detail (> 100 characters gives higher Trust Engine consistency score)..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Character count: {formData.description.length} (Comprehensive descriptions increase your Details Consistency score)
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Schedule & Venue */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. Date, Timing &amp; Campus Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Date *
              </label>
              <input
                type="date"
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                required
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Time *
              </label>
              <input
                type="time"
                required
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Venue / Hall / Room Designation *
              </label>
              <input
                type="text"
                required
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Sir MV Auditorium, Central Campus Block"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus / Neighborhood Location *
              </label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Apex Institute of Technology, North Campus"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Supporting Evidence & Documentation (Critical for Trust Score) */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                3. Supporting Evidence &amp; Visual Verification
              </h2>
              <p className="text-xs text-slate-500">
                Crucial for the Evidence Quality pillar (+40 points on Trust Engine)
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Pillar Weight: 25%
            </span>
          </div>

          {/* Event Poster Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Event Poster Image (File or URL) *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-brand-600" />
                <span>Choose Poster File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400">or image URL:</span>

              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            {formData.posterUrl && (
              <div className="mt-3 relative w-48 aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={formData.posterUrl} alt="Poster preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold">
                  Preview
                </span>
              </div>
            )}
          </div>

          {/* Official Sanction Document / Booking Slip */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Official Institutional Approval Document</span>
            </div>

            <p className="text-xs text-teal-800 leading-relaxed">
              Upload dean sanction letter, department approval, venue reservation slip, or police/sound clearance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-teal-950 mb-1">
                  Document Type
                </label>
                <select
                  name="evidenceDocumentType"
                  value={formData.evidenceDocumentType}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 rounded-xl border border-teal-200 bg-white focus:outline-none"
                >
                  <option value="Official Department Sanction Letter">Official Department Sanction Letter</option>
                  <option value="Dean Student Affairs Approval Order">Dean Student Affairs Approval Order</option>
                  <option value="Campus Auditorium Booking Voucher">Campus Auditorium Booking Voucher</option>
                  <option value="Student Council Festival Permit">Student Council Festival Permit</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-teal-950 mb-1">
                  Attach PDF or Document Photo
                </label>
                <label className="w-full px-3 py-2.5 bg-white border border-teal-200 rounded-xl cursor-pointer text-xs font-semibold text-teal-900 flex items-center justify-between">
                  <span className="truncate">
                    {formData.evidenceDocumentName || 'Choose Approval File...'}
                  </span>
                  <Upload className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleEvidenceChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-teal-950 mb-1">
                Venue Booking Identifier / Reference Number
              </label>
              <input
                type="text"
                name="evidenceBookingProof"
                value={formData.evidenceBookingProof}
                onChange={handleChange}
                placeholder="e.g. Hall Reservation ID #AUD-2026-992 approved by Estate Officer"
                className="w-full text-xs p-2.5 rounded-xl border border-teal-200 bg-white focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Organizer Identity & Direct Contact */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            4. Organizer Identity &amp; Contact Credentials
          </h2>

          <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt=""
              className="w-10 h-10 rounded-xl object-cover border border-blue-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Submitting as: {currentUser?.name || 'Guest Organizer'}
              </p>
              <p className="text-[11px] text-slate-500">
                Role: {currentUser?.role} • Institution: {currentUser?.institution || 'Apex Institute'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Contact Email *
              </label>
              <input
                type="email"
                required
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="organizer@college.edu"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Direct Contact Phone *
              </label>
              <input
                type="tel"
                required
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
          <div className="text-xs text-slate-400 space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automatic Pre-Submission Auditing Active</span>
            </p>
            <p>Duplicate detector &amp; Trust Engine will evaluate listing upon click.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Evaluating Submission...' : 'Submit Event for Verification'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Duplicate Detection Warning Modal */}
      {duplicateWarning && (
        <DuplicateWarningModal
          isOpen={Boolean(duplicateWarning)}
          onClose={() => setDuplicateWarning(null)}
          duplicateMatch={duplicateWarning}
          newEventData={formData}
          onConfirmSubmit={executeSubmission}
        />
      )}
    </div>
  );
}
