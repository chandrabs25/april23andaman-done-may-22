"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Fix for default icon issue with Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

interface MapPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition?: { lat: number; lng: number };
  mapHeight?: string;
  mapZoom?: number;
}

const DEFAULT_CENTER: LatLngExpression = [11.6234, 92.7265]; // Default to Port Blair
const DEFAULT_ZOOM = 10;

const LocationMarker: React.FC<{
  position: LatLngExpression;
  setPosition: (position: LatLngExpression) => void;
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onLocationChange }) => {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationChange(newPos.lat, newPos.lng);
    },
  });

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return (
    <Marker
      position={position}
      draggable={true}
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            onLocationChange(newPos.lat, newPos.lng);
          }
        },
      }}
    >
      <Popup>Drag to select location or click on the map.</Popup>
    </Marker>
  );
};

const MapPicker: React.FC<MapPickerProps> = ({
  onLocationChange,
  initialPosition,
  mapHeight = '400px',
  mapZoom = DEFAULT_ZOOM,
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : DEFAULT_CENTER
  );
  const mapRef = useRef<L.Map | null>(null);

  // Update marker if initialPosition changes after mount
  useEffect(() => {
    if (initialPosition) {
      setMarkerPosition([initialPosition.lat, initialPosition.lng]);
    }
  }, [initialPosition]);
  
  // Call onLocationChange when markerPosition is first set from initialPosition
  useEffect(() => {
    if (initialPosition) {
        onLocationChange(initialPosition.lat, initialPosition.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount if initialPosition exists

  const handleSetPosition = (newPosition: LatLngExpression) => {
    setMarkerPosition(newPosition);
  };

  // Component to add search control to map
  const SearchField = () => {
    const map = mapRef.current;

    useEffect(() => {
      if (!map) return;

      const provider = new OpenStreetMapProvider();
      const searchControl = GeoSearchControl({
        provider: provider,
        style: 'bar',
        showMarker: false, // We use our own marker
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true, // Keep the search result highlighted
        searchLabel: 'Enter address or place name'
      });

      map.addControl(searchControl);

      const onResult = (data: any) => {
        const { location } = data;
        if (location) {
          const newPos: LatLngExpression = [location.y, location.x];
          setMarkerPosition(newPos); // Update local marker state
          onLocationChange(location.y, location.x); // Propagate change
          map.setView(newPos, 13); // Center map on new location, zoom to 13
        }
      };

      map.on('geosearch/showlocation', onResult);

      return () => {
        map.removeControl(searchControl);
        map.off('geosearch/showlocation', onResult);
      };
    }, [map, onLocationChange]);

    return null; // This component doesn't render anything itself
  };
  
  // Ensure map is only rendered on the client side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{ height: mapHeight, background: '#e0e0e0' }} className="flex items-center justify-center text-gray-500">Loading map...</div>;
  }

  return (
    <MapContainer
      center={markerPosition}
      zoom={mapZoom}
      scrollWheelZoom={false}
      style={{ height: mapHeight, width: '100%', borderRadius: '8px' }}
      whenReady={() => {
        // The map instance is typically accessed via a ref if needed later
        // For example, by passing a ref to MapContainer: ref={mapRef}
        // Then mapRef.current would be the map instance.
      }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        position={markerPosition}
        setPosition={handleSetPosition}
        onLocationChange={onLocationChange}
      />
      <SearchField />
    </MapContainer>
  );
};

export default MapPicker; 