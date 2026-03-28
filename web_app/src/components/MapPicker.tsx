'use client';

import { useEffect, useRef, useState } from 'react';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, radius, onLocationChange }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [markerPosition, setMarkerPosition] = useState({
    latitude: latitude || 14.5995,
    longitude: longitude || 120.9842
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current || mapRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const initialLat = latitude || 14.5995;
      const initialLng = longitude || 120.9842;

      const map = L.map(mapContainer.current!).setView([initialLat, initialLng], 11);
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
      });

      const marker = L.marker([initialLat, initialLng], { icon: customIcon, draggable: true }).addTo(map);
      markerRef.current = marker;

      const circle = L.circle([initialLat, initialLng], {
        radius: radius * 1000,
        color: '#0038A8',
        fillColor: '#0038A8',
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);
      circleRef.current = circle;

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        setMarkerPosition({ latitude: lat, longitude: lng });
        onLocationChange(lat, lng);
      });

      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        circle.setLatLng([lat, lng]);
        setMarkerPosition({ latitude: lat, longitude: lng });
        onLocationChange(lat, lng);
      });

      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current || !latitude || !longitude || !mapLoaded) return;
    if (Math.abs(latitude - markerPosition.latitude) < 0.0001 &&
        Math.abs(longitude - markerPosition.longitude) < 0.0001) return;
    markerRef.current.setLatLng([latitude, longitude]);
    circleRef.current.setLatLng([latitude, longitude]);
    mapRef.current.flyTo([latitude, longitude], 14);
    setMarkerPosition({ latitude, longitude });
  }, [latitude, longitude, mapLoaded]);

  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.setRadius(radius * 1000);
  }, [radius]);

  return (
    <div className="relative">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div
        ref={mapContainer}
        className="rounded-lg overflow-hidden border border-gray-300"
        style={{ height: '400px' }}
      />
      <div className="mt-2 text-sm text-gray-600">
        Click on the map to select alert location
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Selected: {markerPosition.latitude.toFixed(6)}, {markerPosition.longitude.toFixed(6)} • Radius: {radius} km
      </div>
    </div>
  );
}