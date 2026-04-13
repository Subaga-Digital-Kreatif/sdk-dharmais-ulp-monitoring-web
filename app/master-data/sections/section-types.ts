import type { LucideIcon } from "lucide-react";

export type { StageProcess } from "@/types/stage-process";
export type { Perusahaan } from "@/types/ulp-perusahaan-code";
export type { PpkCode } from "@/types/ulp-ppk-code";

export type MenuId =
  | "perusahaan"
  | "mak"
  | "satker"
  | "ppk"
  | "persiapan"
  | "proses"
  | "users";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "password";
  textarea?: boolean;
  /** Di grid 2 kolom (md+), rentangkan ke lebar penuh. */
  fullWidth?: boolean;
  select?: { value: string; label: string }[];
  readonly?: boolean;
  /** Jika false, opsi placeholder kosong tidak ditampilkan (untuk select wajib pilih salah satu). */
  allowEmpty?: boolean;
};

export type MakKategori = "Belanja Modal" | "Belanja Operasional";
/** Selaras dengan respons API `/ulp-mak-codes` (camelCase). */
export type MakCode = {
  id: number;
  makKategori: string;
  makKode: string;
  makInduk: string;
  makRinci: string;
  makNo: string;
  makKeterangan: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

/** Selaras dengan API `/ulp-satker-unit-codes` (camelCase). */
export type SatkerUnit = {
  id: number;
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

/** Selaras dengan API `/ulp-stage-preperations` (camelCase; decimal sebagai string). */
export type StagePreparation = {
  id: number;
  dppDiterimaTgl: string | null;
  agendaNo: string | null;
  ulpSatkerUnitPengendaliId: number;
  ulpSatkerUnitEnduserId: number;
  suratEnduserNo: string | null;
  suratEnduserTgl: string | null;
  suratEnduserHal: string | null;
  ulpPpkCodeId: number;
  suratPpkNo: string | null;
  dppTgl: string | null;
  suratPpkHal: string | null;
  paketPbjNama: string | null;
  anggaranPaguNonaktif: string | null;
  anggaranPaguAktif: string | null;
  ulpMakCodeId: number | null;
  kelompokBelanjaModal: string | null;
  kelompokBelanjaOperasional: string | null;
  keteranganTambahan: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type SectionDef<T, Id extends MenuId = MenuId> = {
  id: Id;
  label: string;
  icon: LucideIcon;
  columns: string[];
  pick: (x: T) => string;
  toRow: (x: T) => string[];
  filters?: Field[] | ((items: T[]) => Field[]);
  fields: Field[];
  initial: (item?: T) => Record<string, string>;
  build: (args: { formData: Record<string, string>; prev?: T; items: T[] }) => T;
};
