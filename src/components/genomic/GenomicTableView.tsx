'use client';

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from 'lucide-react';
import type { SingleLocusRow, MultiLocusRow, LocusMode } from '@/types/genomic';

const SL_COLUMNS: { key: keyof SingleLocusRow; label: string }[] = [
  { key: 'site', label: 'Site' },
  { key: 'year', label: 'Year' },
  { key: 'platform', label: 'Platform' },
  { key: 'gene_id', label: 'Gene' },
  { key: 'codon', label: 'Codon' },
  { key: 'allele', label: 'Allele' },
  { key: 'prev', label: 'Prevalence' },
  { key: 'freq', label: 'Frequency' },
  { key: 'sample_count', label: 'Sample Count' },
  { key: 'sample_total', label: 'Sample Total' },
  { key: 'allele_count', label: 'Allele Count' },
  { key: 'allele_total', label: 'Allele Total' },
];

const ML_COLUMNS: { key: keyof MultiLocusRow; label: string }[] = [
  { key: 'site', label: 'Site' },
  { key: 'year', label: 'Year' },
  { key: 'platform', label: 'Platform' },
  { key: 'group_id', label: 'Group' },
  { key: 'variant', label: 'Haplotype' },
  { key: 'prev', label: 'Prevalence' },
  { key: 'freq', label: 'Frequency' },
  { key: 'sample_count', label: 'Sample Count' },
  { key: 'sample_total', label: 'Sample Total' },
  { key: 'allele_count', label: 'Allele Count' },
  { key: 'allele_total', label: 'Allele Total' },
];

interface Props {
  mode: LocusMode;
  slRows: SingleLocusRow[];
  mlRows: MultiLocusRow[];
}

export function GenomicTableView({ mode, slRows, mlRows }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const data = mode === 'SingleLocus' ? slRows : mlRows;

  const columns = useMemo<ColumnDef<SingleLocusRow | MultiLocusRow>[]>(() => {
    const src = mode === 'SingleLocus' ? SL_COLUMNS : ML_COLUMNS;
    return src.map((col) => ({
      accessorKey: col.key as string,
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {col.label}
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const v = getValue();
        if (v == null) return <span className="text-muted-foreground">-</span>;
        if (typeof v === 'number') return isFinite(v) ? v.toFixed(3).replace(/\.?0+$/, '') : '-';
        return String(v);
      },
    }));
  }, [mode]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-4">
      <Badge variant="outline">Showing {data.length} records</Badge>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="whitespace-nowrap">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
