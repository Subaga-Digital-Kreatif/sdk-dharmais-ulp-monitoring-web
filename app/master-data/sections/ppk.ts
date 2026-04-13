import { ListChecks } from "lucide-react";

import type { PpkCode, SectionDef } from "./section-types";

export const ppkSection: SectionDef<PpkCode, "ppk"> = {
  id: "ppk",
  label: "PPK",
  icon: ListChecks,
  columns: ["ID", "Kode", "Nomenklatur"],
  pick: (x) => [x.ppkKode, x.ppkNomenklatur].filter(Boolean).join(" "),
  toRow: (x) => [String(x.id), x.ppkKode, x.ppkNomenklatur],
  filters: [
    { name: "ppkKode", label: "Kode" },
    { name: "ppkNomenklatur", label: "Nomenklatur" },
  ],
  fields: [
    { name: "id", label: "ID", type: "number", readonly: true },
    { name: "ppkKode", label: "Kode" },
    { name: "ppkNomenklatur", label: "Nomenklatur" },
  ],
  initial: (item) => {
    const empty: Record<string, string> = {
      id: "",
      ppkKode: "",
      ppkNomenklatur: "",
    };
    if (!item) return empty;
    return {
      id: String(item.id),
      ppkKode: item.ppkKode ?? "",
      ppkNomenklatur: item.ppkNomenklatur ?? "",
    };
  },
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id), 0) + 1,
    ppkKode: formData.ppkKode || "",
    ppkNomenklatur: formData.ppkNomenklatur || "",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
