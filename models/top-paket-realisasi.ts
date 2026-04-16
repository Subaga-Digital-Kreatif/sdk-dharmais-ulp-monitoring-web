import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type TopPaketRealisasiResponse = {
  id: number;
  paket_pbj_nama: string;
  nilai_realisasi: number;
  nilai_kontrak: number;
  perusahaan_nama: string;
  perusahaan_alamat: string;
};

export const getTopPaketRealisasi = async (
  filters: DashboardFilters = {},
  limit = 100,
): Promise<TopPaketRealisasiResponse[]> => {
  const response = await api.get("/dashboard/proses/top-paket-realisasi", {
    params: { limit, ...toFilterParams(filters) },
  });
  return response.data;
};
