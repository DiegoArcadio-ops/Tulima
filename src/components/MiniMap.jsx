import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix del ícono por defecto de Leaflet (necesario con bundlers como Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MiniMap({
  lat,
  lng,
  editable = false,
  onChange,
  height = 200,
  zoom = 15,
}) {
  const tieneCoordenadas = lat != null && lng != null;
  const centro = tieneCoordenadas ? [lat, lng] : [19.2433, -103.7247]; // centro de Colima por defecto

  return (
    <div>
      <div style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
        <MapContainer
          center={centro}
          zoom={tieneCoordenadas ? zoom : 11}
          style={{ height: '100%', width: '100%' }}
          dragging={editable}
          scrollWheelZoom={editable}
          doubleClickZoom={editable}
          zoomControl={editable}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tieneCoordenadas && <Marker position={centro} />}
          {editable && <ClickHandler onPick={(la, ln) => onChange(la, ln)} />}
        </MapContainer>
      </div>
      {editable && (
        <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          Toca el mapa para marcar la ubicación exacta de tu negocio.
        </p>
      )}
    </div>
  );
}