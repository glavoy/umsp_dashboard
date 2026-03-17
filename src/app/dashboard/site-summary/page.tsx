'use client';

import { useSupabaseQuery } from '@/lib/hooks/use-supabase-query';
import { fetchSiteDateRanges } from '@/lib/queries/monthly-data';
import { fetchMappedActiveUmspSiteNames } from '@/lib/queries/active-sites';
import { matchActiveSite } from '@/lib/utils/indicators';
import { formatDate } from '@/lib/utils/format';

export default function SiteSummaryPage() {
  const { data: sites, loading: sitesLoading } = useSupabaseQuery(() => fetchSiteDateRanges());
  const { data: activeSiteNames, loading: activeLoading } = useSupabaseQuery(() => fetchMappedActiveUmspSiteNames());

  const loading = sitesLoading || activeLoading;
  const active = (sites ?? []).filter((s) => matchActiveSite(s.site, activeSiteNames ?? []));
  const inactive = (sites ?? []).filter((s) => !matchActiveSite(s.site, activeSiteNames ?? []));

  return (
    <div className="space-y-6">
      {/* Summary counts */}
      {!loading && sites && (
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">{active.length}</strong> active</span>
          <span><strong className="text-foreground">{inactive.length}</strong> inactive</span>
          <span><strong className="text-foreground">{(sites ?? []).length}</strong> total</span>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading sites...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Data From</th>
                <th className="px-4 py-3">Data To</th>
              </tr>
            </thead>
            <tbody>
              {(sites ?? []).map((s) => {
                const isActive = matchActiveSite(s.site, activeSiteNames ?? []);
                return (
                  <tr key={s.site} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-medium">{s.site}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.district}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.region}</td>
                    <td className="px-4 py-2.5">
                      {isActive ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-500/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{formatDate(s.firstDate)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {isActive ? '—' : formatDate(s.lastDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
