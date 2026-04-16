import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type StatusSuratResponse = {
  status: string;
  count: number;
};

export const getStatusSurat = async (
  filters: DashboardFilters = {},
): Promise<StatusSuratResponse[]> => {
  const response = await api.get("/dashboard/proses/status-surat", {
    params: toFilterParams(filters),
  });
  return response.data;
};