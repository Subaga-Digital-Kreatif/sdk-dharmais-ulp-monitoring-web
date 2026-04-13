import { ListChecks } from "lucide-react";
import { toFlat } from "./utils";
import type { PpkCode, SectionDef } from "./section-types";

export const ppkSection: SectionDef<PpkCode, "ppk"> = {
  id: "ppk",
  label: "PPK",
  icon: ListChecks,
  columns: ["ID", "Kode", "Nomenklatur"],
  pick: (x) => x.ppk_nomenklatur,
  toRow: (x) => [String(x.id), x.ppk_kode, x.ppk_nomenklatur],
  filters: [
    { name: "ppk_kode", label: "Kode" },
    { name: "ppk_nomenklatur", label: "Nomenklatur" },
  ],
  fields: [
    { name: "ppk_kode", label: "Kode" },
    { name: "ppk_nomenklatur", label: "Nomenklatur" },
  ],
  initial: (item) => toFlat(item),
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id)) + 1,
    ppk_kode: formData.ppk_kode || "",
    ppk_nomenklatur: formData.ppk_nomenklatur || "",
    created_at: prev?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }),
};
