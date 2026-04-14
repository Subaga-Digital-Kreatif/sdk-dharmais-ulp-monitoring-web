import { api } from "./api";

export type TopPenyediaResponse = {
  id: number;
  paket_pbj_nama: string;
  perusahaan_nama: string;
  perusahaan_alamat: string;
  nilai_realisasi: number | null;
  nilai_kontrak: number;
};

export const getTopPenyedia = async (): Promise<TopPenyediaResponse[]> => {
  const response = await api.get("/dashboard/proses/top-penyedia");
  return response.data;
};
