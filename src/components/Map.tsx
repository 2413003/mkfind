import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { MissingItem } from '../lib/supabase';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  items: MissingItem[];
  center: [number, number];
  onMarkerClick?: (item: MissingItem) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const Map: React.FC<MapProps> = ({ items, center, onMarkerClick }) => {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-premium">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={center} />
        {items.map((item) => (
          <Marker
            key={item.id}
            position={[item.last_seen_location.lat, item.last_seen_location.lng]}
            eventHandlers={{
              click: () => onMarkerClick?.(item),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-xs text-brand-gray truncate">{item.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
