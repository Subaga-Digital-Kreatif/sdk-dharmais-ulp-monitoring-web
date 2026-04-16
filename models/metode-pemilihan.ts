import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type MetodePemilihanResponse = {
  metode: string;
  count: number;
};

export const getMetodePemilihan = async (
  filters: DashboardFilters = {},
): Promise<MetodePemilihanResponse[]> => {
  const response = await api.get("/dashboard/proses/metode-pemilihan", {
    params: toFilterParams(filters),
  });
  return response.data;
};