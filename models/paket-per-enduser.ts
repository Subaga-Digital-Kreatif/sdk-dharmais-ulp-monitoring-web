import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type PaketPerEnduser = {
  satker_unit_kode: string;
  satker_unit_nama: string;
  jumlah_paket: number;
  total_pagu: number;
};

export const getPaketPerEnduser = async (
  filters: DashboardFilters = {},
): Promise<PaketPerEnduser[]> => {
  const response = await api.get("/dashboard/persiapan/paket-per-enduser", {
    params: toFilterParams(filters),
  });
  return response.data;
};
