import { api } from "./api";

export type TopPaketRealisasiResponse = {
  id: number;
  paket_pbj_nama: string;
  nilai_realisasi: number;
  nilai_kontrak: number;
  perusahaan_nama: string;
  perusahaan_alamat: string;
};

export const getTopPaketRealisasi = async (): Promise<
  TopPaketRealisasiResponse[]
> => {
  const response = await api.get("/dashboard/proses/top-paket-realisasi");
  return response.data;
};
