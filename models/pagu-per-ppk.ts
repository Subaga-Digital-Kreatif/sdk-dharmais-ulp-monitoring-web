import { api } from "./api";

export type PaguPerPpk =  {
    ppk_kode: string;
    ppk_nomenklatur: string;
    jumlah_paket: number;
    total_pagu: string;
};

export const getPaguPerPpk = async (): Promise<PaguPerPpk[]> => {
  const response = await api.get("/dashboard/persiapan/pagu-per-ppk");
  return response.data;
};