"use client";

import { useMemo, useState } from "react";

export function useClientPagination<T>(items: readonly T[] | null | undefined, defaultPerPage = 10) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const total = items?.length ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const safePage = Math.min(Math.max(1, page), lastPage);

  const pageItems = useMemo(() => {
    if (!items?.length) return [] as T[];
    const start = (safePage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, safePage, perPage]);

  return {
    page: safePage,
    perPage,
    total,
    pageItems,
    setPage,
    setPerPage: (n: number) => {
      setPerPage(n);
      setPage(1);
    },
  };
}
