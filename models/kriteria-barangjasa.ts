import { api } from "./api";

export type KriteriaBarangjasaResponse = {
  kriteria: string;
  count: number;
};

export const getKriteriaBarangjasa = async (): Promise<KriteriaBarangjasaResponse[]> => {
  const response = await api.get("/dashboard/proses/kriteria-barangjasa");
  return response.data;
};