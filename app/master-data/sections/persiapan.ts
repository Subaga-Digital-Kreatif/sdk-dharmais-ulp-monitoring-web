import { FileText } from "lucide-react";

import type { SectionDef, StagePreparation } from "./section-types";

function fmtMoney(v: string | null | undefined): string {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function dateInput(v: string | null | undefined): string {
  if (!v) return "";
  return v.slice(0, 10);
}

export const persiapanSection: SectionDef<StagePreparation, "persiapan"> = {
  id: "persiapan",
  label: "Tahap Persiapan",
  icon: FileText,
  columns: ["ID", "No Agenda", "Tanggal DPP", "Paket", "Pagu Aktif", "Status"],
  pick: (x) =>
    [x.paketPbjNama, x.agendaNo, x.suratEnduserNo, x.suratPpkNo]
      .filter((s): s is string => Boolean(s && String(s).trim()))
      .join(" "),
  toRow: (x) => [
    String(x.id),
    x.agendaNo ?? "",
    dateInput(x.dppTgl),
    x.paketPbjNama ?? "",
    fmtMoney(x.anggaranPaguAktif),
    x.keteranganTambahan ?? "",
  ],
  filters: [
    {
      name: "keteranganTambahan",
      label: "Status",
      select: [
        { value: "Kaji Ulang PPK", label: "Kaji Ulang PPK" },
        { value: "Sedang Berproses", label: "Sedang Berproses" },
        { value: "Selesai Dilaporkan", label: "Selesai Dilaporkan" },
      ],
    },
    { name: "dppTgl", label: "Tanggal DPP", type: "date" },
    { name: "agendaNo", label: "No Agenda" },
    { name: "ulpPpkCodeId", label: "PPK (ID)", type: "number" },
    { name: "ulpMakCodeId", label: "MAK (ID)", type: "number" },
    {
      name: "ulpSatkerUnitPengendaliId",
      label: "Satker Pengendali (ID)",
      type: "number",
    },
  ],
  fields: [
    { name: "id", label: "ID", type: "number", readonly: true },
    { name: "dppDiterimaTgl", label: "Tanggal Diterima DPP", type: "date" },
    { name: "agendaNo", label: "No Agenda" },
    {
      name: "ulpSatkerUnitPengendaliId",
      label: "Satker Pengendali (ID)",
      type: "number",
    },
    {
      name: "ulpSatkerUnitEnduserId",
      label: "Satker End User (ID)",
      type: "number",
    },
    { name: "suratEnduserNo", label: "No Surat End User" },
    { name: "suratEnduserTgl", label: "Tanggal Surat End User", type: "date" },
    { name: "suratEnduserHal", label: "Hal Surat End User", textarea: true },
    { name: "ulpPpkCodeId", label: "PPK (ID)", type: "number" },
    { name: "suratPpkNo", label: "No Surat PPK" },
    { name: "dppTgl", label: "Tanggal DPP", type: "date" },
    { name: "suratPpkHal", label: "Hal Surat PPK", textarea: true },
    { name: "paketPbjNama", label: "Nama Paket PBJ", textarea: true },
    { name: "anggaranPaguNonaktif", label: "Pagu Non Aktif", type: "number" },
    { name: "anggaranPaguAktif", label: "Pagu Aktif", type: "number" },
    { name: "ulpMakCodeId", label: "MAK (ID)", type: "number" },
    {
      name: "kelompokBelanjaModal",
      label: "Kelompok Belanja Modal",
      type: "number",
    },
    {
      name: "kelompokBelanjaOperasional",
      label: "Kelompok Belanja Operasional",
      type: "number",
    },
    {
      name: "keteranganTambahan",
      label: "Status",
      select: [
        { value: "Kaji Ulang PPK", label: "Kaji Ulang PPK" },
        { value: "Sedang Berproses", label: "Sedang Berproses" },
        { value: "Selesai Dilaporkan", label: "Selesai Dilaporkan" },
      ],
      allowEmpty: false,
    },
    { name: "createdAt", label: "Created At", readonly: true },
    { name: "updatedAt", label: "Updated At", readonly: true },
    { name: "deletedAt", label: "Deleted At", readonly: true },
  ],
  initial: (item) => {
    const empty: Record<string, string> = {
      id: "",
      dppDiterimaTgl: "",
      agendaNo: "",
      ulpSatkerUnitPengendaliId: "",
      ulpSatkerUnitEnduserId: "",
      suratEnduserNo: "",
      suratEnduserTgl: "",
      suratEnduserHal: "",
      ulpPpkCodeId: "",
      suratPpkNo: "",
      dppTgl: "",
      suratPpkHal: "",
      paketPbjNama: "",
      anggaranPaguNonaktif: "",
      anggaranPaguAktif: "",
      ulpMakCodeId: "",
      kelompokBelanjaModal: "",
      kelompokBelanjaOperasional: "",
      keteranganTambahan: "Sedang Berproses",
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    };
    if (!item) return empty;
    return {
      id: String(item.id),
      dppDiterimaTgl: dateInput(item.dppDiterimaTgl),
      agendaNo: item.agendaNo ?? "",
      ulpSatkerUnitPengendaliId: String(item.ulpSatkerUnitPengendaliId ?? ""),
      ulpSatkerUnitEnduserId: String(item.ulpSatkerUnitEnduserId ?? ""),
      suratEnduserNo: item.suratEnduserNo ?? "",
      suratEnduserTgl: dateInput(item.suratEnduserTgl),
      suratEnduserHal: item.suratEnduserHal ?? "",
      ulpPpkCodeId: String(item.ulpPpkCodeId ?? ""),
      suratPpkNo: item.suratPpkNo ?? "",
      dppTgl: dateInput(item.dppTgl),
      suratPpkHal: item.suratPpkHal ?? "",
      paketPbjNama: item.paketPbjNama ?? "",
      anggaranPaguNonaktif: item.anggaranPaguNonaktif ?? "",
      anggaranPaguAktif: item.anggaranPaguAktif ?? "",
      ulpMakCodeId:
        item.ulpMakCodeId != null ? String(item.ulpMakCodeId) : "",
      kelompokBelanjaModal: item.kelompokBelanjaModal ?? "",
      kelompokBelanjaOperasional: item.kelompokBelanjaOperasional ?? "",
      keteranganTambahan: item.keteranganTambahan ?? "Sedang Berproses",
      createdAt: item.createdAt ?? "",
      updatedAt: item.updatedAt ?? "",
      deletedAt: item.deletedAt ?? "",
    };
  },
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id)) + 1,
    dppDiterimaTgl: formData.dppDiterimaTgl || null,
    agendaNo: formData.agendaNo || null,
    ulpSatkerUnitPengendaliId: Number(formData.ulpSatkerUnitPengendaliId || 0),
    ulpSatkerUnitEnduserId: Number(formData.ulpSatkerUnitEnduserId || 0),
    suratEnduserNo: formData.suratEnduserNo || null,
    suratEnduserTgl: formData.suratEnduserTgl || null,
    suratEnduserHal: formData.suratEnduserHal || null,
    ulpPpkCodeId: Number(formData.ulpPpkCodeId || 0),
    suratPpkNo: formData.suratPpkNo || null,
    dppTgl: formData.dppTgl || null,
    suratPpkHal: formData.suratPpkHal || null,
    paketPbjNama: formData.paketPbjNama || null,
    anggaranPaguNonaktif: formData.anggaranPaguNonaktif || null,
    anggaranPaguAktif: formData.anggaranPaguAktif || null,
    ulpMakCodeId: formData.ulpMakCodeId?.trim()
      ? Number(formData.ulpMakCodeId)
      : null,
    kelompokBelanjaModal: formData.kelompokBelanjaModal || null,
    kelompokBelanjaOperasional: formData.kelompokBelanjaOperasional || null,
    keteranganTambahan: formData.keteranganTambahan || "Sedang Berproses",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
