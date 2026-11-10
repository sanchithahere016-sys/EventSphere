import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import TrustScoreBadge from './TrustScoreBadge';

export default function EventMap({ events = [], selectedEvent = null, onSelectEvent = null, className = "h-96" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Bengaluru / College campus default coordinates
    const defaultCenter = [12.9716, 77.5946];
    const defaultZoom = 13;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false
      }).setView(defaultCenter, defaultZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom marker icon HTML
    const createCustomIcon = (status, score) => {
      let pinColor = '#ef4444';
      if (status === 'Verified') pinColor = '#10b981';
      else if (score >= 80) pinColor = '#2563eb';
      else if (score >= 50) pinColor = '#f59e0b';

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });
    };

    const bounds = [];

    // Add markers for all events that have coordinates
    events.forEach(event => {
      if (event.coordinates && Array.isArray(event.coordinates) && event.coordinates.length === 2) {
        const [lat, lng] = event.coordinates;
        bounds.push([lat, lng]);

        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(event.status, event.trustScore || 0)
        }).addTo(map);

        // Bind popup
        const popupContent = document.createElement('div');
        popupContent.className = 'text-slate-900 p-1 max-w-[200px]';
        popupContent.innerHTML = `
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${event.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${event.venue}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
            <span style="font-weight: 600; color: #2563eb;">${event.category}</span>
            <span style="font-weight: 700; color: ${event.trustScore >= 80 ? '#10b981' : event.trustScore >= 50 ? '#f59e0b' : '#ef4444'};">Trust: ${event.trustScore}%</span>
          </div>
        `;

        if (onSelectEvent) {
          const btn = document.createElement('button');
          btn.innerText = 'View Event Details →';
          btn.style.cssText = 'margin-top: 8px; width: 100%; padding: 4px 8px; background: #2563eb; color: white; border-radius: 6px; font-size: 11px; font-weight: 600; border: none; cursor: pointer;';
          btn.onclick = () => onSelectEvent(event.id);
          popupContent.appendChild(btn);
        }

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      }
    });

    // If an individual event is selected, pan and zoom to it
    if (selectedEvent && selectedEvent.coordinates) {
      map.flyTo(selectedEvent.coordinates, 15, { duration: 1.2 });
    } else if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [events, selectedEvent, onSelectEvent]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-soft bg-slate-100 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-[11px] font-semibold text-slate-700 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span>OpenStreetMap Verified Locations</span>
      </div>
    </div>
  );
}
