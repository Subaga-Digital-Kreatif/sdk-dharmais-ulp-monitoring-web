import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type MakKategori = "Belanja Modal" | "Belanja Operasional";

type MakCode = {
  id: number;
  mak_kategori: MakKategori;
  mak_kode: string;
  mak_induk: string;
  mak_rinci: string;
  mak_no: string;
  mak_keterangan: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type SatkerUnit = {
  id: number;
  satker_unit_pengendali_kode: string;
  satker_unit_kode: string;
  satker_unit_nama: string;
  satker_unit_direktorat: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type PpkCode = {
  id: number;
  ppk_kode: string;
  ppk_nomenklatur: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type Perusahaan = {
  id: number;
  perusahaan_nama: string;
  perusahaan_pimpinan_nama: string;
  perusahaan_contact: string;
  perusahaan_alamat: string;
  perusahaan_kbli: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type StagePreparation = {
  id: number;
  dpp_diterima_tgl: string;
  agenda_no: string;
  ulp_satker_unit_pengendali_id: number;
  ulp_satker_unit_enduser_id: number;
  surat_enduser_no: string;
  surat_enduser_tgl: string;
  surat_enduser_hal: string;
  ulp_ppk_code_id: number;
  surat_ppk_no: string;
  dpp_tgl: string;
  surat_ppk_hal: string;
  paket_pbj_nama: string;
  anggaran_pagu_nonaktif: number;
  anggaran_pagu_aktif: number;
  ulp_mak_code_id: number;
  kelompok_belanja_modal: number;
  kelompok_belanja_operasional: number;
  keterangan_tambahan: "Kaji Ulang PPK" | "Sedang Berproses" | "Selesai Dilaporkan";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type StageProcess = {
  id: number;
  ulp_stage_preparation_id: number;
  is_rup: boolean;
  is_eproc: boolean;
  is_manual: boolean;
  rup_kode: string;
  metode_pemilihan:
    | "E-Pengadaan Langsung"
    | "E-Penunjukan Langsung"
    | "E-Purchasing"
    | "E-Tender"
    | "Pengadaan Langsung"
    | "Penunjukan Langsung"
    | "Tender";
  kriteria_barangjasa: "Barang" | "Jasa Lainnya" | "Pekerjaan Konstruksi";
  lembar_catatan_pengecekan_hps_tgl: string;
  lembar_catatan_pengecekan_hps_pic: string;
  koreksi_aritmatika_tgl: string;
  koreksi_aritmatika_pic: string;
  lembar_persiapan_tgl: string;
  lembar_persiapan_pic_buat: string;
  lembar_persiapan_pic_pokja: string;
  pengumuman_pemilihan_lpse_no: string;
  pengumuman_pemilihan_lpse_tgl: string;
  pengumuman_pemilihan_lpse_pic: string;
  dokumen_pemilihan_spph_no: string;
  dokumen_pemilihan_spph_tgl: string;
  dokumen_pemilihan_spph_pic: string;
  registrasi_draft_paket_pbj_spse_tgl: string;
  registrasi_draft_paket_pbj_spse_pic: string;
  undangan_reviu_dpp_no: string;
  undangan_reviu_dpp_tgl: string;
  undangan_reviu_dpp_pic: string;
  lembar_daftar_hadir_reviu_dpp_tgl: string;
  lembar_daftar_hadir_reviu_dpp_pic: string;
  ba_reviu_dpp_no: string;
  ba_reviu_dpp_tgl: string;
  ba_reviu_dpp_pic: string;
  undangan_pemberian_penjelasan_no: string;
  undangan_pemberian_penjelasan_tgl: string;
  undangan_pemberian_penjelasan_pic: string;
  lembar_daftar_hadir_pemberian_penjelasan_tgl: string;
  lembar_daftar_hadir_pemberian_penjelasan_pic: string;
  ba_pemberian_penjelasan_no: string;
  ba_pemberian_penjelasan_tgl: string;
  ba_pemberian_penjelasan_pic: string;
  dekripsi_data_penawaran_tgl: string;
  dekripsi_data_penawaran_pic: string;
  ba_pembukaan_dokumen_penawaran_no: string;
  ba_pembukaan_dokumen_penawaran_tgl: string;
  ba_pembukaan_dokumen_penawaran_pic: string;
  lembar_koreksi_aritmatika_penawaran_harga_tgl: string;
  lembar_koreksi_aritmatika_penawaran_harga_pic: string;
  kertas_kerja_evaluasi_penawaran_tgl: string;
  kertas_kerja_evaluasi_penawaran_pic: string;
  ba_evaluasi_penawaran_no: string;
  ba_evaluasi_penawaran_tgl: string;
  ba_evaluasi_penawaran_pic: string;
  undangan_verifikasi_pembuktian_kualifikasi_no: string;
  undangan_verifikasi_pembuktian_kualifikasi_tgl: string;
  undangan_verifikasi_pembuktian_kualifikasi_pic: string;
  lembar_daftar_hadir_verifikasi_pembuktian_kualifikasi_tgl: string;
  lembar_daftar_hadir_verifikasi_pembuktian_kualifikasi_pic: string;
  lembar_nego_teknis_harga_tgl: string;
  lembar_nego_teknis_harga_pic: string;
  ba_klarifikasi_negosiasi_harga_no: string;
  ba_klarifikasi_negosiasi_harga_tgl: string;
  ba_klarifikasi_negosiasi_harga_pic: string;
  ba_hasil_pemilihan_no: string;
  ba_hasil_pemilihan_tgl: string;
  ba_hasil_pemilihan_pic: string;
  penetapan_pemenang_pemilihan_no: string;
  penetapan_pemenang_pemilihan_tgl: string;
  penetapan_pemenang_pemilihan_pic: string;
  pengumuman_pemenang_pemilihan_no: string;
  pengumuman_pemenang_pemilihan_tgl: string;
  pengumuman_pemenang_pemilihan_pic: string;
  sanggahan_no: string;
  sanggahan_tgl: string;
  sanggahan_nama_peserta: string;
  jawaban_sanggah_no: string;
  jawaban_sanggah_tgl: string;
  jawaban_sanggah_pic: string;
  surat_usulan_kaji_ulang_paket_no: string;
  surat_usulan_kaji_ulang_paket_tgl: string;
  surat_usulan_kaji_ulang_paket_pic: string;
  laporan_hasil_pemilihan_no: string;
  laporan_hasil_pemilihan_tgl: string;
  laporan_hasil_pemilihan_pic: string;
  nilai_realisasi: number;
  dokumen_spb_spk_kontrak_pic: string;
  dokumen_spb_spk_kontrak_no: string;
  dokumen_spb_spk_kontrak_tgl: string;
  nilai_kontrak_blu: number;
  nilai_kontrak_non_blu: number;
  jangka_waktu_pekerjaan: number;
  jangka_waktu_pekerjaan_satuan: string;
  ulp_perusahaan_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

const CSV_DIR = path.join(process.cwd(), "csv");

function readCsv(file: string): string[][] {
  const p = path.join(CSV_DIR, file);
  const raw = fs.readFileSync(p, "utf-8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: string[][] = [];

  for (const line of lines) {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    rows.push(out.map((s) => s.trim()));
  }
  return rows;
}

function toNumber(s: string): number {
  if (!s) return 0;
  const cleaned = s
    .replace(/Rp/gi, "")
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

const months: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
} as const;

function parseDdMonYy(s: string): string {
  if (!s) return "";
  const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
  if (!m) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }
  const day = Number(m[1]);
  const mon = months[m[2]] ?? -1;
  const yy = Number(m[3]);
  const year = 2000 + yy;
  if (mon < 0) return "";
  const d = new Date(Date.UTC(year, mon, day));
  return d.toISOString().slice(0, 10);
}

function normKet(s: string): StagePreparation["keterangan_tambahan"] {
  const t = (s || "").toLowerCase();
  if (t.includes("kaji")) return "Kaji Ulang PPK";
  if (t.includes("selesai")) return "Selesai Dilaporkan";
  return "Sedang Berproses";
}

export async function GET() {
  try {
    const now = new Date().toISOString();

    const makRows = readCsv("ULP - Kodefikasi MAK.csv");
    const makHeader = makRows[0];
    const makData = makRows.slice(1);
    const mak: MakCode[] = makData.map((r, i) => {
      const get = (h: string) => r[makHeader.indexOf(h)] || "";
      return {
        id: i + 1,
        mak_kategori: (get("Kategori") as MakKategori) || "Belanja Operasional",
        mak_kode: get("Kode"),
        mak_induk: get("Uraian Mata Anggaran Kegiatan (MAK) Induk"),
        mak_rinci: get("Uraian Mata Anggaran Kegiatan (MAK) Rinci"),
        mak_no: get("No Mata Anggaran Kegiatan (MAK)"),
        mak_keterangan: get("Keterangan"),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    });

    const satkerRows = readCsv("ULP - List Satker.csv");
    const satkerHeader = satkerRows[0];
    const satkerData = satkerRows.slice(1);
    const satker: SatkerUnit[] = satkerData.map((r, i) => {
      const get = (h: string) => r[satkerHeader.indexOf(h)] || "";
      return {
        id: i + 1,
        satker_unit_pengendali_kode: get("Kode Unit Kerja Pengendali"),
        satker_unit_kode: get("Kode Unit Kerja"),
        satker_unit_nama: get("Unit Kerja"),
        satker_unit_direktorat: get("Direktorat"),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    });

    const ppkRows = readCsv("ULP - List PPK.csv");
    const ppkHeader = ppkRows[0];
    const ppkData = ppkRows.slice(1);
    const ppk: PpkCode[] = ppkData.map((r, i) => {
      const get = (h: string) => r[ppkHeader.indexOf(h)] || "";
      return {
        id: i + 1,
        ppk_kode: get("Kode"),
        ppk_nomenklatur: get("Nomenklatur PPK"),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    });

    const findSatkerIdByCode = (code: string): number => {
      if (!code) return 0;
      const byPengendali = satker.find(
        (s) => s.satker_unit_pengendali_kode.toLowerCase() === code.toLowerCase()
      );
      if (byPengendali) return byPengendali.id;
      const byKode = satker.find(
        (s) => s.satker_unit_kode.toLowerCase() === code.toLowerCase()
      );
      return byKode ? byKode.id : 0;
    };

    const findPpkId = (kode: string): number => {
      const rec = ppk.find((x) => x.ppk_kode.toLowerCase() === (kode || "").toLowerCase());
      return rec ? rec.id : 0;
    };
    const findMakId = (kode: string): number => {
      const rec = mak.find((x) => x.mak_kode.toLowerCase() === (kode || "").toLowerCase());
      return rec ? rec.id : 0;
    };

    const prepRows = readCsv("ULP - Persiapan Pemilihan.csv");
    const prepHeader = prepRows[0];
    const prepData = prepRows.slice(1);
    const persiapan: StagePreparation[] = prepData
      .filter((r) => r.some((v) => v && v.trim()))
      .map((r) => {
        const get = (h: string) => r[prepHeader.indexOf(h)] || "";
        const idStr = get("Id");
        const id = idStr ? Number(idStr) : 0;
        return {
          id,
          dpp_diterima_tgl: parseDdMonYy(get("Tanggal Diterima DPP")),
          agenda_no: get("No. Agenda"),
          ulp_satker_unit_pengendali_id: findSatkerIdByCode(get("Kode unit kerja pengendali")),
          ulp_satker_unit_enduser_id: findSatkerIdByCode(get("Kode End User")),
          surat_enduser_no: get("Nomor Surat End User"),
          surat_enduser_tgl: parseDdMonYy(get("Tanggal Surat End User")),
          surat_enduser_hal: get("Hal"),
          ulp_ppk_code_id: findPpkId(get("Kode PPK")),
          surat_ppk_no: get("Nomor Surat PPK"),
          dpp_tgl: parseDdMonYy(get("Tanggal DPP")),
          surat_ppk_hal: get("Hal PPK"),
          paket_pbj_nama: get("Nama Paket PBJ"),
          anggaran_pagu_nonaktif: toNumber(get("Pagu Anggaran (Non Aktif)")),
          anggaran_pagu_aktif: toNumber(get("Pagu Anggaran (Aktif)")),
          ulp_mak_code_id: findMakId(get("Kode MAK")),
          kelompok_belanja_modal: toNumber(get("Kelompok Belanja Modal")),
          kelompok_belanja_operasional: toNumber(get("Kelompok Belanja Operasional")),
          keterangan_tambahan: normKet(get("Keterangan Tambahan (Apabila Ada)")),
          created_at: now,
          updated_at: now,
          deleted_at: null,
        };
      })
      .filter((x) => x.id > 0);

    const prosesRows = readCsv("ULP - Proses Pemilihan.csv");
    const prosesHeader = prosesRows[0];
    const prosesData = prosesRows.slice(1);

    const normHeader = (s: string) =>
      (s || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\s+\)/g, ")")
        .replace(/\(\s+/g, "(")
        .trim();
    const headerMap = new Map<string, number>();
    prosesHeader.forEach((h, i) => headerMap.set(normHeader(h), i));

    const perusahaanByKey = new Map<string, Perusahaan>();
    let perusahaanNextId = 1;

    const upsertPerusahaan = (args: {
      perusahaan_nama: string;
      perusahaan_pimpinan_nama: string;
      perusahaan_contact: string;
      perusahaan_alamat: string;
      perusahaan_kbli: string;
    }): number => {
      const key = `${(args.perusahaan_nama || "").trim().toLowerCase()}|${(args.perusahaan_alamat || "")
        .trim()
        .toLowerCase()}`;
      if (!key || key === "|") return 0;
      const existing = perusahaanByKey.get(key);
      if (existing) return existing.id;
      const rec: Perusahaan = {
        id: perusahaanNextId++,
        perusahaan_nama: args.perusahaan_nama || "",
        perusahaan_pimpinan_nama: args.perusahaan_pimpinan_nama || "",
        perusahaan_contact: args.perusahaan_contact || "",
        perusahaan_alamat: args.perusahaan_alamat || "",
        perusahaan_kbli: args.perusahaan_kbli || "",
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
      perusahaanByKey.set(key, rec);
      return rec.id;
    };

    const proses: StageProcess[] = prosesData
      .filter((r) => r.some((v) => v && v.trim()))
      .map((r, idx) => {
        const get = (h: string) => r[headerMap.get(normHeader(h)) ?? -1] || "";
        const bool = (s: string) =>
          s === "1" || /^y(es)?$/i.test(s) || /^true$/i.test(s);
        const perusahaanId = upsertPerusahaan({
          perusahaan_nama: get("Nama Penyedia Barang/Jasa"),
          perusahaan_pimpinan_nama: get("Nama Pimpinan Perusahaan"),
          perusahaan_contact: get("Contact Person"),
          perusahaan_alamat: get("Alamat Perusahaan"),
          perusahaan_kbli: get("KBLI Penyedia"),
        });

        const prepId = Number(get("ulp_stage_preparation_id") || "0");
        return {
          id: idx + 1,
          ulp_stage_preparation_id: prepId,
          is_rup: bool(get("RUP")),
          is_eproc: bool(get("e-Proc")),
          is_manual: bool(get("Manual")),
          rup_kode: get("Kode RUP"),
          metode_pemilihan: (get("Metode Pemilihan") ||
            "Pengadaan Langsung") as StageProcess["metode_pemilihan"],
          kriteria_barangjasa: (get("Kriteria Barang/Jasa") ||
            "Barang") as StageProcess["kriteria_barangjasa"],
          lembar_catatan_pengecekan_hps_tgl: parseDdMonYy(get("Lembar catatan Pengecekan HPS  (Tgl)")),
          lembar_catatan_pengecekan_hps_pic: get("Lembar catatan Pengecekan HPS  (PIC)"),
          koreksi_aritmatika_tgl: parseDdMonYy(get("Koreksi Aritmatika HPS (Tgl)")),
          koreksi_aritmatika_pic: get("Koreksi Aritmatika HPS (PIC)"),
          lembar_persiapan_tgl: parseDdMonYy(get("Lembar Persiapan Tgl")),
          lembar_persiapan_pic_buat: get("Lembar Persiapan PIC Buat"),
          lembar_persiapan_pic_pokja: get("Lembar Persiapan PIC Ka. Pokja"),
          pengumuman_pemilihan_lpse_no: get(
            "Pengumuman Pemilihan by LPSE (Nomor Lembar Pengumuman)"
          ),
          pengumuman_pemilihan_lpse_tgl: parseDdMonYy(get("Pengumuman Pemilihan by LPSE (Tgl)")),
          pengumuman_pemilihan_lpse_pic: get("Pengumuman Pemilihan by LPSE (PIC)"),
          dokumen_pemilihan_spph_no: get(
            "Dokumen Pemilihan / SPPH Dokumen Pengadaan / SPPH(No. Dok)"
          ),
          dokumen_pemilihan_spph_tgl: parseDdMonYy(
            get("Dokumen Pemilihan / SPPH Dokumen Pengadaan / SPPH(Tgl)")
          ),
          dokumen_pemilihan_spph_pic: get(
            "Dokumen Pemilihan / SPPH Dokumen Pengadaan / SPPH(PIC)"
          ),
          registrasi_draft_paket_pbj_spse_tgl: parseDdMonYy(
            get("Registrasi Draft Paket PBJ by SPSE (Buat Paket) Tgl")
          ),
          registrasi_draft_paket_pbj_spse_pic: get(
            "Registrasi Draft Paket PBJ by SPSE (Buat Paket) PIC"
          ),
          undangan_reviu_dpp_no: get("Undangan Reviu DPP(No. Dok)"),
          undangan_reviu_dpp_tgl: parseDdMonYy(get("Undangan Reviu DPP(Tgl)")),
          undangan_reviu_dpp_pic: get("Undangan Reviu DPP(PIC)"),
          lembar_daftar_hadir_reviu_dpp_tgl: parseDdMonYy(
            get("Lembar Daftar Hadir Acara Reviu DPP (Tgl)")
          ),
          lembar_daftar_hadir_reviu_dpp_pic: get("Lembar Daftar Hadir Acara Reviu DPP (PIC)"),
          ba_reviu_dpp_no: get("BA Reviu DPP (No. Dok)"),
          ba_reviu_dpp_tgl: parseDdMonYy(get("BA Reviu DPP (Tgl)")),
          ba_reviu_dpp_pic: get("BA Reviu DPP (PIC)"),
          undangan_pemberian_penjelasan_no: get("Undangan Pemberian Penjelasan(No. Dok)"),
          undangan_pemberian_penjelasan_tgl: parseDdMonYy(
            get("Undangan Pemberian Penjelasan(Tgl)")
          ),
          undangan_pemberian_penjelasan_pic: get("Undangan Pemberian Penjelasan(PIC)"),
          lembar_daftar_hadir_pemberian_penjelasan_tgl: parseDdMonYy(
            get("Lembar Daftar Hadir Pemberian Penjelasan(Tgl)")
          ),
          lembar_daftar_hadir_pemberian_penjelasan_pic: get(
            "Lembar Daftar Hadir Pemberian Penjelasan(PIC)"
          ),
          ba_pemberian_penjelasan_no: get("BA Pemberian Penjelasan(No. Dok)"),
          ba_pemberian_penjelasan_tgl: parseDdMonYy(get("BA Pemberian Penjelasan(Tgl)")),
          ba_pemberian_penjelasan_pic: get("BA Pemberian Penjelasan(PIC)"),
          dekripsi_data_penawaran_tgl: parseDdMonYy(get("Dekripsi Data Penawaran(Tgl)")),
          dekripsi_data_penawaran_pic: get("Dekripsi Data Penawaran(PIC)"),
          ba_pembukaan_dokumen_penawaran_no: get(
            "BA Pembukaan Dokumen Penawaran(No. Dok)"
          ),
          ba_pembukaan_dokumen_penawaran_tgl: parseDdMonYy(
            get("BA Pembukaan Dokumen Penawaran(Tgl)")
          ),
          ba_pembukaan_dokumen_penawaran_pic: get("BA Pembukaan Dokumen Penawaran(PIC)"),
          lembar_koreksi_aritmatika_penawaran_harga_tgl: parseDdMonYy(
            get("Lembar Koreksi Aritmatika Penawaran Harga(Tgl)")
          ),
          lembar_koreksi_aritmatika_penawaran_harga_pic: get(
            "Lembar Koreksi Aritmatika Penawaran Harga(PIC )"
          ),
          kertas_kerja_evaluasi_penawaran_tgl: parseDdMonYy(
            get("Kertas Kerja Evaluasi Penawaran (Tgl)")
          ),
          kertas_kerja_evaluasi_penawaran_pic: get("Kertas Kerja Evaluasi Penawaran (PIC)"),
          ba_evaluasi_penawaran_no: get("BA Evaluasi Penawaran (No. Dok)"),
          ba_evaluasi_penawaran_tgl: parseDdMonYy(get("BA Evaluasi Penawaran (Tgl)")),
          ba_evaluasi_penawaran_pic: get("BA Evaluasi Penawaran (PIC )"),
          undangan_verifikasi_pembuktian_kualifikasi_no: get(
            "Undangan Verifikasi & Pembuktian Kualifikasi(No. Dok)"
          ),
          undangan_verifikasi_pembuktian_kualifikasi_tgl: parseDdMonYy(
            get("Undangan Verifikasi & Pembuktian Kualifikasi(Tgl)")
          ),
          undangan_verifikasi_pembuktian_kualifikasi_pic: get(
            "Undangan Verifikasi & Pembuktian Kualifikasi(PIC )"
          ),
          lembar_daftar_hadir_verifikasi_pembuktian_kualifikasi_tgl: parseDdMonYy(
            get("Lembar Daftar Hadir Verifikasi & Pembuktian Kualifikasi(Tgl)")
          ),
          lembar_daftar_hadir_verifikasi_pembuktian_kualifikasi_pic: get(
            "Lembar Daftar Hadir Verifikasi & Pembuktian Kualifikasi(PIC )"
          ),
          lembar_nego_teknis_harga_tgl: parseDdMonYy(
            get("Lembar Nego Teknis dan Harga (Jika Ada)(Tgl)")
          ),
          lembar_nego_teknis_harga_pic: get("Lembar Nego Teknis dan Harga (Jika Ada)(PIC )"),
          ba_klarifikasi_negosiasi_harga_no: get("BA Klarifikasi dan Negosiasi Harga(No. Dok)"),
          ba_klarifikasi_negosiasi_harga_tgl: parseDdMonYy(
            get("BA Klarifikasi dan Negosiasi Harga(Tgl)")
          ),
          ba_klarifikasi_negosiasi_harga_pic: get("BA Klarifikasi dan Negosiasi Harga(PIC )"),
          ba_hasil_pemilihan_no: get("BA Hasil Pemilihan (No. Dok)"),
          ba_hasil_pemilihan_tgl: parseDdMonYy(get("BA Hasil Pemilihan (Tgl)")),
          ba_hasil_pemilihan_pic: get("BA Hasil Pemilihan (PIC )"),
          penetapan_pemenang_pemilihan_no: get("Penetapan Pemenang Pemilihan  (No. Dok)"),
          penetapan_pemenang_pemilihan_tgl: parseDdMonYy(
            get("Penetapan Pemenang Pemilihan  (Tgl)")
          ),
          penetapan_pemenang_pemilihan_pic: get("Penetapan Pemenang Pemilihan  (PIC )"),
          pengumuman_pemenang_pemilihan_no: get("Pengumuman Pemenang Pemilihan  (No. Dok)"),
          pengumuman_pemenang_pemilihan_tgl: parseDdMonYy(
            get("Pengumuman Pemenang Pemilihan  (Tgl)")
          ),
          pengumuman_pemenang_pemilihan_pic: get("Pengumuman Pemenang Pemilihan  (PIC )"),
          sanggahan_no: get("Sanggahan(No. Dok)"),
          sanggahan_tgl: parseDdMonYy(get("Sanggahan(Tgl Sanggah)")),
          sanggahan_nama_peserta: get("Sanggahan(Nama Peserta)"),
          jawaban_sanggah_no: get("Jawaban Sanggah (Jika Ada) (No. Dok)"),
          jawaban_sanggah_tgl: parseDdMonYy(get("Jawaban Sanggah (Jika Ada) (Tgl Dok)")),
          jawaban_sanggah_pic: get("Jawaban Sanggah (Jika Ada) (PIC)"),
          surat_usulan_kaji_ulang_paket_no: get("Surat Usulan Kaji Ulang Paket (No. Dok)"),
          surat_usulan_kaji_ulang_paket_tgl: parseDdMonYy(
            get("Surat Usulan Kaji Ulang Paket (Tgl)")
          ),
          surat_usulan_kaji_ulang_paket_pic: get("Surat Usulan Kaji Ulang Paket (PIC)"),
          laporan_hasil_pemilihan_no: get("Laporan Hasil Pemilihan (No. Dok)"),
          laporan_hasil_pemilihan_tgl: parseDdMonYy(get("Laporan Hasil Pemilihan (Tgl)")),
          laporan_hasil_pemilihan_pic: get("Laporan Hasil Pemilihan (PIC )"),
          nilai_realisasi: toNumber(get("Nilai Realisasi")),
          dokumen_spb_spk_kontrak_pic: get("Dokumen SPB/SPK/Kontrak(PIC )"),
          dokumen_spb_spk_kontrak_no: get("Dokumen SPB/SPK/Kontrak(Nomor)"),
          dokumen_spb_spk_kontrak_tgl: parseDdMonYy(get("Dokumen SPB/SPK/Kontrak(Tanggal)")),
          nilai_kontrak_blu: toNumber(get("Nilai Kontrak(Rp.) (BLU)")),
          nilai_kontrak_non_blu: toNumber(get("Nilai Kontrak(Rp.) (Non BLU)")),
          jangka_waktu_pekerjaan: toNumber(get("Jangka Waktu Pekerjaan")),
          jangka_waktu_pekerjaan_satuan: get("Jangka Waktu Pekerjaan Satuan"),
          ulp_perusahaan_id: perusahaanId,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        };
      });

    return NextResponse.json({
      perusahaan: Array.from(perusahaanByKey.values()).sort((a, b) => a.id - b.id),
      mak,
      satker,
      ppk,
      persiapan,
      proses,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load master data" }, { status: 500 });
  }
}
