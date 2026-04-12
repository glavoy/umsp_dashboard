'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteDateRange } from '@/lib/queries/monthly-data';
import { matchActiveSite } from '@/lib/utils/indicators';
import { formatDate } from '@/lib/utils/format';

interface Props {
  sites: SiteDateRange[];
  activeSiteNames: string[];
  loading: boolean;
}

export function SiteSummaryCard({ sites, activeSiteNames, loading }: Props) {
  const [open, setOpen] = useState(false);

  const activeSiteCount = sites.filter((s) => matchActiveSite(s.site, activeSiteNames)).length;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Site Summary</CardTitle>
            {!loading && sites.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {activeSiteCount} active · {sites.length - activeSiteCount} prior · {sites.length} total
              </span>
            )}
          </div>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Loading sites...</p>
          ) : sites.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No site data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-6">Site</th>
                    <th className="pb-2 pr-6">District</th>
                    <th className="pb-2 pr-6">Region</th>
                    <th className="pb-2 pr-6">Status</th>
                    <th className="pb-2 pr-6">Data From</th>
                    <th className="pb-2">Data To</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((s) => {
                    const isActive = matchActiveSite(s.site, activeSiteNames);
                    return (
                      <tr key={s.site} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-6 font-medium">{s.site}</td>
                        <td className="py-2 pr-6 text-muted-foreground">{s.district}</td>
                        <td className="py-2 pr-6 text-muted-foreground">{s.region}</td>
                        <td className="py-2 pr-6">
                          {isActive ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-500/20">
                              Prior
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-6 text-muted-foreground">{formatDate(s.firstDate)}</td>
                        <td className="py-2 text-muted-foreground">
                          {isActive ? '—' : formatDate(s.lastDate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
