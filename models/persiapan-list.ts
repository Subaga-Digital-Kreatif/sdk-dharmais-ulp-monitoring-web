import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type ppkCode = {
  id: number;
  ppkKode: string;
  ppkNomenklatur: string;
  ppkNama: string | null;
  ppkJabatan: string | null;
  ppkUsulanMasuk: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type satkerUnit = {
  id: number;
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type satkerUnitEnduser = satkerUnit;

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
  anggaranPaguNonaktif: string | null;
  anggaranPaguAktif: string;
  ulpMakCodeId: number | null;
  kelompokBelanjaModal: string;
  kelompokBelanjaOperasional: string | null;
  keteranganTambahan: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  hps: string | null;
  satkerUnitPengendali: satkerUnit | null;
  satkerUnitEnduser: satkerUnit | null;
  ppkCode: ppkCode | null;
  makCode: MakCode | null;
};

export type PersiapanListResponse = {
  meta: MetaResponse;
  data: PersiapanList[];
};

export type GetPersiapanListParams = {
  page?: number;
  perPage?: number;
} & DashboardFilters;

export const getPersiapanList = async (
  params: GetPersiapanListParams = {},
): Promise<PersiapanListResponse> => {
  const { page, perPage, ...filters } = params;
  const response = await api.get("/dashboard/persiapan/list", {
    params: {
      page: page ?? 1,
      perPage: perPage ?? 25,
      ...toFilterParams(filters),
    },
  });
  return response.data;
};
