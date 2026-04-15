'use client';

import type { PieSlice } from '@/lib/utils/genomic';

interface Props {
  slices: PieSlice[];
  title?: string;
}

export function GenomicLegend({ slices, title }: Props) {
  if (!slices.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-white p-3 text-xs">
      {title && <div className="mb-2 text-sm font-semibold">{title}</div>}
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-black/20"
              style={{ background: s.color }}
            />
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
