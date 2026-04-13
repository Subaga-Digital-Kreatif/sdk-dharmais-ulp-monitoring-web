import type { LucideIcon } from "lucide-react";

export type MenuId = "perusahaan" | "mak" | "satker" | "ppk" | "persiapan" | "proses";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date";
  textarea?: boolean;
  select?: { value: string; label: string }[];
  readonly?: boolean;
};

export type Perusahaan = {
  id?: number;
  perusahaan_nama: string;
  perusahaan_pimpinan_nama: string;
  perusahaan_contact: string;
  perusahaan_alamat: string;
  perusahaan_kbli: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type MakKategori = "Belanja Modal" | "Belanja Operasional";
export type MakCode = {
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

export type SatkerUnit = {
  id: number;
  satker_unit_pengendali_kode: string;
  satker_unit_kode: string;
  satker_unit_nama: string;
  satker_unit_direktorat: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type PpkCode = {
  id: number;
  ppk_kode: string;
  ppk_nomenklatur: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type StagePreparation = {
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

export type StageProcess = {
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
