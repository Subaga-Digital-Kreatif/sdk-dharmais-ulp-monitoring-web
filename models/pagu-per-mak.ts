import { api } from "./api";

export type PaguPerMak = {
  mak_kode: string;
  mak_keterangan: null;
  total_pagu: string;
  jumlah_paket: number;
};

export const getPaguPerMak = async (): Promise<PaguPerMak[]> => {
  const response = await api.get("/dashboard/persiapan/pagu-per-mak");
  return response.data;
};