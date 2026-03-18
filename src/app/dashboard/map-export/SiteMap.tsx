'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UmspSite } from '@/types/database';
import { isActiveSite } from '@/lib/queries/umsp-sites';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UGANDA_BORDER_URL = '/uganda-border.geojson';

const ugandaBorderStyle = {
  color: '#1e3a5f',
  weight: 1,
  opacity: 0.9,
  fillColor: 'transparent',
  fillOpacity: 0,
};

export default function SiteMap({ sites }: { sites: UmspSite[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ugandaGeoJson, setUgandaGeoJson] = useState<any>(null);

  useEffect(() => {
    fetch(UGANDA_BORDER_URL)
      .then((res) => res.json())
      .then(setUgandaGeoJson)
      .catch(() => {/* border overlay is cosmetic; silently skip on fetch failure */});
  }, []);

  return (
    <div className="relative h-full w-full">
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

        {ugandaGeoJson && (
          <GeoJSON
            key="uganda-border"
            data={ugandaGeoJson}
            style={ugandaBorderStyle}
          />
        )}

        {sites.map((s) => {
          const isActive = isActiveSite(s);
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

      {/* Legend overlay */}
      <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-3 rounded-xl border border-white/60 bg-white/90 px-5 py-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="inline-block h-5 w-5 rounded-full bg-[#0d9488]" />
          <span className="text-base font-medium text-slate-700">Active MRC</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block h-5 w-5 rounded-full bg-[#94a3b8]" />
          <span className="text-base font-medium text-slate-700">Inactive MRC</span>
        </div>
      </div>
    </div>
  );
}
