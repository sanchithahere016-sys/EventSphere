import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  getStoredEvents,
  saveStoredEvents,
  getStoredFavourites,
  toggleStoredFavourite,
  resetToDemoDefaults
} from '../services/firebase';
import { calculateEventTrustScore } from '../services/trustEngine';
import { detectDuplicates } from '../services/duplicateDetector';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const { currentUser, users } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState(() => getStoredEvents());
  const [favourites, setFavourites] = useState(() => {
    return currentUser ? getStoredFavourites(currentUser.id) : [];
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all'); // 'all', 'today', 'this-week', 'this-month'
  const [selectedCity, setSelectedCity] = useState('All Locations');
  const [sortBy, setSortBy] = useState('trust'); // 'trust', 'date', 'confirmations', 'popular'

  // Update favourites when current user changes
  useEffect(() => {
    if (currentUser) {
      setFavourites(getStoredFavourites(currentUser.id));
    } else {
      setFavourites([]);
    }
  }, [currentUser]);

  // Persist events whenever they change
  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  // Helper to find an organizer by ID or name
  const getOrganizerProfile = useCallback((organizerId, organizerName) => {
    if (organizerId) {
      const match = users.find(u => u.id === organizerId);
      if (match) return match;
    }
    if (organizerName) {
      const match = users.find(u => u.name?.toLowerCase() === organizerName?.toLowerCase());
      if (match) return match;
    }
    return {
      name: organizerName || 'Community Organizer',
      isVerifiedOrganizer: false,
      institutionVerified: false,
      completedEventsCount: 0,
      flaggedCount: 0
    };
  }, [users]);

  // Enrich events with real-time calculated Trust Scores
  const enrichedEvents = useMemo(() => {
    return events.map(event => {
      const organizer = getOrganizerProfile(event.organizerId, event.organizerName);
      const trustAnalysis = calculateEventTrustScore(event, organizer, events);

      return {
        ...event,
        trustScore: trustAnalysis.totalScore,
        trustLevel: trustAnalysis.trustLevel,
        badgeColor: trustAnalysis.badgeColor,
        trustAnalysis
      };
    });
  }, [events, getOrganizerProfile]);

  // Toggle Favourite
  const handleToggleFavourite = useCallback((eventId) => {
    if (!currentUser) {
      showToast('Please log in to save favourite events.', 'warning');
      return false;
    }
    const result = toggleStoredFavourite(currentUser.id, eventId);
    setFavourites(result.favourites);
    showToast(
      result.isFavourite ? 'Event saved to your favourites!' : 'Event removed from favourites.',
      'info'
    );
    return result.isFavourite;
  }, [currentUser, showToast]);

  // Submit New Event
  const submitEvent = useCallback(async (eventFormData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to submit an event.');
    }

    // Run duplicate detection
    const duplicateCheck = detectDuplicates(eventFormData, events);

    const newId = `ev-${Date.now()}`;
    const newEvent = {
      id: newId,
      ...eventFormData,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      organizerContact: currentUser.email,
      contactEmail: eventFormData.contactEmail || currentUser.email,
      contactPhone: eventFormData.contactPhone || currentUser.contactPhone || '',
      status: 'Pending Verification', // Required initial state
      adminVerifiedBy: null,
      adminVerifiedAt: null,
      confirmations: [],
      reports: [],
      checkIns: [],
      qrCodeString: null, // Only verified events receive active QR codes
      createdAt: new Date().toISOString(),
      potentialDuplicateMatch: duplicateCheck.hasPossibleDuplicate ? duplicateCheck.topMatch : null
    };

    setEvents(prev => [newEvent, ...prev]);
    showToast('Event submitted successfully! Awaiting administrator verification.', 'success');
    return { event: newEvent, duplicateCheck };
  }, [currentUser, events, showToast]);

  // Confirm Event Accuracy
  const confirmEvent = useCallback((eventId, note = '') => {
    if (!currentUser) {
      showToast('Please log in to confirm event details.', 'warning');
      return;
    }

    const target = events.find(e => e.id === eventId);
    if (!target) return;

    // Check: Cannot confirm own event
    if (target.organizerId === currentUser.id) {
      showToast('Event organizers cannot confirm their own events.', 'warning');
      return;
    }

    // Check: Cannot confirm twice
    const alreadyConfirmed = target.confirmations?.some(c => c.userId === currentUser.id);
    if (alreadyConfirmed) {
      showToast('You have already confirmed this event.', 'info');
      return;
    }

    const newConfirmation = {
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userTitle: currentUser.title,
      timestamp: new Date().toISOString(),
      note: note.trim() || 'Confirmed accurate by community member.'
    };

    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          const updatedConfirmations = [...(e.confirmations || []), newConfirmation];
          return { ...e, confirmations: updatedConfirmations };
        }
        return e;
      })
    );

    showToast('Thank you! Your community confirmation has increased this event\'s trust score.', 'success');
  }, [currentUser, events, showToast]);

  // Report Event
  const reportEvent = useCallback((eventId, { category, reason }) => {
    if (!currentUser) {
      showToast('Please log in to report suspicious events.', 'warning');
      return;
    }

    const target = events.find(e => e.id === eventId);
    if (!target) return;

    // Check: Cannot report twice
    const alreadyReported = target.reports?.some(r => r.userId === currentUser.id);
    if (alreadyReported) {
      showToast('You have already submitted a report for this event.', 'info');
      return;
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
      category: category || 'Suspicious Event',
      reason: reason.trim()
    };

    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          const updatedReports = [...(e.reports || []), newReport];
          // If reports reach 2 or more and event was pending, flag as Reported
          const newStatus = updatedReports.length >= 2 && e.status !== 'Rejected' ? 'Reported' : e.status;
          return {
            ...e,
            reports: updatedReports,
            status: newStatus
          };
        }
        return e;
      })
    );

    showToast('Report submitted for Administrator review. Trust score has been updated.', 'warning');
  }, [currentUser, events, showToast]);

  // Admin: Approve Event
  const approveEvent = useCallback((eventId) => {
    if (!currentUser || currentUser.role !== 'Administrator') {
      showToast('Unauthorized: Administrator privileges required.', 'error');
      return;
    }

    const uniqueQr = `ES-CHECKIN-${eventId}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            status: 'Verified',
            adminVerifiedBy: currentUser.name,
            adminVerifiedAt: new Date().toISOString(),
            qrCodeString: e.qrCodeString || uniqueQr
          };
        }
        return e;
      })
    );

    showToast('Event approved and officially Verified! QR check-in is now active.', 'success');
  }, [currentUser, showToast]);

  // Admin: Reject Event
  const rejectEvent = useCallback((eventId, rejectionReason) => {
    if (!currentUser || currentUser.role !== 'Administrator') {
      showToast('Unauthorized: Administrator privileges required.', 'error');
      return;
    }

    if (!rejectionReason || rejectionReason.trim().length < 5) {
      showToast('Please provide a specific rejection reason for the organizer.', 'warning');
      return;
    }

    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            status: 'Rejected',
            adminRejectionReason: rejectionReason.trim(),
            adminReviewedBy: currentUser.name,
            adminReviewedAt: new Date().toISOString(),
            qrCodeString: null // Revoke QR code if any
          };
        }
        return e;
      })
    );

    showToast('Event has been rejected with administrative feedback.', 'info');
  }, [currentUser, showToast]);

  // QR Check-in Handler
  const checkInUserToEvent = useCallback((eventId, providedCode = null) => {
    if (!currentUser) {
      showToast('Please log in before scanning or checking in.', 'warning');
      return { success: false, message: 'User not authenticated' };
    }

    const target = events.find(e => e.id === eventId);
    if (!target) {
      showToast('Event not found.', 'error');
      return { success: false, message: 'Event not found' };
    }

    // Verification check
    if (target.status !== 'Verified') {
      showToast('Only officially verified events have active QR check-ins.', 'warning');
      return { success: false, message: 'Event is not verified' };
    }

    // Check code if provided
    if (providedCode && target.qrCodeString && providedCode.trim() !== target.qrCodeString.trim()) {
      showToast('Invalid QR check-in code for this event.', 'error');
      return { success: false, message: 'Invalid QR code' };
    }

    // Prevent duplicate check-in
    const alreadyCheckedIn = target.checkIns?.some(c => c.userId === currentUser.id);
    if (alreadyCheckedIn) {
      showToast('You are already checked in to this event!', 'info');
      return { success: false, message: 'Already checked in' };
    }

    const checkInRecord = {
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      scannedAt: new Date().toISOString()
    };

    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            checkIns: [...(e.checkIns || []), checkInRecord]
          };
        }
        return e;
      })
    );

    showToast(`Attendance recorded! Welcome to ${target.title}`, 'success');
    return { success: true, message: 'Attendance recorded successfully', record: checkInRecord };
  }, [currentUser, events, showToast]);

  // Reset all data to factory demo state
  const resetDemoData = useCallback(() => {
    resetToDemoDefaults();
    setEvents(getStoredEvents());
    showToast('Application state reset to pristine demo sample data.', 'info');
  }, [showToast]);

  // Filtered and Sorted Events
  const filteredEvents = useMemo(() => {
    return enrichedEvents.filter(event => {
      // Search query (title, venue, description, organizer)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          event.title.toLowerCase().includes(q) ||
          event.venue.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.organizerName.toLowerCase().includes(q) ||
          event.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'All Categories' && event.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'All Statuses' && event.status !== selectedStatus) {
        return false;
      }

      // City / Location
      if (selectedCity !== 'All Locations' && event.city !== selectedCity) {
        return false;
      }

      // Date Filter
      if (selectedDateFilter !== 'all' && event.date) {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDateFilter === 'today') {
          const isSameDay = eventDate.toDateString() === today.toDateString();
          if (!isSameDay) return false;
        } else if (selectedDateFilter === 'upcoming') {
          if (eventDate < today && event.status !== 'Completed') return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trust') {
        return b.trustScore - a.trustScore;
      }
      if (sortBy === 'confirmations') {
        return (b.confirmations?.length || 0) - (a.confirmations?.length || 0);
      }
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'popular') {
        return (b.checkIns?.length || 0) - (a.checkIns?.length || 0);
      }
      return 0;
    });
  }, [enrichedEvents, searchQuery, selectedCategory, selectedStatus, selectedCity, selectedDateFilter, sortBy]);

  return (
    <EventContext.Provider
      value={{
        events: enrichedEvents,
        filteredEvents,
        favourites,
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
        setSortBy,
        handleToggleFavourite,
        submitEvent,
        confirmEvent,
        reportEvent,
        approveEvent,
        rejectEvent,
        checkInUserToEvent,
        resetDemoData,
        getOrganizerProfile
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
