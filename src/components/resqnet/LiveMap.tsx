import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create custom icons using HTML so they look like our modern design
const victimIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="height: 40px; width: 40px; background-color: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 2px solid white; font-weight: bold; font-size: 12px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">SOS</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const volunteerIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="height: 32px; width: 32px; background-color: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 2px solid white; font-weight: bold; font-size: 12px; transition: transform 0.2s;">V</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to dynamically recenter map when coordinates change
function MapController({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 1
    });
  }, [center, map]);
  return null;
}

export function LiveMap({ 
  victimLocation, 
  volunteerLocation 
}: { 
  victimLocation: { lat: number, lng: number }, 
  volunteerLocation: { lat: number, lng: number } | null
}) {
  // Center map on volunteer if available, else victim
  const center = volunteerLocation || victimLocation;

  return (
    <div className="w-full relative bg-secondary" style={{ height: "300px" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        zoomControl={false}
        style={{ height: "300px", width: "100%" }}
      >
        {/* We use CartoDB Voyager tiles because they look modern and premium */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={center} />

        {/* Victim Marker */}
        <Marker position={[victimLocation.lat, victimLocation.lng]} icon={victimIcon} />

        {/* Volunteer Marker */}
        {volunteerLocation && (
          <Marker position={[volunteerLocation.lat, volunteerLocation.lng]} icon={volunteerIcon} />
        )}
      </MapContainer>
    </div>
  );
}
