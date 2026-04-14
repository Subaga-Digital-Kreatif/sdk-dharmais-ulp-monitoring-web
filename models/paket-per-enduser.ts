import { api } from "./api";

export type PaketPerEnduser = {
  satker_unit_kode: string;
  satker_unit_nama: string;
  jumlah_paket: number;
  total_pagu: string;
};

export const getPaketPerEnduser = async (): Promise<PaketPerEnduser[]> => {
  const response = await api.get("/dashboard/persiapan/paket-per-enduser");
  return response.data;
};
