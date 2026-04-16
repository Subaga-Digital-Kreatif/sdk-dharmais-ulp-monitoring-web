import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type SkalaPaketResponse =  {
    skala: string;
    count: number;
};

export const getSkalaPaket = async (
  filters: DashboardFilters = {},
): Promise<SkalaPaketResponse[]> => {
  const response = await api.get("/dashboard/proses/skala-paket", {
    params: toFilterParams(filters),
  });
  return response.data;
};