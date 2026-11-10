/**
 * Calendar Service: generates .ics download and Google Calendar links
 */

export function generateGoogleCalendarUrl(event) {
  if (!event || !event.date) return '#';

  const cleanDate = event.date.replace(/-/g, '');
  const startTime = (event.startTime || '09:00').replace(/:/g, '') + '00';
  const endTime = (event.endTime || '17:00').replace(/:/g, '') + '00';

  const startIso = `${cleanDate}T${startTime}`;
  const endIso = `${cleanDate}T${endTime}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'EventSphere Event',
    dates: `${startIso}/${endIso}`,
    details: `${event.description || ''}\n\nOrganized by: ${event.organizerName || 'Community Member'}\nVerified on EventSphere`,
    location: `${event.venue || ''}, ${event.location || ''}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event) {
  if (!event || !event.date) return;

  const cleanDate = event.date.replace(/-/g, '');
  const startTime = (event.startTime || '09:00').replace(/:/g, '') + '00';
  const endTime = (event.endTime || '17:00').replace(/:/g, '') + '00';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventSphere//Community Event Platform//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@eventsphere.edu`,
    `DTSTAMP:${cleanDate}T000000Z`,
    `DTSTART:${cleanDate}T${startTime}`,
    `DTEND:${cleanDate}T${endTime}`,
    `SUMMARY:${(event.title || 'EventSphere Event').replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    `LOCATION:${(event.venue || '').replace(/,/g, '\\,')}, ${(event.location || '').replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(event.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
