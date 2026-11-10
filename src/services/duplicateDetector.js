/**
 * Smart Duplicate Event Detector
 *
 * Compares:
 * - Event title similarity (Levenshtein + Jaccard token overlap)
 * - Event date (exact or same day)
 * - Venue / Location proximity & text similarity
 * - Organizer identity
 */

function cleanText(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function getTokens(text = '') {
  return new Set(cleanText(text).split(/\s+/).filter(Boolean));
}

// Jaccard similarity between two token sets
function tokenSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Levenshtein distance normalized to 0 - 1
function levenshteinSimilarity(s1 = '', s2 = '') {
  const str1 = cleanText(s1);
  const str2 = cleanText(s2);
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }

  return (longer.length - costs[shorter.length]) / longer.length;
}

export function detectDuplicates(candidateEvent = {}, existingEvents = [], excludeId = null) {
  const matches = [];

  const candidateTokens = getTokens(candidateEvent.title);
  const candidateDate = candidateEvent.date ? candidateEvent.date.split('T')[0] : '';
  const candidateVenueTokens = getTokens(candidateEvent.venue);

  for (const event of existingEvents) {
    if (excludeId && event.id === excludeId) continue;
    if (event.status === 'Rejected') continue; // don't flag against rejected events

    const eventTokens = getTokens(event.title);
    const titleTokenSim = tokenSimilarity(candidateTokens, eventTokens);
    const titleLevSim = levenshteinSimilarity(candidateEvent.title || '', event.title || '');
    const titleScore = Math.max(titleTokenSim, titleLevSim);

    const eventDate = event.date ? event.date.split('T')[0] : '';
    const sameDate = candidateDate && eventDate && candidateDate === eventDate;

    const venueTokens = getTokens(event.venue);
    const venueSim = tokenSimilarity(candidateVenueTokens, venueTokens);

    const sameOrganizer = (candidateEvent.organizerId && candidateEvent.organizerId === event.organizerId) ||
      (cleanText(candidateEvent.organizerName) === cleanText(event.organizerName) && cleanText(candidateEvent.organizerName).length > 2);

    // Calculate composite duplicate probability
    let duplicateProbability = 0;
    const reasons = [];

    // Strong Title match
    if (titleScore >= 0.75) {
      duplicateProbability += 0.50;
      reasons.push(`Title is ${(titleScore * 100).toFixed(0)}% identical`);
    } else if (titleScore >= 0.5) {
      duplicateProbability += 0.30;
      reasons.push(`Title shares significant keywords (${(titleScore * 100).toFixed(0)}% match)`);
    }

    // Same date match
    if (sameDate) {
      duplicateProbability += 0.25;
      reasons.push('Scheduled on the exact same date');
    }

    // Venue similarity
    if (venueSim >= 0.6) {
      duplicateProbability += 0.15;
      reasons.push('Hosted at an overlapping or identical venue');
    }

    // Organizer match
    if (sameOrganizer) {
      duplicateProbability += 0.10;
      reasons.push('Submitted under the same organizer identity');
    }

    if (duplicateProbability >= 0.55 || (titleScore >= 0.8 && sameDate)) {
      matches.push({
        existingEvent: event,
        confidence: Math.min(100, Math.round(duplicateProbability * 100)),
        reasons,
        titleScore: Math.round(titleScore * 100),
        sameDate,
        venueSim: Math.round(venueSim * 100)
      });
    }
  }

  // Sort matches by highest confidence
  matches.sort((a, b) => b.confidence - a.confidence);

  return {
    hasPossibleDuplicate: matches.length > 0,
    matches,
    topMatch: matches[0] || null,
    warningMessage: matches.length > 0
      ? 'A similar event may already exist. Please review the existing listing before submitting.'
      : null
  };
}
