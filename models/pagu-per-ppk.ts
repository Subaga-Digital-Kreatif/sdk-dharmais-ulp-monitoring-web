import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type PaguPerPpk =  {
    ppk_kode: string;
    ppk_nomenklatur: string;
    jumlah_paket: number;
    total_pagu: number;
};

export const getPaguPerPpk = async (
  filters: DashboardFilters = {},
): Promise<PaguPerPpk[]> => {
  const response = await api.get("/dashboard/persiapan/pagu-per-ppk", {
    params: toFilterParams(filters),
  });
  return response.data;
};