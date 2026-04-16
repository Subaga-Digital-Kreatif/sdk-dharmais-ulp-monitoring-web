import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type PersiapanSummaryResponse = {
  totalPaket: number;
  totalPagu: number;
  totalHps: number;
  jumlahPerHari: number;
};

export const getPersiapanSummary = async (
  filters: DashboardFilters = {},
): Promise<PersiapanSummaryResponse> => {
  const response = await api.get("/dashboard/persiapan/summary", {
    params: toFilterParams(filters),
  });
  return response.data;
};
