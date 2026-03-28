'use client';

import { useEffect, useRef } from 'react';

interface MapViewerProps {
  latitude: number;
  longitude: number;
  radius?: number;
  title?: string;
}

export default function MapViewer({ latitude, longitude, radius, title }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

  useEffect(() => {
    console.log('🗺️ MapViewer props:', { latitude: lat, longitude: lng, radius, title });
  }, [lat, lng, radius, title]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current || mapRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const zoom = radius ? Math.max(8, 13 - Math.log2(radius)) : 12;
      const map = L.map(mapContainer.current!).setView([lat, lng], zoom);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25c0-8.284-6.716-15-15-15z" fill="#0038A8"/>
          <circle cx="15" cy="15" r="5" fill="white"/>
        </svg>`,
        className: '',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      if (title) {
        marker.bindPopup(`<div style="padding: 4px 8px; font-weight: 500;">${title}</div>`).openPopup();
      }

      if (radius && radius > 0) {
        console.log('🎯 Adding radius circle:', radius, 'km');
        L.circle([lat, lng], {
          radius: radius * 1000,
          color: '#0038A8',
          fillColor: '#0038A8',
          fillOpacity: 0.3,
          weight: 3,
        }).addTo(map);
        console.log('✅ Circle added successfully');
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, radius, title]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </>
  );
}