"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TablePagerProps = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  loading?: boolean;
  className?: string;
};

export function TablePager({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  loading = false,
  className,
}: TablePagerProps) {
  const lastPage = Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const safePage = Math.min(Math.max(1, page), lastPage);
  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const end = Math.min(safePage * perPage, total);

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), lastPage);
    if (next !== safePage) onPageChange(next);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-t border-[#E1ECF7] bg-white px-3 py-2 text-[11px] text-[#5B6B7F]",
        className,
      )}
    >
      <span className="tabular-nums">
        {loading ? "Memuat…" : `${start.toLocaleString("id-ID")}–${end.toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")}`}
      </span>
      <div className="flex items-center gap-2">
        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="h-7 rounded border border-[#C9E3FF] bg-white px-1 text-[11px] text-[#0B1E33] focus:outline-none focus:ring-1 focus:ring-[#0066CC] disabled:opacity-50"
            aria-label="Baris per halaman"
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}/hal
              </option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-0.5">
          <PagerBtn onClick={() => go(1)} disabled={loading || safePage <= 1} label="Halaman pertama">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </PagerBtn>
          <PagerBtn onClick={() => go(safePage - 1)} disabled={loading || safePage <= 1} label="Halaman sebelumnya">
            <ChevronLeft className="h-3.5 w-3.5" />
          </PagerBtn>
          <span className="min-w-[60px] px-1 text-center tabular-nums">
            {safePage} / {lastPage}
          </span>
          <PagerBtn onClick={() => go(safePage + 1)} disabled={loading || safePage >= lastPage} label="Halaman berikutnya">
            <ChevronRight className="h-3.5 w-3.5" />
          </PagerBtn>
          <PagerBtn onClick={() => go(lastPage)} disabled={loading || safePage >= lastPage} label="Halaman terakhir">
            <ChevronsRight className="h-3.5 w-3.5" />
          </PagerBtn>
        </div>
      </div>
    </div>
  );
}

function PagerBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-6 w-6 items-center justify-center rounded text-[#0066CC] hover:bg-[#E6F3FF] disabled:cursor-not-allowed disabled:text-[#C9E3FF] disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
