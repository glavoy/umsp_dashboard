'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UmspSite } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function SiteMap({ sites }: { sites: UmspSite[] }) {
  return (
    <MapContainer
      center={[1.5, 32.5]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {sites.map((s) => {
        const isActive = s.status === 'Active';
        return (
          <CircleMarker
            key={s.site_id}
            center={[s.latitude, s.longitude]}
            radius={7}
            pathOptions={{
              fillColor: isActive ? '#0d9488' : '#94a3b8',
              color: isActive ? '#0f766e' : '#64748b',
              weight: 1.5,
              fillOpacity: isActive ? 0.85 : 0.5,
            }}
          >
            <Tooltip sticky>
              <div className="text-sm">
                <p className="font-semibold">{s.site}</p>
                <p className="text-muted-foreground">{s.district}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
