'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Site {
  site: string;
  district: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export default function SiteMap({ sites }: { sites: Site[] }) {
  return (
    <MapContainer
      center={[1.5, 32.5]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {sites.map((s) => (
        <CircleMarker
          key={s.site}
          center={[s.latitude, s.longitude]}
          radius={7}
          pathOptions={{
            fillColor: s.isActive ? '#0d9488' : '#94a3b8',
            color: s.isActive ? '#0f766e' : '#64748b',
            weight: 1.5,
            fillOpacity: s.isActive ? 0.85 : 0.5,
          }}
        >
          <Tooltip sticky>
            <div className="text-sm">
              <p className="font-semibold">{s.site}</p>
              <p className="text-muted-foreground">{s.district}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
