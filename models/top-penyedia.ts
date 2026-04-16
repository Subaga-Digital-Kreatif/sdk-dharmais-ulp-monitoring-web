import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type TopPenyediaResponse = {
  id: number;
  paket_pbj_nama: string;
  perusahaan_nama: string;
  perusahaan_alamat: string;
  nilai_realisasi: number | null;
  nilai_kontrak: number;
};

export const getTopPenyedia = async (
  filters: DashboardFilters = {},
  limit = 100,
): Promise<TopPenyediaResponse[]> => {
  const response = await api.get("/dashboard/proses/top-penyedia", {
    params: { limit, ...toFilterParams(filters) },
  });
  return response.data;
};
