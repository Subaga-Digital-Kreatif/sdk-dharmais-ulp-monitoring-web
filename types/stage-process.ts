/**
 * Entitas `/ulp-stage-processes` (camelCase).
 * Nilai uang dari API bertipe decimal string; jangka waktu & FK opsional boleh null.
 */

export type StageProcess = {
  id: number;
  ulpStagePreparationId: number;
  isRup: boolean;
  isEproc: boolean;
  isManual: boolean;
  rupKode: string | null;
  metodePemilihan: string | null;
  kriteriaBarangjasa: string | null;
  lembarCatatanPengecekanHpsTgl: string | null;
  lembarCatatanPengecekanHpsPic: string | null;
  koreksiAritmatikaTgl: string | null;
  koreksiAritmatikaPic: string | null;
  lembarPersiapanTgl: string | null;
  lembarPersiapanPicBuat: string | null;
  lembarPersiapanPicPokja: string | null;
  pengumumanPemilihanLpseNo: string | null;
  pengumumanPemilihanLpseTgl: string | null;
  pengumumanPemilihanLpsePic: string | null;
  dokumenPemilihanSpphNo: string | null;
  dokumenPemilihanSpphTgl: string | null;
  dokumenPemilihanSpphPic: string | null;
  registrasiDraftPaketPbjSpseTgl: string | null;
  registrasiDraftPaketPbjSpsePic: string | null;
  undanganReviuDppNo: string | null;
  undanganReviuDppTgl: string | null;
  undanganReviuDppPic: string | null;
  lembarDaftarHadirReviuDppTgl: string | null;
  lembarDaftarHadirReviuDppPic: string | null;
  baReviuDppNo: string | null;
  baReviuDppTgl: string | null;
  baReviuDppPic: string | null;
  undanganPemberianPenjelasanNo: string | null;
  undanganPemberianPenjelasanTgl: string | null;
  undanganPemberianPenjelasanPic: string | null;
  lembarDaftarHadirPemberianPenjelasanTgl: string | null;
  lembarDaftarHadirPemberianPenjelasanPic: string | null;
  baPemberianPenjelasanNo: string | null;
  baPemberianPenjelasanTgl: string | null;
  baPemberianPenjelasanPic: string | null;
  dekripsiDataPenawaranTgl: string | null;
  dekripsiDataPenawaranPic: string | null;
  baPembukaanDokumenPenawaranNo: string | null;
  baPembukaanDokumenPenawaranTgl: string | null;
  baPembukaanDokumenPenawaranPic: string | null;
  lembarKoreksiAritmatikaPenawaranHargaTgl: string | null;
  lembarKoreksiAritmatikaPenawaranHargaPic: string | null;
  kertasKerjaEvaluasiPenawaranTgl: string | null;
  kertasKerjaEvaluasiPenawaranPic: string | null;
  baEvaluasiPenawaranNo: string | null;
  baEvaluasiPenawaranTgl: string | null;
  baEvaluasiPenawaranPic: string | null;
  undanganVerifikasiPembuktianKualifikasiNo: string | null;
  undanganVerifikasiPembuktianKualifikasiTgl: string | null;
  undanganVerifikasiPembuktianKualifikasiPic: string | null;
  lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl: string | null;
  lembarDaftarHadirVerifikasiPembuktianKualifikasiPic: string | null;
  lembarNegoTeknisHargaTgl: string | null;
  lembarNegoTeknisHargaPic: string | null;
  baKlarifikasiNegosiasiHargaNo: string | null;
  baKlarifikasiNegosiasiHargaTgl: string | null;
  baKlarifikasiNegosiasiHargaPic: string | null;
  baHasilPemilihanNo: string | null;
  baHasilPemilihanTgl: string | null;
  baHasilPemilihanPic: string | null;
  penetapanPemenangPemilihanNo: string | null;
  penetapanPemenangPemilihanTgl: string | null;
  penetapanPemenangPemilihanPic: string | null;
  pengumumanPemenangPemilihanNo: string | null;
  pengumumanPemenangPemilihanTgl: string | null;
  pengumumanPemenangPemilihanPic: string | null;
  sanggahanNo: string | null;
  sanggahanTgl: string | null;
  sanggahanNamaPeserta: string | null;
  jawabanSanggahNo: string | null;
  jawabanSanggahTgl: string | null;
  jawabanSanggahPic: string | null;
  suratUsulanKajiUlangPaketNo: string | null;
  suratUsulanKajiUlangPaketTgl: string | null;
  suratUsulanKajiUlangPaketPic: string | null;
  laporanHasilPemilihanNo: string | null;
  laporanHasilPemilihanTgl: string | null;
  laporanHasilPemilihanPic: string | null;
  nilaiRealisasi: string | null;
  dokumenSpbSpkKontrakPic: string | null;
  dokumenSpbSpkKontrakNo: string | null;
  dokumenSpbSpkKontrakTgl: string | null;
  nilaiKontrakBlu: string | null;
  nilaiKontrakNonBlu: string | null;
  jangkaWaktuPekerjaan: number | null;
  jangkaWaktuPekerjaanSatuan: string | null;
  ulpPerusahaanId: number | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

type StageProcessWritable = Omit<
  StageProcess,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type CreateStageProcessRequest = Pick<
  StageProcessWritable,
  "ulpStagePreparationId" | "isRup" | "isEproc" | "isManual"
> &
  Partial<Omit<StageProcessWritable, "ulpStagePreparationId" | "isRup" | "isEproc" | "isManual">>;

export type UpdateStageProcessRequest = Partial<CreateStageProcessRequest>;
