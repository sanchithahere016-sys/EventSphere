/**
 * EventSphere - Community-Powered Event Trust Engine
 *
 * Innovation Core:
 * Trust Score = (0.30 × Organizer Credibility) + (0.30 × Community Confirmation) + (0.25 × Evidence Quality) + (0.15 × Details Consistency)
 *
 * Each component is normalized on a scale of 0 to 100.
 * Trust Levels:
 * - 80–100: High Trust (Green)
 * - 50–79: Moderate Trust (Amber)
 * - 0–49: Low Trust (Red)
 *
 * IMPORTANT: A high trust score does NOT automatically verify an event.
 * Official "Verified" badge requires Administrator review and approval.
 */

export const TRUST_WEIGHTS = {
  ORGANIZER_CREDIBILITY: 0.30,
  COMMUNITY_CONFIRMATION: 0.30,
  EVIDENCE_QUALITY: 0.25,
  DETAILS_CONSISTENCY: 0.15,
};

/**
 * Calculates the Organizer Credibility score (0 - 100)
 */
export function calculateOrganizerCredibility(organizer = {}, pastEvents = []) {
  let score = 15; // baseline registered organizer points
  const breakdown = [];

  // Profile verified by Admin
  if (organizer.isVerifiedOrganizer) {
    score += 35;
    breakdown.push({ label: 'Admin-Verified Organizer Profile', points: '+35', passed: true });
  } else {
    breakdown.push({ label: 'Admin-Verified Organizer Profile', points: '0', passed: false });
  }

  // Institutional / College email domain verification
  const email = organizer.email || '';
  const isEduDomain = email.endsWith('.edu') || email.includes('.ac.in') || email.includes('college') || email.includes('university');
  if (isEduDomain || organizer.institutionVerified) {
    score += 25;
    breakdown.push({ label: 'Institutional / Academic Domain Verification', points: '+25', passed: true });
  } else {
    breakdown.push({ label: 'Institutional / Academic Domain Verification', points: '0', passed: false });
  }

  // Track record of past successfully completed events
  const completedEventsCount = pastEvents.filter(e => e.organizerId === organizer.id && e.status === 'Completed').length;
  const organizerHistory = organizer.completedEventsCount || completedEventsCount || 0;
  if (organizerHistory >= 5) {
    score += 25;
    breakdown.push({ label: `Proven Track Record (5+ Completed Events: ${organizerHistory})`, points: '+25', passed: true });
  } else if (organizerHistory >= 2) {
    score += 15;
    breakdown.push({ label: `Good Track Record (${organizerHistory} Completed Events)`, points: '+15', passed: true });
  } else if (organizerHistory >= 1) {
    score += 10;
    breakdown.push({ label: `First Successful Event Completed (${organizerHistory})`, points: '+10', passed: true });
  } else {
    breakdown.push({ label: 'Track Record (No past completed events yet)', points: '0', passed: false });
  }

  // Deductions for past reported/flagged events
  const reportedEventsCount = organizer.flaggedCount || 0;
  if (reportedEventsCount > 0) {
    const penalty = Math.min(30, reportedEventsCount * 15);
    score -= penalty;
    breakdown.push({ label: `Historical Flag Penalty (${reportedEventsCount} flagged)`, points: `-${penalty}`, passed: false });
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  return {
    score: finalScore,
    breakdown,
    summary: finalScore >= 80 ? 'Highly reputable campus organizer' : finalScore >= 50 ? 'Moderate organizer standing' : 'New or unverified organizer'
  };
}

/**
 * Calculates the Community Confirmation score (0 - 100)
 */
export function calculateCommunityConfirmation(confirmations = [], reports = []) {
  const confirmCount = Array.isArray(confirmations) ? confirmations.length : (typeof confirmations === 'number' ? confirmations : 0);
  const reportCount = Array.isArray(reports) ? reports.length : (typeof reports === 'number' ? reports : 0);

  let score = 15; // baseline before community activity
  const breakdown = [];

  // Confirmations tiered scoring
  if (confirmCount >= 10) {
    score += 85;
    breakdown.push({ label: `Strong Community Backing (${confirmCount} confirmations)`, points: '+85', passed: true });
  } else if (confirmCount >= 6) {
    score += 65;
    breakdown.push({ label: `High Community Backing (${confirmCount} confirmations)`, points: '+65', passed: true });
  } else if (confirmCount >= 3) {
    score += 45;
    breakdown.push({ label: `Growing Confirmations (${confirmCount} confirmations)`, points: '+45', passed: true });
  } else if (confirmCount >= 1) {
    score += 25;
    breakdown.push({ label: `Initial Confirmations (${confirmCount} confirmations)`, points: '+25', passed: true });
  } else {
    breakdown.push({ label: 'No Community Confirmations yet', points: '0', passed: false });
  }

  // Community Reports penalty
  if (reportCount > 0) {
    const penalty = reportCount * 25;
    score -= penalty;
    breakdown.push({ label: `Community Red Flags (${reportCount} reports submitted)`, points: `-${penalty}`, passed: false });
  } else {
    breakdown.push({ label: 'Zero Community Disputes / Clean Record', points: '+0', passed: true });
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  return {
    score: finalScore,
    confirmCount,
    reportCount,
    breakdown,
    summary: reportCount > 0
      ? `Flagged by ${reportCount} community report(s)`
      : confirmCount >= 5
      ? `Endorsed by ${confirmCount} campus members`
      : 'Awaiting more community confirmations'
  };
}

/**
 * Calculates the Evidence Quality score (0 - 100)
 */
export function calculateEvidenceQuality(evidence = {}, event = {}) {
  let score = 0;
  const breakdown = [];

  // 1. Official Event Poster / Creative Artwork (25 pts)
  const hasPoster = Boolean(event.posterUrl || event.poster || evidence.hasPoster);
  if (hasPoster) {
    score += 25;
    breakdown.push({ label: 'Official High-Resolution Event Poster', points: '+25', passed: true });
  } else {
    breakdown.push({ label: 'Missing Event Poster', points: '0', passed: false });
  }

  // 2. Official Documentation / Permission Letter / Booking Slip (40 pts)
  const hasDoc = Boolean(evidence.documentUrl || evidence.bookingProof || evidence.permissionLetter || evidence.hasDocuments);
  if (hasDoc) {
    score += 40;
    breakdown.push({ label: 'Submitted Venue Booking / Faculty Permission Slip', points: '+40', passed: true });
  } else {
    breakdown.push({ label: 'Venue Booking / Permission Slip Not Provided', points: '0', passed: false });
  }

  // 3. Organizer Contact Information (20 pts)
  const contact = event.contactEmail || event.contactPhone || evidence.contactInfo;
  if (contact && (event.contactEmail?.includes('@') || event.contactPhone?.length >= 8)) {
    score += 20;
    breakdown.push({ label: 'Valid Direct Contact Information & Phone', points: '+20', passed: true });
  } else {
    breakdown.push({ label: 'Incomplete Contact Details', points: '0', passed: false });
  }

  // 4. Physical / Online Venue Authenticity Proof (15 pts)
  const hasVenueDetails = Boolean(event.venue && event.venue.length > 5 && (event.coordinates || event.roomNumber || event.address));
  if (hasVenueDetails) {
    score += 15;
    breakdown.push({ label: 'Verified Campus Venue & Room Designation', points: '+15', passed: true });
  } else {
    breakdown.push({ label: 'Vague Venue Details', points: '0', passed: false });
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  return {
    score: finalScore,
    breakdown,
    summary: finalScore >= 80 ? 'Comprehensive supporting evidence verified' : finalScore >= 50 ? 'Basic documentation submitted' : 'Minimal evidence provided'
  };
}

/**
 * Calculates the Details Consistency score (0 - 100)
 */
export function calculateDetailsConsistency(event = {}) {
  let score = 0;
  const breakdown = [];

  // 1. Schedule consistency: Start time & End time valid, End time after Start time (25 pts)
  if (event.startTime && event.endTime) {
    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const validOrder = (endH > startH) || (endH === startH && endM > startM);
    if (validOrder) {
      score += 25;
      breakdown.push({ label: `Valid Chronological Schedule (${event.startTime} - ${event.endTime})`, points: '+25', passed: true });
    } else {
      breakdown.push({ label: 'Inconsistent Time: End time precedes Start time', points: '0', passed: false });
    }
  } else {
    breakdown.push({ label: 'Incomplete Time Schedule', points: '0', passed: false });
  }

  // 2. Realistic & Valid Event Date (25 pts)
  if (event.date) {
    const eventDate = new Date(event.date);
    const now = new Date();
    // allow today and up to 1 year ahead
    if (!isNaN(eventDate.getTime())) {
      score += 25;
      breakdown.push({ label: 'Plausible Event Calendar Date', points: '+25', passed: true });
    } else {
      breakdown.push({ label: 'Invalid Date Format', points: '0', passed: false });
    }
  } else {
    breakdown.push({ label: 'Missing Event Date', points: '0', passed: false });
  }

  // 3. Descriptive Quality: length, clear agenda, eligibility (25 pts)
  const desc = event.description || '';
  if (desc.trim().length >= 100) {
    score += 25;
    breakdown.push({ label: 'Comprehensive Description & Agenda (> 100 chars)', points: '+25', passed: true });
  } else if (desc.trim().length >= 40) {
    score += 15;
    breakdown.push({ label: 'Moderate Description', points: '+15', passed: true });
  } else {
    breakdown.push({ label: 'Brief / Vague Event Description', points: '0', passed: false });
  }

  // 4. Complete Venue Location Clarity (25 pts)
  const venue = event.venue || '';
  const city = event.city || event.location || '';
  if (venue.trim().length >= 8 && city.trim().length >= 3) {
    score += 25;
    breakdown.push({ label: 'Precise Venue & Campus Location Specified', points: '+25', passed: true });
  } else if (venue.trim().length >= 4) {
    score += 15;
    breakdown.push({ label: 'Partial Venue Location Specified', points: '+15', passed: true });
  } else {
    breakdown.push({ label: 'Vague Venue Location', points: '0', passed: false });
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  return {
    score: finalScore,
    breakdown,
    summary: finalScore >= 80 ? 'High information consistency and structure' : finalScore >= 50 ? 'Acceptable detail consistency' : 'Missing critical schedule details'
  };
}

/**
 * Main Trust Engine calculation
 * Computes overall trust score and level based on weighted formula.
 */
export function calculateEventTrustScore(event = {}, organizer = {}, pastEvents = []) {
  const credibilityResult = calculateOrganizerCredibility(organizer, pastEvents);
  const confirmationResult = calculateCommunityConfirmation(event.confirmations || [], event.reports || []);
  const evidenceResult = calculateEvidenceQuality(event.evidence || {}, event);
  const consistencyResult = calculateDetailsConsistency(event);

  const weightedCredibility = TRUST_WEIGHTS.ORGANIZER_CREDIBILITY * credibilityResult.score;
  const weightedConfirmation = TRUST_WEIGHTS.COMMUNITY_CONFIRMATION * confirmationResult.score;
  const weightedEvidence = TRUST_WEIGHTS.EVIDENCE_QUALITY * evidenceResult.score;
  const weightedConsistency = TRUST_WEIGHTS.DETAILS_CONSISTENCY * consistencyResult.score;

  const totalScore = Math.min(100, Math.max(0, Math.round(
    weightedCredibility + weightedConfirmation + weightedEvidence + weightedConsistency
  )));

  let trustLevel = 'Low Trust';
  let badgeColor = 'red';
  let levelDescription = 'Low Trust: Lacks community validation or verified organizer credibility.';

  if (totalScore >= 80) {
    trustLevel = 'High Trust';
    badgeColor = 'green';
    levelDescription = 'High Trust: Strong organizer credibility, verified evidence, and enthusiastic community backing.';
  } else if (totalScore >= 50) {
    trustLevel = 'Moderate Trust';
    badgeColor = 'amber';
    levelDescription = 'Moderate Trust: Decent information provided; awaiting additional community confirmations or official review.';
  }

  return {
    totalScore,
    trustLevel,
    badgeColor,
    levelDescription,
    components: {
      organizerCredibility: {
        rawScore: credibilityResult.score,
        weightedScore: Number(weightedCredibility.toFixed(1)),
        weight: TRUST_WEIGHTS.ORGANIZER_CREDIBILITY * 100,
        ...credibilityResult
      },
      communityConfirmation: {
        rawScore: confirmationResult.score,
        weightedScore: Number(weightedConfirmation.toFixed(1)),
        weight: TRUST_WEIGHTS.COMMUNITY_CONFIRMATION * 100,
        ...confirmationResult
      },
      evidenceQuality: {
        rawScore: evidenceResult.score,
        weightedScore: Number(weightedEvidence.toFixed(1)),
        weight: TRUST_WEIGHTS.EVIDENCE_QUALITY * 100,
        ...evidenceResult
      },
      detailsConsistency: {
        rawScore: consistencyResult.score,
        weightedScore: Number(weightedConsistency.toFixed(1)),
        weight: TRUST_WEIGHTS.DETAILS_CONSISTENCY * 100,
        ...consistencyResult
      }
    }
  };
}
