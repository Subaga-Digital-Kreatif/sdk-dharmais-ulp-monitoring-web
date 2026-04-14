import { api } from "./api";

export type MetodePemilihanResponse = {
  metode: string;
  count: number;
};

export const getMetodePemilihan = async (): Promise<MetodePemilihanResponse[]> => {
  const response = await api.get("/dashboard/proses/metode-pemilihan");
  return response.data;
};