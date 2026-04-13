import { Database } from "lucide-react";

import { formDataToStageProcessPayload } from "@/models/stage-process";

import type { SectionDef, StageProcess } from "./section-types";

function dateInput(v: string | null | undefined): string {
  if (!v) return "";
  return v.slice(0, 10);
}

function fmtMoney(v: string | null | undefined): string {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

const metodeOptions = [
  { value: "Pengadaan Langsung", label: "Pengadaan Langsung" },
  { value: "Penunjukan Langsung", label: "Penunjukan Langsung" },
  { value: "Tender", label: "Tender" },
  { value: "E-Pengadaan Langsung", label: "E-Pengadaan Langsung" },
  { value: "E-Penunjukan Langsung", label: "E-Penunjukan Langsung" },
  { value: "E-Purchasing", label: "E-Purchasing" },
  { value: "E-Tender", label: "E-Tender" },
] as const;

const kriteriaOptions = [
  { value: "Barang", label: "Barang" },
  { value: "Jasa Lainnya", label: "Jasa Lainnya" },
  { value: "Pekerjaan Konstruksi", label: "Pekerjaan Konstruksi" },
] as const;

const boolSelect = [
  { value: "true", label: "Ya" },
  { value: "false", label: "Tidak" },
] as const;

export const prosesSection: SectionDef<StageProcess, "proses"> = {
  id: "proses",
  label: "Proses Pemilihan",
  icon: Database,
  columns: ["ID", "RUP", "Metode", "Kriteria", "Realisasi"],
  pick: (x) =>
    [
      x.rupKode,
      x.metodePemilihan,
      x.pengumumanPemilihanLpseNo,
      x.dokumenPemilihanSpphNo,
      x.baHasilPemilihanNo,
    ]
      .filter((s): s is string => Boolean(s && String(s).trim()))
      .join(" "),
  toRow: (x) => [
    String(x.id),
    x.rupKode ?? "",
    x.metodePemilihan ?? "",
    x.kriteriaBarangjasa ?? "",
    fmtMoney(x.nilaiRealisasi),
  ],
  filters: [
    {
      name: "metodePemilihan",
      label: "Metode",
      select: [...metodeOptions],
    },
    {
      name: "kriteriaBarangjasa",
      label: "Kriteria",
      select: [...kriteriaOptions],
    },
    {
      name: "isRup",
      label: "RUP",
      select: [...boolSelect],
    },
    {
      name: "isEproc",
      label: "E-Proc",
      select: [...boolSelect],
    },
    {
      name: "isManual",
      label: "Manual",
      select: [...boolSelect],
    },
    { name: "rupKode", label: "Kode RUP" },
    { name: "nilaiRealisasi", label: "Nilai Realisasi", type: "number" },
    {
      name: "ulpStagePreparationId",
      label: "Tahap Persiapan (ID)",
      type: "number",
    },
    { name: "ulpPerusahaanId", label: "Perusahaan (ID)", type: "number" },
  ],
  fields: [
    { name: "id", label: "ID", type: "number", readonly: true },
    {
      name: "ulpStagePreparationId",
      label: "Tahap Persiapan (ID)",
      type: "number",
    },
    { name: "rupKode", label: "Kode RUP" },
    {
      name: "metodePemilihan",
      label: "Metode",
      select: [...metodeOptions],
      allowEmpty: false,
    },
    {
      name: "kriteriaBarangjasa",
      label: "Kriteria",
      select: [...kriteriaOptions],
      allowEmpty: false,
    },
    { name: "nilaiRealisasi", label: "Nilai Realisasi", type: "number" },
    {
      name: "isRup",
      label: "RUP",
      select: [...boolSelect],
      allowEmpty: false,
    },
    {
      name: "isEproc",
      label: "E-Proc",
      select: [...boolSelect],
      allowEmpty: false,
    },
    {
      name: "isManual",
      label: "Manual",
      select: [...boolSelect],
      allowEmpty: false,
    },
    {
      name: "lembarCatatanPengecekanHpsTgl",
      label: "Lembar Catatan Pengecekan HPS (Tgl)",
      type: "date",
    },
    {
      name: "lembarCatatanPengecekanHpsPic",
      label: "Lembar Catatan Pengecekan HPS (PIC)",
    },
    {
      name: "koreksiAritmatikaTgl",
      label: "Koreksi Aritmatika (Tgl)",
      type: "date",
    },
    { name: "koreksiAritmatikaPic", label: "Koreksi Aritmatika (PIC)" },
    {
      name: "lembarPersiapanTgl",
      label: "Lembar Persiapan (Tgl)",
      type: "date",
    },
    {
      name: "lembarPersiapanPicBuat",
      label: "Lembar Persiapan (PIC Buat)",
    },
    {
      name: "lembarPersiapanPicPokja",
      label: "Lembar Persiapan (PIC Ka. Pokja)",
    },
    {
      name: "pengumumanPemilihanLpseNo",
      label: "Pengumuman Pemilihan LPSE (No)",
    },
    {
      name: "pengumumanPemilihanLpseTgl",
      label: "Pengumuman Pemilihan LPSE (Tgl)",
      type: "date",
    },
    {
      name: "pengumumanPemilihanLpsePic",
      label: "Pengumuman Pemilihan LPSE (PIC)",
    },
    {
      name: "dokumenPemilihanSpphNo",
      label: "Dokumen Pemilihan SPPH (No)",
    },
    {
      name: "dokumenPemilihanSpphTgl",
      label: "Dokumen Pemilihan SPPH (Tgl)",
      type: "date",
    },
    {
      name: "dokumenPemilihanSpphPic",
      label: "Dokumen Pemilihan SPPH (PIC)",
    },
    {
      name: "registrasiDraftPaketPbjSpseTgl",
      label: "Registrasi Draft Paket PBJ SPSE (Tgl)",
      type: "date",
    },
    {
      name: "registrasiDraftPaketPbjSpsePic",
      label: "Registrasi Draft Paket PBJ SPSE (PIC)",
    },
    { name: "undanganReviuDppNo", label: "Undangan Reviu DPP (No)" },
    {
      name: "undanganReviuDppTgl",
      label: "Undangan Reviu DPP (Tgl)",
      type: "date",
    },
    { name: "undanganReviuDppPic", label: "Undangan Reviu DPP (PIC)" },
    {
      name: "lembarDaftarHadirReviuDppTgl",
      label: "Daftar Hadir Reviu DPP (Tgl)",
      type: "date",
    },
    {
      name: "lembarDaftarHadirReviuDppPic",
      label: "Daftar Hadir Reviu DPP (PIC)",
    },
    { name: "baReviuDppNo", label: "BA Reviu DPP (No)" },
    { name: "baReviuDppTgl", label: "BA Reviu DPP (Tgl)", type: "date" },
    { name: "baReviuDppPic", label: "BA Reviu DPP (PIC)" },
    {
      name: "undanganPemberianPenjelasanNo",
      label: "Undangan Pemberian Penjelasan (No)",
    },
    {
      name: "undanganPemberianPenjelasanTgl",
      label: "Undangan Pemberian Penjelasan (Tgl)",
      type: "date",
    },
    {
      name: "undanganPemberianPenjelasanPic",
      label: "Undangan Pemberian Penjelasan (PIC)",
    },
    {
      name: "lembarDaftarHadirPemberianPenjelasanTgl",
      label: "Daftar Hadir Pemberian Penjelasan (Tgl)",
      type: "date",
    },
    {
      name: "lembarDaftarHadirPemberianPenjelasanPic",
      label: "Daftar Hadir Pemberian Penjelasan (PIC)",
    },
    {
      name: "baPemberianPenjelasanNo",
      label: "BA Pemberian Penjelasan (No)",
    },
    {
      name: "baPemberianPenjelasanTgl",
      label: "BA Pemberian Penjelasan (Tgl)",
      type: "date",
    },
    {
      name: "baPemberianPenjelasanPic",
      label: "BA Pemberian Penjelasan (PIC)",
    },
    {
      name: "dekripsiDataPenawaranTgl",
      label: "Dekripsi Data Penawaran (Tgl)",
      type: "date",
    },
    {
      name: "dekripsiDataPenawaranPic",
      label: "Dekripsi Data Penawaran (PIC)",
    },
    {
      name: "baPembukaanDokumenPenawaranNo",
      label: "BA Pembukaan Dokumen Penawaran (No)",
    },
    {
      name: "baPembukaanDokumenPenawaranTgl",
      label: "BA Pembukaan Dokumen Penawaran (Tgl)",
      type: "date",
    },
    {
      name: "baPembukaanDokumenPenawaranPic",
      label: "BA Pembukaan Dokumen Penawaran (PIC)",
    },
    {
      name: "lembarKoreksiAritmatikaPenawaranHargaTgl",
      label: "Koreksi Aritmatika Penawaran Harga (Tgl)",
      type: "date",
    },
    {
      name: "lembarKoreksiAritmatikaPenawaranHargaPic",
      label: "Koreksi Aritmatika Penawaran Harga (PIC)",
    },
    {
      name: "kertasKerjaEvaluasiPenawaranTgl",
      label: "Kertas Kerja Evaluasi Penawaran (Tgl)",
      type: "date",
    },
    {
      name: "kertasKerjaEvaluasiPenawaranPic",
      label: "Kertas Kerja Evaluasi Penawaran (PIC)",
    },
    {
      name: "baEvaluasiPenawaranNo",
      label: "BA Evaluasi Penawaran (No)",
    },
    {
      name: "baEvaluasiPenawaranTgl",
      label: "BA Evaluasi Penawaran (Tgl)",
      type: "date",
    },
    {
      name: "baEvaluasiPenawaranPic",
      label: "BA Evaluasi Penawaran (PIC)",
    },
    {
      name: "undanganVerifikasiPembuktianKualifikasiNo",
      label: "Undangan Verifikasi Kualifikasi (No)",
    },
    {
      name: "undanganVerifikasiPembuktianKualifikasiTgl",
      label: "Undangan Verifikasi Kualifikasi (Tgl)",
      type: "date",
    },
    {
      name: "undanganVerifikasiPembuktianKualifikasiPic",
      label: "Undangan Verifikasi Kualifikasi (PIC)",
    },
    {
      name: "lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl",
      label: "Daftar Hadir Verifikasi Kualifikasi (Tgl)",
      type: "date",
    },
    {
      name: "lembarDaftarHadirVerifikasiPembuktianKualifikasiPic",
      label: "Daftar Hadir Verifikasi Kualifikasi (PIC)",
    },
    {
      name: "lembarNegoTeknisHargaTgl",
      label: "Lembar Nego Teknis dan Harga (Tgl)",
      type: "date",
    },
    {
      name: "lembarNegoTeknisHargaPic",
      label: "Lembar Nego Teknis dan Harga (PIC)",
    },
    {
      name: "baKlarifikasiNegosiasiHargaNo",
      label: "BA Klarifikasi & Negosiasi Harga (No)",
    },
    {
      name: "baKlarifikasiNegosiasiHargaTgl",
      label: "BA Klarifikasi & Negosiasi Harga (Tgl)",
      type: "date",
    },
    {
      name: "baKlarifikasiNegosiasiHargaPic",
      label: "BA Klarifikasi & Negosiasi Harga (PIC)",
    },
    {
      name: "baHasilPemilihanNo",
      label: "BA Hasil Pemilihan (No)",
    },
    {
      name: "baHasilPemilihanTgl",
      label: "BA Hasil Pemilihan (Tgl)",
      type: "date",
    },
    {
      name: "baHasilPemilihanPic",
      label: "BA Hasil Pemilihan (PIC)",
    },
    {
      name: "penetapanPemenangPemilihanNo",
      label: "Penetapan Pemenang (No)",
    },
    {
      name: "penetapanPemenangPemilihanTgl",
      label: "Penetapan Pemenang (Tgl)",
      type: "date",
    },
    {
      name: "penetapanPemenangPemilihanPic",
      label: "Penetapan Pemenang (PIC)",
    },
    {
      name: "pengumumanPemenangPemilihanNo",
      label: "Pengumuman Pemenang (No)",
    },
    {
      name: "pengumumanPemenangPemilihanTgl",
      label: "Pengumuman Pemenang (Tgl)",
      type: "date",
    },
    {
      name: "pengumumanPemenangPemilihanPic",
      label: "Pengumuman Pemenang (PIC)",
    },
    { name: "sanggahanNo", label: "Sanggahan (No)" },
    { name: "sanggahanTgl", label: "Sanggahan (Tgl)", type: "date" },
    { name: "sanggahanNamaPeserta", label: "Sanggahan (Nama Peserta)" },
    { name: "jawabanSanggahNo", label: "Jawaban Sanggah (No)" },
    {
      name: "jawabanSanggahTgl",
      label: "Jawaban Sanggah (Tgl)",
      type: "date",
    },
    { name: "jawabanSanggahPic", label: "Jawaban Sanggah (PIC)" },
    {
      name: "suratUsulanKajiUlangPaketNo",
      label: "Surat Usulan Kaji Ulang Paket (No)",
    },
    {
      name: "suratUsulanKajiUlangPaketTgl",
      label: "Surat Usulan Kaji Ulang Paket (Tgl)",
      type: "date",
    },
    {
      name: "suratUsulanKajiUlangPaketPic",
      label: "Surat Usulan Kaji Ulang Paket (PIC)",
    },
    {
      name: "laporanHasilPemilihanNo",
      label: "Laporan Hasil Pemilihan (No)",
    },
    {
      name: "laporanHasilPemilihanTgl",
      label: "Laporan Hasil Pemilihan (Tgl)",
      type: "date",
    },
    {
      name: "laporanHasilPemilihanPic",
      label: "Laporan Hasil Pemilihan (PIC)",
    },
    {
      name: "dokumenSpbSpkKontrakPic",
      label: "Dokumen SPB/SPK/Kontrak (PIC)",
    },
    {
      name: "dokumenSpbSpkKontrakNo",
      label: "Dokumen SPB/SPK/Kontrak (Nomor)",
    },
    {
      name: "dokumenSpbSpkKontrakTgl",
      label: "Dokumen SPB/SPK/Kontrak (Tanggal)",
      type: "date",
    },
    { name: "nilaiKontrakBlu", label: "Nilai Kontrak (BLU)", type: "number" },
    {
      name: "nilaiKontrakNonBlu",
      label: "Nilai Kontrak (Non BLU)",
      type: "number",
    },
    {
      name: "jangkaWaktuPekerjaan",
      label: "Jangka Waktu Pekerjaan",
      type: "number",
    },
    {
      name: "jangkaWaktuPekerjaanSatuan",
      label: "Satuan Jangka Waktu",
    },
    { name: "ulpPerusahaanId", label: "Perusahaan (ID)", type: "number" },
    { name: "createdAt", label: "Created At", readonly: true },
    { name: "updatedAt", label: "Updated At", readonly: true },
    { name: "deletedAt", label: "Deleted At", readonly: true },
  ],
  initial: (item) => {
    const empty: Record<string, string> = {
      id: "",
      ulpStagePreparationId: "",
      isRup: "false",
      isEproc: "false",
      isManual: "false",
      rupKode: "",
      metodePemilihan: "Pengadaan Langsung",
      kriteriaBarangjasa: "Barang",
      lembarCatatanPengecekanHpsTgl: "",
      lembarCatatanPengecekanHpsPic: "",
      koreksiAritmatikaTgl: "",
      koreksiAritmatikaPic: "",
      lembarPersiapanTgl: "",
      lembarPersiapanPicBuat: "",
      lembarPersiapanPicPokja: "",
      pengumumanPemilihanLpseNo: "",
      pengumumanPemilihanLpseTgl: "",
      pengumumanPemilihanLpsePic: "",
      dokumenPemilihanSpphNo: "",
      dokumenPemilihanSpphTgl: "",
      dokumenPemilihanSpphPic: "",
      registrasiDraftPaketPbjSpseTgl: "",
      registrasiDraftPaketPbjSpsePic: "",
      undanganReviuDppNo: "",
      undanganReviuDppTgl: "",
      undanganReviuDppPic: "",
      lembarDaftarHadirReviuDppTgl: "",
      lembarDaftarHadirReviuDppPic: "",
      baReviuDppNo: "",
      baReviuDppTgl: "",
      baReviuDppPic: "",
      undanganPemberianPenjelasanNo: "",
      undanganPemberianPenjelasanTgl: "",
      undanganPemberianPenjelasanPic: "",
      lembarDaftarHadirPemberianPenjelasanTgl: "",
      lembarDaftarHadirPemberianPenjelasanPic: "",
      baPemberianPenjelasanNo: "",
      baPemberianPenjelasanTgl: "",
      baPemberianPenjelasanPic: "",
      dekripsiDataPenawaranTgl: "",
      dekripsiDataPenawaranPic: "",
      baPembukaanDokumenPenawaranNo: "",
      baPembukaanDokumenPenawaranTgl: "",
      baPembukaanDokumenPenawaranPic: "",
      lembarKoreksiAritmatikaPenawaranHargaTgl: "",
      lembarKoreksiAritmatikaPenawaranHargaPic: "",
      kertasKerjaEvaluasiPenawaranTgl: "",
      kertasKerjaEvaluasiPenawaranPic: "",
      baEvaluasiPenawaranNo: "",
      baEvaluasiPenawaranTgl: "",
      baEvaluasiPenawaranPic: "",
      undanganVerifikasiPembuktianKualifikasiNo: "",
      undanganVerifikasiPembuktianKualifikasiTgl: "",
      undanganVerifikasiPembuktianKualifikasiPic: "",
      lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl: "",
      lembarDaftarHadirVerifikasiPembuktianKualifikasiPic: "",
      lembarNegoTeknisHargaTgl: "",
      lembarNegoTeknisHargaPic: "",
      baKlarifikasiNegosiasiHargaNo: "",
      baKlarifikasiNegosiasiHargaTgl: "",
      baKlarifikasiNegosiasiHargaPic: "",
      baHasilPemilihanNo: "",
      baHasilPemilihanTgl: "",
      baHasilPemilihanPic: "",
      penetapanPemenangPemilihanNo: "",
      penetapanPemenangPemilihanTgl: "",
      penetapanPemenangPemilihanPic: "",
      pengumumanPemenangPemilihanNo: "",
      pengumumanPemenangPemilihanTgl: "",
      pengumumanPemenangPemilihanPic: "",
      sanggahanNo: "",
      sanggahanTgl: "",
      sanggahanNamaPeserta: "",
      jawabanSanggahNo: "",
      jawabanSanggahTgl: "",
      jawabanSanggahPic: "",
      suratUsulanKajiUlangPaketNo: "",
      suratUsulanKajiUlangPaketTgl: "",
      suratUsulanKajiUlangPaketPic: "",
      laporanHasilPemilihanNo: "",
      laporanHasilPemilihanTgl: "",
      laporanHasilPemilihanPic: "",
      nilaiRealisasi: "",
      dokumenSpbSpkKontrakPic: "",
      dokumenSpbSpkKontrakNo: "",
      dokumenSpbSpkKontrakTgl: "",
      nilaiKontrakBlu: "",
      nilaiKontrakNonBlu: "",
      jangkaWaktuPekerjaan: "",
      jangkaWaktuPekerjaanSatuan: "",
      ulpPerusahaanId: "",
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    };
    if (!item) return empty;
    return {
      id: String(item.id),
      ulpStagePreparationId: String(item.ulpStagePreparationId ?? ""),
      isRup: item.isRup ? "true" : "false",
      isEproc: item.isEproc ? "true" : "false",
      isManual: item.isManual ? "true" : "false",
      rupKode: item.rupKode ?? "",
      metodePemilihan: item.metodePemilihan ?? "Pengadaan Langsung",
      kriteriaBarangjasa: item.kriteriaBarangjasa ?? "Barang",
      lembarCatatanPengecekanHpsTgl: dateInput(
        item.lembarCatatanPengecekanHpsTgl,
      ),
      lembarCatatanPengecekanHpsPic: item.lembarCatatanPengecekanHpsPic ?? "",
      koreksiAritmatikaTgl: dateInput(item.koreksiAritmatikaTgl),
      koreksiAritmatikaPic: item.koreksiAritmatikaPic ?? "",
      lembarPersiapanTgl: dateInput(item.lembarPersiapanTgl),
      lembarPersiapanPicBuat: item.lembarPersiapanPicBuat ?? "",
      lembarPersiapanPicPokja: item.lembarPersiapanPicPokja ?? "",
      pengumumanPemilihanLpseNo: item.pengumumanPemilihanLpseNo ?? "",
      pengumumanPemilihanLpseTgl: dateInput(item.pengumumanPemilihanLpseTgl),
      pengumumanPemilihanLpsePic: item.pengumumanPemilihanLpsePic ?? "",
      dokumenPemilihanSpphNo: item.dokumenPemilihanSpphNo ?? "",
      dokumenPemilihanSpphTgl: dateInput(item.dokumenPemilihanSpphTgl),
      dokumenPemilihanSpphPic: item.dokumenPemilihanSpphPic ?? "",
      registrasiDraftPaketPbjSpseTgl: dateInput(
        item.registrasiDraftPaketPbjSpseTgl,
      ),
      registrasiDraftPaketPbjSpsePic: item.registrasiDraftPaketPbjSpsePic ?? "",
      undanganReviuDppNo: item.undanganReviuDppNo ?? "",
      undanganReviuDppTgl: dateInput(item.undanganReviuDppTgl),
      undanganReviuDppPic: item.undanganReviuDppPic ?? "",
      lembarDaftarHadirReviuDppTgl: dateInput(
        item.lembarDaftarHadirReviuDppTgl,
      ),
      lembarDaftarHadirReviuDppPic: item.lembarDaftarHadirReviuDppPic ?? "",
      baReviuDppNo: item.baReviuDppNo ?? "",
      baReviuDppTgl: dateInput(item.baReviuDppTgl),
      baReviuDppPic: item.baReviuDppPic ?? "",
      undanganPemberianPenjelasanNo: item.undanganPemberianPenjelasanNo ?? "",
      undanganPemberianPenjelasanTgl: dateInput(
        item.undanganPemberianPenjelasanTgl,
      ),
      undanganPemberianPenjelasanPic: item.undanganPemberianPenjelasanPic ?? "",
      lembarDaftarHadirPemberianPenjelasanTgl: dateInput(
        item.lembarDaftarHadirPemberianPenjelasanTgl,
      ),
      lembarDaftarHadirPemberianPenjelasanPic:
        item.lembarDaftarHadirPemberianPenjelasanPic ?? "",
      baPemberianPenjelasanNo: item.baPemberianPenjelasanNo ?? "",
      baPemberianPenjelasanTgl: dateInput(item.baPemberianPenjelasanTgl),
      baPemberianPenjelasanPic: item.baPemberianPenjelasanPic ?? "",
      dekripsiDataPenawaranTgl: dateInput(item.dekripsiDataPenawaranTgl),
      dekripsiDataPenawaranPic: item.dekripsiDataPenawaranPic ?? "",
      baPembukaanDokumenPenawaranNo: item.baPembukaanDokumenPenawaranNo ?? "",
      baPembukaanDokumenPenawaranTgl: dateInput(
        item.baPembukaanDokumenPenawaranTgl,
      ),
      baPembukaanDokumenPenawaranPic: item.baPembukaanDokumenPenawaranPic ?? "",
      lembarKoreksiAritmatikaPenawaranHargaTgl: dateInput(
        item.lembarKoreksiAritmatikaPenawaranHargaTgl,
      ),
      lembarKoreksiAritmatikaPenawaranHargaPic:
        item.lembarKoreksiAritmatikaPenawaranHargaPic ?? "",
      kertasKerjaEvaluasiPenawaranTgl: dateInput(
        item.kertasKerjaEvaluasiPenawaranTgl,
      ),
      kertasKerjaEvaluasiPenawaranPic: item.kertasKerjaEvaluasiPenawaranPic ?? "",
      baEvaluasiPenawaranNo: item.baEvaluasiPenawaranNo ?? "",
      baEvaluasiPenawaranTgl: dateInput(item.baEvaluasiPenawaranTgl),
      baEvaluasiPenawaranPic: item.baEvaluasiPenawaranPic ?? "",
      undanganVerifikasiPembuktianKualifikasiNo:
        item.undanganVerifikasiPembuktianKualifikasiNo ?? "",
      undanganVerifikasiPembuktianKualifikasiTgl: dateInput(
        item.undanganVerifikasiPembuktianKualifikasiTgl,
      ),
      undanganVerifikasiPembuktianKualifikasiPic:
        item.undanganVerifikasiPembuktianKualifikasiPic ?? "",
      lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl: dateInput(
        item.lembarDaftarHadirVerifikasiPembuktianKualifikasiTgl,
      ),
      lembarDaftarHadirVerifikasiPembuktianKualifikasiPic:
        item.lembarDaftarHadirVerifikasiPembuktianKualifikasiPic ?? "",
      lembarNegoTeknisHargaTgl: dateInput(item.lembarNegoTeknisHargaTgl),
      lembarNegoTeknisHargaPic: item.lembarNegoTeknisHargaPic ?? "",
      baKlarifikasiNegosiasiHargaNo: item.baKlarifikasiNegosiasiHargaNo ?? "",
      baKlarifikasiNegosiasiHargaTgl: dateInput(
        item.baKlarifikasiNegosiasiHargaTgl,
      ),
      baKlarifikasiNegosiasiHargaPic: item.baKlarifikasiNegosiasiHargaPic ?? "",
      baHasilPemilihanNo: item.baHasilPemilihanNo ?? "",
      baHasilPemilihanTgl: dateInput(item.baHasilPemilihanTgl),
      baHasilPemilihanPic: item.baHasilPemilihanPic ?? "",
      penetapanPemenangPemilihanNo: item.penetapanPemenangPemilihanNo ?? "",
      penetapanPemenangPemilihanTgl: dateInput(
        item.penetapanPemenangPemilihanTgl,
      ),
      penetapanPemenangPemilihanPic: item.penetapanPemenangPemilihanPic ?? "",
      pengumumanPemenangPemilihanNo: item.pengumumanPemenangPemilihanNo ?? "",
      pengumumanPemenangPemilihanTgl: dateInput(
        item.pengumumanPemenangPemilihanTgl,
      ),
      pengumumanPemenangPemilihanPic: item.pengumumanPemenangPemilihanPic ?? "",
      sanggahanNo: item.sanggahanNo ?? "",
      sanggahanTgl: dateInput(item.sanggahanTgl),
      sanggahanNamaPeserta: item.sanggahanNamaPeserta ?? "",
      jawabanSanggahNo: item.jawabanSanggahNo ?? "",
      jawabanSanggahTgl: dateInput(item.jawabanSanggahTgl),
      jawabanSanggahPic: item.jawabanSanggahPic ?? "",
      suratUsulanKajiUlangPaketNo: item.suratUsulanKajiUlangPaketNo ?? "",
      suratUsulanKajiUlangPaketTgl: dateInput(
        item.suratUsulanKajiUlangPaketTgl,
      ),
      suratUsulanKajiUlangPaketPic: item.suratUsulanKajiUlangPaketPic ?? "",
      laporanHasilPemilihanNo: item.laporanHasilPemilihanNo ?? "",
      laporanHasilPemilihanTgl: dateInput(item.laporanHasilPemilihanTgl),
      laporanHasilPemilihanPic: item.laporanHasilPemilihanPic ?? "",
      nilaiRealisasi: item.nilaiRealisasi ?? "",
      dokumenSpbSpkKontrakPic: item.dokumenSpbSpkKontrakPic ?? "",
      dokumenSpbSpkKontrakNo: item.dokumenSpbSpkKontrakNo ?? "",
      dokumenSpbSpkKontrakTgl: dateInput(item.dokumenSpbSpkKontrakTgl),
      nilaiKontrakBlu: item.nilaiKontrakBlu ?? "",
      nilaiKontrakNonBlu: item.nilaiKontrakNonBlu ?? "",
      jangkaWaktuPekerjaan:
        item.jangkaWaktuPekerjaan != null
          ? String(item.jangkaWaktuPekerjaan)
          : "",
      jangkaWaktuPekerjaanSatuan: item.jangkaWaktuPekerjaanSatuan ?? "",
      ulpPerusahaanId:
        item.ulpPerusahaanId != null ? String(item.ulpPerusahaanId) : "",
      createdAt: item.createdAt ?? "",
      updatedAt: item.updatedAt ?? "",
      deletedAt: item.deletedAt ?? "",
    };
  },
  build: ({ formData, prev, items }) => {
    const p = formDataToStageProcessPayload(formData);
    const nextId =
      prev?.id ?? Math.max(0, ...items.map((m) => m.id), 0) + 1;
    return {
      id: nextId,
      ...p,
      createdAt: prev?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as StageProcess;
  },
};
