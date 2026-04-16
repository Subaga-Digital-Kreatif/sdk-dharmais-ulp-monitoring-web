import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type OverviewResponse = {
  totalPaket: number;
  totalPagu: number;
  totalHps: number;
  totalNilaiKontrak: number;
  totalRealisasi: number;
  persentaseRealisasi: number;
};

export const getOverview = async (
  filters: DashboardFilters = {},
): Promise<OverviewResponse> => {
  const response = await api.get("/dashboard/proses/summary", {
    params: toFilterParams(filters),
  });
  return response.data;
};
