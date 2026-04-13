/** Respons & body selaras `/ulp-stage-preperations` (camelCase). */

type StagePreparation = {
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

type CreateStagePreparationRequest = {
  dppDiterimaTgl?: string;
  agendaNo?: string;
  ulpSatkerUnitPengendaliId: number;
  ulpSatkerUnitEnduserId: number;
  suratEnduserNo?: string;
  suratEnduserTgl?: string;
  suratEnduserHal?: string;
  ulpPpkCodeId: number;
  suratPpkNo?: string;
  dppTgl?: string;
  suratPpkHal?: string;
  paketPbjNama?: string;
  anggaranPaguNonaktif?: string;
  anggaranPaguAktif?: string;
  ulpMakCodeId?: number | null;
  kelompokBelanjaModal?: string;
  kelompokBelanjaOperasional?: string;
  keteranganTambahan?: string;
};

type UpdateStagePreparationRequest = Partial<CreateStagePreparationRequest>;
