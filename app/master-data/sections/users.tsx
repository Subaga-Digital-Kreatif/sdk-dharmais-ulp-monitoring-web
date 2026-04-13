import { Users } from "lucide-react";

import type { Field, SectionDef } from "./section-types";

export const userSection: SectionDef<User, "users"> = {
  id: "users",
  label: "Pengguna",
  icon: Users,
  columns: ["Nama", "Email", "Inisial", "Diperbarui"],
  pick: (x) => `${x.fullName} ${x.email} ${x.initials}`,
  toRow: (x) => [
    x.fullName,
    x.email,
    x.initials,
    x.updatedAt ? x.updatedAt.slice(0, 10) : "—",
  ],
  filters: [{ name: "email", label: "Email" }],
  fields: [
    { name: "fullName", label: "Nama lengkap" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
  ],
  initial: (item) => {
    if (!item) return { fullName: "", email: "", password: "" };
    return {
      fullName: item.fullName ?? "",
      email: item.email ?? "",
    } as Record<string, string>;
  },
  build: ({ formData, prev }) => ({
    id: prev?.id ?? 0,
    fullName: formData.fullName || "",
    email: formData.email || "",
    initials: prev?.initials ?? "",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
};

export function userModalFields(editIndex: number): Field[] {
  if (editIndex >= 0) {
    return [
      { name: "fullName", label: "Nama lengkap" },
      { name: "email", label: "Email" },
    ];
  }
  return userSection.fields;
}
