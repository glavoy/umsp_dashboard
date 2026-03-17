'use client';

import dynamic from 'next/dynamic';
import { useSupabaseQuery } from '@/lib/hooks/use-supabase-query';
import { fetchUmspSites } from '@/lib/queries/umsp-sites';

const SiteMap = dynamic(() => import('./SiteMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
  ),
});

export default function MapExportPage() {
  const { data: sites, loading } = useSupabaseQuery(() => fetchUmspSites());

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-3">
      <div className="flex-1 overflow-hidden rounded-xl border border-border/70">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading sites…</div>
        ) : (
          <SiteMap sites={sites ?? []} />
        )}
      </div>
    </div>
  );
}
