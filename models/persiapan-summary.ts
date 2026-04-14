import { api } from "./api";

export type PersiapanSummaryResponse = {
  totalPaket: number;
  totalPagu: number;
  totalHps: number;
  jumlahPerHari: number;
};

export const getPersiapanSummary =
  async (): Promise<PersiapanSummaryResponse> => {
    const response = await api.get("/dashboard/persiapan/summary");
    return response.data;
  };
