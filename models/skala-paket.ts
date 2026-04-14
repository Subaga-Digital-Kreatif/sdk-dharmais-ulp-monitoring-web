import { api } from "./api";

export type SkalaPaketResponse =  {
    skala: string;
    count: number;
};

export const getSkalaPaket = async (): Promise<SkalaPaketResponse[]> => {
  const response = await api.get("/dashboard/proses/skala-paket");
  return response.data;
};