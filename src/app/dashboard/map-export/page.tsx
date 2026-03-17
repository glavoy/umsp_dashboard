'use client';

import dynamic from 'next/dynamic';
import { useSupabaseQuery } from '@/lib/hooks/use-supabase-query';
import { fetchMappedActiveUmspSiteNames } from '@/lib/queries/active-sites';
import { createClient } from '@/lib/supabase/client';
import { HealthFacilityCoordinates } from '@/types/database';
import { matchActiveSite } from '@/lib/utils/indicators';

const SiteMap = dynamic(() => import('./SiteMap'), { ssr: false, loading: () => (
  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Loading map…</div>
)});

async function fetchCoordinates(): Promise<HealthFacilityCoordinates[]> {
  const { data, error } = await createClient()
    .from('health_facility_coordinates')
    .select('*')
    .order('site');
  if (error) throw error;
  return data ?? [];
}

export default function MapExportPage() {
  const { data: coords, loading: coordsLoading } = useSupabaseQuery(() => fetchCoordinates());
  const { data: activeSiteNames, loading: activeLoading } = useSupabaseQuery(() => fetchMappedActiveUmspSiteNames());

  const loading = coordsLoading || activeLoading;

  const sites = (coords ?? []).map((c) => ({
    ...c,
    isActive: matchActiveSite(c.site, activeSiteNames ?? []),
  }));

  const activeCount = sites.filter((s) => s.isActive).length;
  const inactiveCount = sites.length - activeCount;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">UMSP Surveillance Sites</h2>
          <p className="text-xs text-muted-foreground">
            {loading ? 'Loading…' : `${activeCount} active · ${inactiveCount} inactive · ${sites.length} total`}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#0d9488]" /> Active MRC
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#94a3b8]" /> Inactive MRC
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-border/70">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading sites…</div>
        ) : (
          <SiteMap sites={sites} />
        )}
      </div>
    </div>
  );
}
