import { api } from "./api";

export type ppkCode = {
  id: number;
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type satkerUnitEnduser = {
  id: number;
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type PersiapanList = {
  id: number;
  dppDiterimaTgl: string;
  agendaNo: string;
  ulpSatkerUnitPengendaliId: number;
  ulpSatkerUnitEnduserId: number;
  suratEnduserNo: string;
  suratEnduserTgl: string;
  suratEnduserHal: string;
  ulpPpkCodeId: number;
  suratPpkNo: string;
  dppTgl: string;
  suratPpkHal: string;
  paketPbjNama: string;
  anggaranPaguNonaktif: number | null;
  anggaranPaguAktif: number;
  ulpMakCodeId: number | null;
  kelompokBelanjaModal: number;
  kelompokBelanjaOperasional: number | null;
  keteranganTambahan: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  hps: number | null;
  satkerUnitEnduser: satkerUnitEnduser;
  ppkCode: ppkCode;
  makCode: null;
};

export type PersiapanListResponse = {
  metadata: MetaResponse;
  data: PersiapanList[];
};

export const getPersiapanList = async (): Promise<PersiapanListResponse> => {
  const response = await api.get("/dashboard/persiapan/list");
  return response.data;
};
