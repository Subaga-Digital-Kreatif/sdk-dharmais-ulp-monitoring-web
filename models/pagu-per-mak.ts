import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type PaguPerMak = {
  mak_kode: string;
  mak_keterangan: string | null;
  total_pagu: number;
  jumlah_paket: number;
};

export const getPaguPerMak = async (
  filters: DashboardFilters = {},
): Promise<PaguPerMak[]> => {
  const response = await api.get("/dashboard/persiapan/pagu-per-mak", {
    params: toFilterParams(filters),
  });
  return response.data;
};