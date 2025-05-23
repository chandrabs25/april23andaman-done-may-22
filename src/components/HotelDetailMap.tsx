"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface HotelDetailMapProps {
  latitude: number | string;
  longitude: number | string;
  name: string;
  themeNeutralBorderLight?: string; // Optional: if you want to pass theme styles
}

const HotelDetailMap: React.FC<HotelDetailMapProps> = ({ latitude, longitude, name, themeNeutralBorderLight = 'border-gray-200' }) => {
  const lat = parseFloat(String(latitude));
  const lon = parseFloat(String(longitude));

  if (isNaN(lat) || isNaN(lon)) {
    return (
      <div className={`h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 border ${themeNeutralBorderLight}`}>
        Map data not available or invalid for this hotel.
      </div>
    );
  }

  return (
    <div className={`h-80 md:h-96 w-full rounded-md overflow-hidden border ${themeNeutralBorderLight}`}>
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0" // ensure map is below sticky nav if overlapping
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            {name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HotelDetailMap; 