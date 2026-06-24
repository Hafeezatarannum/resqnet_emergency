import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { cn } from '@/lib/utils';

// Helper to center map if markers change
function MapCenterer({ markers }: { markers: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers, map]);
  return null;
}

export function LeafletMap({
  className,
  markers = [],
  children,
}: {
  className?: string;
  markers?: Array<{ id?: string, lat: number; lng: number; tone: "red" | "blue" | "green"; label: string }>;
  children?: React.ReactNode;
}) {
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai

  return (
    <div className={cn("relative overflow-hidden rounded-[22px] border border-border bg-card", className)}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        className="absolute inset-0 z-0"
        zoomControl={false}
      >
        {/* CartoDB Dark Matter Base Map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {markers.map((marker, idx) => {
          // Create custom divIcon to match our previous CSS glowing dots
          const toneColors = {
            red: "bg-destructive text-destructive border-destructive shadow-destructive",
            blue: "bg-brand-blue text-brand-blue border-brand-blue shadow-brand-blue",
            green: "bg-success text-success border-success shadow-success",
          };

          const html = `
            <div class="relative flex flex-col items-center group transform transition-transform hover:scale-110">
              <div class="bg-background border border-border px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xl mb-1.5 opacity-90 backdrop-blur-sm">
                ${marker.label}
              </div>
              <div class="relative flex h-8 w-8 items-center justify-center">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${toneColors[marker.tone].split(' ')[0]}"></span>
                <span class="relative inline-flex rounded-full h-5 w-5 border-2 border-background ${toneColors[marker.tone].split(' ')[0]} shadow-[0_0_15px_var(--tw-shadow-color)] flex items-center justify-center text-white/90">
                </span>
              </div>
            </div>
          `;

          const icon = L.divIcon({
            html,
            className: 'bg-transparent border-0',
            iconSize: [120, 80],
            iconAnchor: [60, 60], // anchor at bottom middle
          });

          return (
            <Marker key={marker.id || idx} position={[marker.lat, marker.lng]} icon={icon}>
              <Popup className="bg-card text-foreground border-border rounded-xl">
                <p className="font-bold">{marker.label}</p>
                <p className="text-xs text-muted-foreground">{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          );
        })}

        {markers.length > 0 && <MapCenterer markers={markers} />}
        
        {children}
      </MapContainer>
    </div>
  );
}
