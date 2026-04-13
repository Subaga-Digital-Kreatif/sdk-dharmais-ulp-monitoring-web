import type {
  CreateStageProcessRequest,
  StageProcess,
  UpdateStageProcessRequest,
} from "@/types/stage-process";

import { api } from "./api";

const BASE = "/ulp-stage-processes";

type StageProcessListResponse = {
  data: StageProcess[];
  meta: MetaResponse;
};

function trimUndef(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

function decStr(s: string | undefined): string {
  const t = s?.trim();
  return t !== undefined && t !== "" ? t : "0.00";
}

function optId(s: string | undefined): number | null {
  const t = s?.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function optNum(s: string | undefined): number | null {
  const t = s?.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Memetakan nilai form modal (camelCase) ke body create/update API. */
export function formDataToStageProcessPayload(
  fd: Record<string, string>,
): CreateStageProcessRequest {
  const S = (k: string) => trimUndef(fd[k]);
  return {
    ulpStagePreparationId: Number(fd.ulpStagePreparationId || 0),
    isRup: fd.isRup === "true",
    isEproc: fd.isEproc === "true",
    isManual: fd.isManual === "true",
    rupKode: S("rupKode"),
    metodePemilihan: S("metodePemilihan"),
    kriteriaBarangjasa: S("kriteriaBarangjasa"),
    lembarCatatanPengecekanHpsTgl: S("lembarCatatanPengecekanHpsTgl"),
    lembarCatatanPengecekanHpsPic: S("lembarCatatanPengecekanHpsPic"),
    koreksiAritmatikaTgl: S("koreksiAritmatikaTgl"),
    koreksiAritmatikaPic: S("koreksiAritmatikaPic"),
    lembarPersiapanTgl: S("lembarPersiapanTgl"),
    lembarPersiapanPicBuat: S("lembarPersiapanPicBuat"),
    lembarPersiapanPicPokja: S("lembarPersiapanPicPokja"),
    pengumumanPemilihanLpseNo: S("pengumumanPemilihanLpseNo"),
    pengumumanPemilihanLpseTgl: S("pengumumanPemilihanLpseTgl"),
    pengumumanPemilihanLpsePic: S("pengumumanPemilihanLpsePic"),
    dokumenPemilihanSpphNo: S("dokumenPemilihanSpphNo"),
    dokumenPemilihanSpphTgl: S("dokumenPemilihanSpphTgl"),
    dokumenPemilihanSpphPic: S("dokumenPemilihanSpphPic"),
    registrasiDraftPaketPbjSpseTgl: S("registrasiDraftPaketPbjSpseTgl"),
    registrasiDraftPaketPbjSpsePic: S("registrasiDraftPaketPbjSpsePic"),
    undanganReviuDppNo: S("undanganReviuDppNo"),
    undanganReviuDppTgl: S("undanganReviuDppTgl"),
    undanganReviuDppPic: S("undanganReviuDppPic"),
    lembarDaftarHadirReviuDppTgl: S("lembarDaftarHadirReviuDppTgl"),
    lembarDaftarHadirReviuDppPic: S("lembarDaftarHadirReviuDppPic"),
    baReviuDppNo: S("baReviuDppNo"),
    baReviuDppTgl: S("baReviuDppTgl"),
    baReviuDppPic: S("baReviuDppPic"),
    undanganPemberianPenjelasanNo: S("undanganPemberianPenjelasanNo"),
    undanganPemberianPenjelasanTgl: S("undanganPemberianPenjelasanTgl"),
    undanganPemberianPenjelasanPic: S("undanganPemberianPenjelasanPic"),
    lembarDaftarHadirPemberianPenjelasanTgl: S(
      "lembarDaftarHadirPemberianPenjelasanTgl",
    ),
    lembarDaftarHadirPemberianPenjelasanPic: S(
      "lembarDaftarHadirPemberianPenjelasanPic",
    ),
    baPemberianPenjelasanNo: S("baPemberianPenjelasanNo"),
    baPemberianPenjelasanTgl: S("baPemberianPenjelasanTgl"),
    baPemberianPenjelasanPic: S("baPemberianPenjelasanPic"),
    dekripsiDataPenawaranTgl: S("dekripsiDataPenawaranTgl"),
    dekripsiDataPenawaranPic: S("dekripsiDataPenawaranPic"),
    baPembukaanDokumenPenawaranNo: S("baPembukaanDokumenPenawaranNo"),
    baPembukaanDokumenPenawaranTgl: S("baPembukaanDokumenPenawaranTgl"),
    baPembukaanDokumenPenawaranPic: S("baPembukaanDokumenPenawaranPic"),
    lembarKoreksiAritmatikaPenawaranHargaTgl: S(
      "lembarKoreksiAritmatikaPenawaranHargaTgl",
    ),
    lembarKoreksiAritmatikaPenawaranHargaPic: S(
      "lembarKoreksiAritmatikaPenawaranHargaPic",
    ),
    kertasKerjaEvaluasiPenawaranTgl: S("kertasKerjaEvaluasiPenawaranTgl"),
    kertasKerjaEvaluasiPenawaranPic: S("kertasKerjaEvaluasiPenawaranPic"),
    baEvaluasiPenawaranNo: S("baEvaluasiPenawaranNo"),
    baEvaluasiPenawaranTgl: S("baEvaluasiPenawaranTgl"),
    baEvaluasiPenawaranPic: S("baEvaluasiPenawaranPic"),
    undanganVerifikasiPembuktianKualifikasiNo: S(
      "undanganVerifikasiPembuktianKualifikasiNo",
    ),
    undanganVerifikasiPembuktianKualifikasiTgl: S(
      "undanganVerifikasiPembuktianKualifikasiTgl",
    ),
    undanganVerifikasiPembuktianKualifikasiPic: S(
      "undanganVerifikasiPembuktianKualifikasiPic",
    ),
    lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl: S(
      "lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl",
    ),
    lembarDaftarHadirVerifikasiPembuktianKualifikasiPic: S(
      "lembarDaftarHadirVerifikasiPembuktianKualifikasiPic",
    ),
    lembarNegoTeknisHargaTgl: S("lembarNegoTeknisHargaTgl"),
    lembarNegoTeknisHargaPic: S("lembarNegoTeknisHargaPic"),
    baKlarifikasiNegosiasiHargaNo: S("baKlarifikasiNegosiasiHargaNo"),
    baKlarifikasiNegosiasiHargaTgl: S("baKlarifikasiNegosiasiHargaTgl"),
    baKlarifikasiNegosiasiHargaPic: S("baKlarifikasiNegosiasiHargaPic"),
    baHasilPemilihanNo: S("baHasilPemilihanNo"),
    baHasilPemilihanTgl: S("baHasilPemilihanTgl"),
    baHasilPemilihanPic: S("baHasilPemilihanPic"),
    penetapanPemenangPemilihanNo: S("penetapanPemenangPemilihanNo"),
    penetapanPemenangPemilihanTgl: S("penetapanPemenangPemilihanTgl"),
    penetapanPemenangPemilihanPic: S("penetapanPemenangPemilihanPic"),
    pengumumanPemenangPemilihanNo: S("pengumumanPemenangPemilihanNo"),
    pengumumanPemenangPemilihanTgl: S("pengumumanPemenangPemilihanTgl"),
    pengumumanPemenangPemilihanPic: S("pengumumanPemenangPemilihanPic"),
    sanggahanNo: S("sanggahanNo"),
    sanggahanTgl: S("sanggahanTgl"),
    sanggahanNamaPeserta: S("sanggahanNamaPeserta"),
    jawabanSanggahNo: S("jawabanSanggahNo"),
    jawabanSanggahTgl: S("jawabanSanggahTgl"),
    jawabanSanggahPic: S("jawabanSanggahPic"),
    suratUsulanKajiUlangPaketNo: S("suratUsulanKajiUlangPaketNo"),
    suratUsulanKajiUlangPaketTgl: S("suratUsulanKajiUlangPaketTgl"),
    suratUsulanKajiUlangPaketPic: S("suratUsulanKajiUlangPaketPic"),
    laporanHasilPemilihanNo: S("laporanHasilPemilihanNo"),
    laporanHasilPemilihanTgl: S("laporanHasilPemilihanTgl"),
    laporanHasilPemilihanPic: S("laporanHasilPemilihanPic"),
    nilaiRealisasi: decStr(fd.nilaiRealisasi),
    dokumenSpbSpkKontrakPic: S("dokumenSpbSpkKontrakPic"),
    dokumenSpbSpkKontrakNo: S("dokumenSpbSpkKontrakNo"),
    dokumenSpbSpkKontrakTgl: S("dokumenSpbSpkKontrakTgl"),
    nilaiKontrakBlu: decStr(fd.nilaiKontrakBlu),
    nilaiKontrakNonBlu: decStr(fd.nilaiKontrakNonBlu),
    jangkaWaktuPekerjaan: optNum(fd.jangkaWaktuPekerjaan),
    jangkaWaktuPekerjaanSatuan: S("jangkaWaktuPekerjaanSatuan"),
    ulpPerusahaanId: optId(fd.ulpPerusahaanId),
  };
}

export const stageProcess = {
  getAll: async () => {
    const response = await api.get<StageProcessListResponse>(BASE);
    return response.data;
  },

  getById: async (id: number, params?: { include?: string }) => {
    const response = await api.get<StageProcess>(`${BASE}/${id}`, {
      params,
    });
    return response.data;
  },

  create: async (request: CreateStageProcessRequest) => {
    const response = await api.post<StageProcess>(BASE, request);
    return response.data;
  },

  update: async (id: number, request: UpdateStageProcessRequest) => {
    const response = await api.put<StageProcess>(`${BASE}/${id}`, request);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
