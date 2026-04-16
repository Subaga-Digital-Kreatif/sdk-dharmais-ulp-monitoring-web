import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type KriteriaBarangjasaResponse = {
  kriteria: string;
  count: number;
};

export const getKriteriaBarangjasa = async (
  filters: DashboardFilters = {},
): Promise<KriteriaBarangjasaResponse[]> => {
  const response = await api.get("/dashboard/proses/kriteria-barangjasa", {
    params: toFilterParams(filters),
  });
  return response.data;
};