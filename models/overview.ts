import { api } from "./api";

export type OverviewResponse = {
  totalPaket: number;
  totalPagu: number;
  totalHps: number;
  totalNilaiKontrak: number;
  totalRealisasi: number;
  persentaseRealisasi: number;
};

export const getOverview = async (): Promise<OverviewResponse> => {
  const response = await api.get("/dashboard/proses/summary");
  return response.data;
};
