'use client';

import { useMemo } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  GenomicFilters,
  SingleLocusRow,
  MultiLocusRow,
  GenomicSite,
  CATEGORY_COLOR,
  HAPLOTYPE_CATEGORIES,
  SINGLE_SNP_COLORS,
  MUTANT_CODON_COLORS,
  RDYLBU_5,
} from '@/types/genomic';
import {
  PieSlice,
  buildAllSnpsPie,
  buildMultiLocusPie,
  buildSingleSnpPie,
  buildWildTypeMap,
  renderPieSvg,
} from '@/lib/utils/genomic';
import { GenomicLegend } from './GenomicLegend';

// Fix default icon paths (same pattern as MapContainer.tsx)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function pieIcon(slices: PieSlice[], size = 38): L.DivIcon {
  const svg = renderPieSvg(slices, size);
  return L.divIcon({
    className: 'genomic-pie-icon',
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface Props {
  filters: GenomicFilters;
  siteMeta: Map<string, GenomicSite>;
  slRows: SingleLocusRow[];
  mlRows: MultiLocusRow[];
}

export function GenomicMapView({ filters, siteMeta, slRows, mlRows }: Props) {
  const rowsForMostRecent = useMemo(() => {
    // "Map always shows the most recent available year of data". We resolve the
    // year per site: the latest year where that site has any row of relevance.
    const relevant = filters.locusMode === 'SingleLocus' ? slRows : mlRows;
    const yearBySite = new Map<string, number>();
    for (const r of relevant) {
      const prev = yearBySite.get(r.site) ?? -Infinity;
      if (r.year > prev) yearBySite.set(r.site, r.year);
    }
    return { yearBySite, relevant };
  }, [filters.locusMode, slRows, mlRows]);

  const inferredWt = useMemo(() => buildWildTypeMap(slRows), [slRows]);

  const markers = useMemo(() => {
    type Entry = { site: string; year: number; lat: number; lng: number; slices: PieSlice[] };
    const out: Entry[] = [];
    const { yearBySite } = rowsForMostRecent;

    for (const [site, year] of yearBySite) {
      const meta = siteMeta.get(site);
      if (!meta?.latitude || !meta?.longitude) continue;

      let slices: PieSlice[] = [];
      if (filters.locusMode === 'SingleLocus') {
        const atSite = slRows.filter((r) => r.site === site && r.year === year);
        if (filters.codon === 'ALL') {
          slices = buildAllSnpsPie(atSite, filters.geneId, filters.metric, inferredWt);
        } else {
          slices = buildSingleSnpPie(
            atSite, filters.geneId, filters.codon, filters.metric, inferredWt
          );
        }
      } else {
        const atSite = mlRows.filter((r) => r.site === site && r.year === year);
        slices = buildMultiLocusPie(atSite, filters.metric);
      }

      if (slices.length === 0) continue;
      out.push({
        site,
        year,
        lat: meta.latitude,
        lng: meta.longitude,
        slices,
      });
    }
    return out;
  }, [filters, rowsForMostRecent, siteMeta, slRows, mlRows, inferredWt]);

  // Build a legend that reflects the current view.
  const legendSlices: PieSlice[] = useMemo(() => {
    if (filters.locusMode === 'Multilocus') {
      return HAPLOTYPE_CATEGORIES.map((c) => ({
        label: c, value: 1, color: CATEGORY_COLOR[c],
      }));
    }
    if (filters.codon === 'ALL') {
      // Wild-type + observed mutant codons across all markers (take a set from markers)
      const codons = new Set<string>();
      for (const m of markers) {
        for (const s of m.slices) if (s.label !== 'Wild-type') codons.add(s.label);
      }
      const sorted = Array.from(codons).sort((a, b) => Number(a) - Number(b));
      return [
        { label: 'Wild-type', value: 1, color: RDYLBU_5.darkBlue },
        ...sorted.map((label, i) => ({
          label,
          value: 1,
          color: MUTANT_CODON_COLORS[i % MUTANT_CODON_COLORS.length],
        })),
      ];
    }
    return [
      { label: 'Wild-type', value: 1, color: SINGLE_SNP_COLORS.wildtype },
      { label: 'Mutant',    value: 1, color: SINGLE_SNP_COLORS.mutant },
    ];
  }, [filters.locusMode, filters.codon, markers]);

  const metricLabel = filters.metric === 'prev' ? 'Prevalence' : 'Frequency';
  const title =
    filters.locusMode === 'Multilocus'
      ? `dhfr/dhps categories — ${metricLabel}`
      : filters.codon === 'ALL'
      ? `All SNPs — ${metricLabel}`
      : `Codon ${filters.codon} — ${metricLabel}`;

  if (markers.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border/60 text-muted-foreground">
        No genomic data available for the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <GenomicLegend slices={legendSlices} title={title} />
      <div className="h-[600px] w-full overflow-hidden rounded-lg border">
        <LeafletMap
          center={[1.3733, 32.2903]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.site} position={[m.lat, m.lng]} icon={pieIcon(m.slices)}>
              <Tooltip direction="top" offset={[0, -20]}>
                <div className="text-xs">
                  <div className="font-semibold">{m.site}</div>
                  <div className="mb-1 text-muted-foreground">{m.year}</div>
                  {m.slices.map((s) => {
                    const total = m.slices.reduce((sum, x) => sum + x.value, 0);
                    const pct = total > 0 ? (s.value / total) * 100 : 0;
                    return (
                      <div key={s.label} className="flex items-center gap-1">
                        <span
                          className="inline-block h-2 w-2 rounded-sm"
                          style={{ background: s.color }}
                        />
                        <span>{s.label}: {pct.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </Tooltip>
            </Marker>
          ))}
        </LeafletMap>
      </div>
    </div>
  );
}
