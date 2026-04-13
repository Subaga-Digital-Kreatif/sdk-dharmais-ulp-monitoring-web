"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Database,
  LineChart,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AUTH_USER_STORAGE_KEY } from "@/models/auth";
import { apiToken } from "@/models/api";
import { makCode } from "@/models/mak-code";
import { satkerUnitCode } from "@/models/satker-unit-code";
import { stagePreparation } from "@/models/stage-preparation";
import { formDataToStageProcessPayload, stageProcess } from "@/models/stage-process";
import { ulpPerusahaanCode } from "@/models/ulp-perusahaan-code";
import { ulpPpkCode } from "@/models/ulp-ppk-code";
import { cn } from "@/lib/utils";
import { user } from "@/models/user";
import { sections, sectionsById, type Field, type MakCode, type MenuId, type Perusahaan, type PpkCode, type SatkerUnit, type StagePreparation, type StageProcess } from "./sections";
import { userModalFields } from "./sections/users";
export default function MasterDataPage() {
  const router = useRouter();
  const [active, setActive] = useState<MenuId>("perusahaan");
  const [companies, setCompanies] = useState<Perusahaan[]>([]);
  const [makCodes, setMakCodes] = useState<MakCode[]>([]);
  const [satkers, setSatkers] = useState<SatkerUnit[]>([]);
  const [ppkCodes, setPpkCodes] = useState<PpkCode[]>([]);
  const [preps, setPreps] = useState<StagePreparation[]>([]);
  const [procs, setProcs] = useState<StageProcess[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [tableFilters, setTableFilters] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const ok =
        localStorage.getItem("ulp_auth_demo") === "1" ||
        sessionStorage.getItem("ulp_auth_demo") === "1";
      setIsAuthed(ok);
    } catch {
      setIsAuthed(false);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady || isAuthed) return;
    router.replace("/login");
  }, [authReady, isAuthed, router]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "perusahaan") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await ulpPerusahaanCode.getAll();
        if (!cancelled) setCompanies(res.data);
      } catch {
        if (!cancelled) setCompanies([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "ppk") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await ulpPpkCode.getAll();
        if (!cancelled) setPpkCodes(res.data);
      } catch {
        if (!cancelled) setPpkCodes([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "users") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await user.getAll();
        if (!cancelled) setUsersList(res.data);
      } catch {
        if (!cancelled) setUsersList([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "mak") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await makCode.getAll();
        if (!cancelled) setMakCodes(res.data);
      } catch {
        if (!cancelled) setMakCodes([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "satker") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await satkerUnitCode.getAll();
        if (!cancelled) setSatkers(res.data);
      } catch {
        if (!cancelled) setSatkers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "persiapan") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await stagePreparation.getAll();
        if (!cancelled) setPreps(res.data);
      } catch {
        if (!cancelled) setPreps([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  useEffect(() => {
    if (!authReady || !isAuthed || active !== "proses") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await stageProcess.getAll();
        if (!cancelled) setProcs(res.data);
      } catch {
        if (!cancelled) setProcs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthed, active]);

  const handleLogout = () => {
    try {
      apiToken.delete();
      localStorage.removeItem("ulp_auth_demo");
      sessionStorage.removeItem("ulp_auth_demo");
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {
    }
    router.push("/login");
  };

  const menu = sections;

  function resetModal() {
    setShowModal(false);
    setEditIndex(-1);
  }

  function setActiveMenu(id: MenuId) {
    setActive(id);
    setSearch("");
    setTableFilters({});
    setPage(1);
  }

  function openAdd() {
    setEditIndex(-1);
    setShowModal(true);
  }

  function openEdit(i: number) {
    setEditIndex(i);
    setShowModal(true);
  }

  function saveCurrent(formData: Record<string, string>) {
    if (active === "perusahaan") {
      const prev = editIndex >= 0 ? companies[editIndex] : undefined;
      void (async () => {
        try {
          const payload = {
            perusahaanNama: formData.perusahaanNama?.trim() || "",
            perusahaanPimpinanNama:
              formData.perusahaanPimpinanNama?.trim() || "",
            perusahaanContact: formData.perusahaanContact?.trim() || "",
            perusahaanAlamat: formData.perusahaanAlamat?.trim() || "",
            perusahaanKbli: formData.perusahaanKbli?.trim() || "",
          };
          if (editIndex >= 0 && prev) {
            const updated = await ulpPerusahaanCode.update(prev.id, payload);
            setCompanies((list) => {
              const arr = [...list];
              const idx = arr.findIndex((c) => c.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await ulpPerusahaanCode.create(payload);
            setCompanies((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "mak") {
      const prev = editIndex >= 0 ? makCodes[editIndex] : undefined;
      void (async () => {
        try {
          const payload = {
            makKategori: formData.makKategori?.trim() || "",
            makKode: formData.makKode?.trim() || "",
            makInduk: formData.makInduk?.trim() || "",
            makRinci: formData.makRinci?.trim() || "",
            makNo: formData.makNo?.trim() || "",
            makKeterangan: formData.makKeterangan?.trim() || "",
          };
          if (editIndex >= 0 && prev) {
            const updated = await makCode.update(prev.id, payload);
            setMakCodes((list) => {
              const arr = [...list];
              const idx = arr.findIndex((m) => m.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await makCode.create(payload);
            setMakCodes((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "satker") {
      const prev = editIndex >= 0 ? satkers[editIndex] : undefined;
      void (async () => {
        try {
          const payload = {
            satkerUnitPengendaliKode:
              formData.satkerUnitPengendaliKode?.trim() || "",
            satkerUnitKode: formData.satkerUnitKode?.trim() || "",
            satkerUnitNama: formData.satkerUnitNama?.trim() || "",
            satkerUnitDirektorat: formData.satkerUnitDirektorat?.trim() || "",
          };
          if (editIndex >= 0 && prev) {
            const updated = await satkerUnitCode.update(prev.id, payload);
            setSatkers((list) => {
              const arr = [...list];
              const idx = arr.findIndex((s) => s.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await satkerUnitCode.create(payload);
            setSatkers((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "ppk") {
      const prev = editIndex >= 0 ? ppkCodes[editIndex] : undefined;
      void (async () => {
        try {
          const payload = {
            ppkKode: formData.ppkKode?.trim() || "",
            ppkNomenklatur: formData.ppkNomenklatur?.trim() || "",
          };
          if (editIndex >= 0 && prev) {
            const updated = await ulpPpkCode.update(prev.id, payload);
            setPpkCodes((list) => {
              const arr = [...list];
              const idx = arr.findIndex((p) => p.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await ulpPpkCode.create(payload);
            setPpkCodes((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "persiapan") {
      const prev = editIndex >= 0 ? preps[editIndex] : undefined;
      void (async () => {
        try {
          const trimUndef = (s: string | undefined) => {
            const t = s?.trim();
            return t ? t : undefined;
          };
          const decStr = (s: string | undefined) => {
            const t = s?.trim();
            return t !== undefined && t !== "" ? t : "0.00";
          };
          const optId = (s: string | undefined): number | null => {
            const t = s?.trim();
            if (!t) return null;
            const n = Number(t);
            return Number.isFinite(n) ? n : null;
          };
          const payload: CreateStagePreparationRequest = {
            dppDiterimaTgl: trimUndef(formData.dppDiterimaTgl),
            agendaNo: trimUndef(formData.agendaNo),
            ulpSatkerUnitPengendaliId: Number(
              formData.ulpSatkerUnitPengendaliId || 0,
            ),
            ulpSatkerUnitEnduserId: Number(
              formData.ulpSatkerUnitEnduserId || 0,
            ),
            suratEnduserNo: trimUndef(formData.suratEnduserNo),
            suratEnduserTgl: trimUndef(formData.suratEnduserTgl),
            suratEnduserHal: trimUndef(formData.suratEnduserHal),
            ulpPpkCodeId: Number(formData.ulpPpkCodeId || 0),
            suratPpkNo: trimUndef(formData.suratPpkNo),
            dppTgl: trimUndef(formData.dppTgl),
            suratPpkHal: trimUndef(formData.suratPpkHal),
            paketPbjNama: trimUndef(formData.paketPbjNama),
            anggaranPaguNonaktif: decStr(formData.anggaranPaguNonaktif),
            anggaranPaguAktif: decStr(formData.anggaranPaguAktif),
            ulpMakCodeId: optId(formData.ulpMakCodeId),
            kelompokBelanjaModal: decStr(formData.kelompokBelanjaModal),
            kelompokBelanjaOperasional: decStr(
              formData.kelompokBelanjaOperasional,
            ),
            keteranganTambahan:
              trimUndef(formData.keteranganTambahan) ?? "Sedang Berproses",
          };
          if (editIndex >= 0 && prev) {
            const updated = await stagePreparation.update(prev.id, payload);
            setPreps((list) => {
              const arr = [...list];
              const idx = arr.findIndex((p) => p.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await stagePreparation.create(payload);
            setPreps((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "proses") {
      const prev = editIndex >= 0 ? procs[editIndex] : undefined;
      void (async () => {
        try {
          const payload = formDataToStageProcessPayload(formData);
          if (editIndex >= 0 && prev) {
            const updated = await stageProcess.update(prev.id, payload);
            setProcs((list) => {
              const arr = [...list];
              const idx = arr.findIndex((p) => p.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await stageProcess.create(payload);
            setProcs((list) => [created, ...list]);
          }
        } catch {
          return;
        }
        resetModal();
      })();
      return;
    } else if (active === "users") {
      const prev = editIndex >= 0 ? usersList[editIndex] : undefined;
      void (async () => {
        try {
          if (editIndex >= 0 && prev) {
            const updated = await user.update(prev.id, {
              fullName: formData.fullName?.trim() || "",
              email: formData.email?.trim() || "",
            });
            setUsersList((list) => {
              const arr = [...list];
              const idx = arr.findIndex((u) => u.id === prev.id);
              if (idx >= 0) arr[idx] = updated;
              return arr;
            });
          } else {
            const created = await user.create({
              fullName: formData.fullName?.trim() || "",
              email: formData.email?.trim() || "",
              password: formData.password || "",
            });
            setUsersList((list) => [created, ...list]);
          }
        } catch {
          // API error — biarkan modal tetap terbuka agar user bisa perbaiki
          return;
        }
        resetModal();
      })();
      return;
    }
    resetModal();
  }

  function removeRow(i: number) {
    if (active === "perusahaan") {
      const row = companies[i];
      if (!row) return;
      void (async () => {
        try {
          await ulpPerusahaanCode.delete(row.id);
          setCompanies((list) => list.filter((c) => c.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "mak") {
      const row = makCodes[i];
      if (!row) return;
      void (async () => {
        try {
          await makCode.delete(row.id);
          setMakCodes((list) => list.filter((m) => m.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "satker") {
      const row = satkers[i];
      if (!row) return;
      void (async () => {
        try {
          await satkerUnitCode.delete(row.id);
          setSatkers((list) => list.filter((s) => s.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "ppk") {
      const row = ppkCodes[i];
      if (!row) return;
      void (async () => {
        try {
          await ulpPpkCode.delete(row.id);
          setPpkCodes((list) => list.filter((p) => p.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "persiapan") {
      const row = preps[i];
      if (!row) return;
      void (async () => {
        try {
          await stagePreparation.delete(row.id);
          setPreps((list) => list.filter((p) => p.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "proses") {
      const row = procs[i];
      if (!row) return;
      void (async () => {
        try {
          await stageProcess.delete(row.id);
          setProcs((list) => list.filter((p) => p.id !== row.id));
        } catch {
          // gagal hapus
        }
      })();
    } else if (active === "users") {
      const u = usersList[i];
      if (!u) return;
      void (async () => {
        try {
          await user.delete(u.id);
          setUsersList((list) => list.filter((x) => x.id !== u.id));
        } catch {
          // gagal hapus
        }
      })();
    }
  }

  const activeFilterFields = useMemo(() => {
    if (active === "perusahaan") {
      const section = sectionsById.perusahaan;
      const defs = section.filters;
      return typeof defs === "function" ? defs(companies) : defs || [];
    }
    if (active === "mak") {
      const section = sectionsById.mak;
      const defs = section.filters;
      return typeof defs === "function" ? defs(makCodes) : defs || [];
    }
    if (active === "satker") {
      const section = sectionsById.satker;
      const defs = section.filters;
      return typeof defs === "function" ? defs(satkers) : defs || [];
    }
    if (active === "ppk") {
      const section = sectionsById.ppk;
      const defs = section.filters;
      return typeof defs === "function" ? defs(ppkCodes) : defs || [];
    }
    if (active === "persiapan") {
      const section = sectionsById.persiapan;
      const defs = section.filters;
      return typeof defs === "function" ? defs(preps) : defs || [];
    }
    if (active === "users") {
      const section = sectionsById.users;
      const defs = section.filters;
      return typeof defs === "function" ? defs(usersList) : defs || [];
    }
    const section = sectionsById.proses;
    const defs = section.filters;
    return typeof defs === "function" ? defs(procs) : defs || [];
  }, [active, companies, makCodes, satkers, ppkCodes, preps, procs, usersList]);

  function filteredWithIndex<T>(
    arr: T[],
    pick: (x: T) => string,
    filters?: Field[]
  ): { item: T; index: number }[] {
    const q = search.trim().toLowerCase();
    const base = arr.map((item, index) => ({ item, index }));
    const withFilters =
      filters && filters.length
        ? base.filter(({ item }) => {
            for (const f of filters) {
              const v = (tableFilters[f.name] || "").trim();
              if (!v) continue;
              const raw = (item as unknown as Record<string, unknown>)[f.name];
              const cur = raw === null || raw === undefined ? "" : String(raw);

              if (f.select) {
                if (cur !== v) return false;
              } else if (f.type === "number") {
                if (Number(cur || 0) !== Number(v)) return false;
              } else if (f.type === "date") {
                if ((cur || "").slice(0, 10) !== v) return false;
              } else {
                if (!cur.toLowerCase().includes(v.toLowerCase())) return false;
              }
            }
            return true;
          })
        : base;

    if (!q) return withFilters;
    return withFilters.filter((x) => pick(x.item).toLowerCase().includes(q));
  }

  function autoLabel(key: string) {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function autoField(name: string, value: string): Field {
    const trimmed = (value ?? "").trim();
    const isBool = trimmed === "true" || trimmed === "false";
    const isNumber = trimmed !== "" && /^-?\d+(\.\d+)?$/.test(trimmed);
    const isIsoDate = /^\d{4}-\d{2}-\d{2}/.test(trimmed);
    const isTextArea = trimmed.length > 80 || trimmed.includes("\n");

    if (isBool) {
      return {
        name,
        label: autoLabel(name),
        select: [
          { value: "true", label: "Ya" },
          { value: "false", label: "Tidak" },
        ],
      };
    }

    return {
      name,
      label: autoLabel(name),
      type: isIsoDate ? "date" : isNumber ? "number" : "text",
      textarea: !isIsoDate && !isNumber && isTextArea ? true : undefined,
    };
  }

  if (!authReady || !isAuthed) {
    return <div className="min-h-screen bg-[#F7FBFF]" />;
  }

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#0B1E33]">
      <header className="flex items-center justify-between border-b border-[#E1ECF7] bg-white px-4 py-2.5 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0066CC] text-white">
              <LineChart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5B6B7F]">
                RS KANKER DHARMAIS
              </p>
              <p className="text-sm font-semibold">Master Data</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xs text-[#5B6B7F] sm:flex">
            <Badge variant="soft" className="gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Pengadaan Barang & Jasa
            </Badge>
            <div className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Realtime Monitoring</span>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8 gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
      </header>

      <main className="mx-auto grid w-full grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:px-6">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="gap-2">
              <CardTitle className="text-base">Menu</CardTitle>
              <CardDescription>Pilih tabel master data untuk dikelola.</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <nav className="grid gap-1.5">
                {menu.map((m) => {
                  const Icon = m.icon;
                  const isActive = active === m.id;
                  return (
                    <button
                      key={m.id}
                      className={[
                        "group relative flex w-full items-center rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "border-[#C9E3FF] bg-[#E6F3FF] text-[#0066CC]"
                          : "border-transparent bg-white text-[#0B1E33] hover:border-[#E1ECF7] hover:bg-[#F7FBFF]",
                      ].join(" ")}
                      onClick={() => setActiveMenu(m.id as typeof active)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={[
                            "grid h-8 w-8 place-items-center rounded-lg border",
                            isActive
                              ? "border-[#C9E3FF] bg-white text-[#0066CC]"
                              : "border-[#E1ECF7] bg-white text-[#5B6B7F] group-hover:text-[#0066CC]",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{m.label}</span>
                      </span>
                      {isActive ? (
                        <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-1 rounded-r-full bg-[#0066CC]" />
                      ) : null}
                    </button>
                  );
                })}
              </nav>

            </CardContent>
          </Card>
        </aside>

        <section className="min-w-0">
          <Card className="overflow-hidden">
            <CardHeader className="gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-base">{sectionsById[active].label}</CardTitle>
                  <CardDescription>
                    {active === "users"
                      ? "Data pengguna diambil dari API. Tambah, ubah, dan hapus akan memanggil endpoint /users."
                      : active === "perusahaan"
                        ? "Data Perusahaan diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /admin/ulp-perusahaan-codes."
                        : active === "ppk"
                          ? "Data PPK diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /admin/ulp-ppk-codes."
                          : active === "mak"
                            ? "Data Kode MAK diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /ulp-mak-codes."
                            : active === "satker"
                              ? "Data Satker Unit diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /ulp-satker-unit-codes."
                              : active === "persiapan"
                                ? "Data Tahap Persiapan diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /ulp-stage-preperations."
                                : active === "proses"
                                  ? "Data Proses Pemilihan diambil dari API. Tambah, ubah, dan hapus memanggil endpoint /ulp-stage-processes."
                                  : "CRUD frontend menggunakan data. Integrasi API bisa ditambahkan kemudian."}
                  </CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-[260px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                    <Input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Cari..."
                      className="h-9 border-[#C9E3FF] bg-white pl-9 text-sm focus-visible:ring-[#0066CC]"
                    />
                  </div>
                  <Button className="h-9 gap-2" onClick={openAdd}>
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </div>
              </div>
              {activeFilterFields.length ? (
                <FilterBar
                  filters={activeFilterFields}
                  values={tableFilters}
                  onChange={(name: string, value: string) => {
                    setTableFilters((p) => ({ ...p, [name]: value }));
                    setPage(1);
                  }}
                  onReset={() => {
                    setTableFilters({});
                    setPage(1);
                  }}
                />
              ) : null}
            </CardHeader>
            <CardContent className="p-0">

          {active === "perusahaan" && (() => {
            const filtered = filteredWithIndex(companies, sectionsById.perusahaan.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.perusahaan.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.perusahaan.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "mak" && (() => {
            const filtered = filteredWithIndex(makCodes, sectionsById.mak.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.mak.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.mak.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "satker" && (() => {
            const filtered = filteredWithIndex(satkers, sectionsById.satker.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.satker.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.satker.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "ppk" && (() => {
            const filtered = filteredWithIndex(ppkCodes, sectionsById.ppk.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.ppk.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.ppk.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "persiapan" && (() => {
            const filtered = filteredWithIndex(preps, sectionsById.persiapan.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.persiapan.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.persiapan.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "proses" && (() => {
            const filtered = filteredWithIndex(procs, sectionsById.proses.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.proses.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.proses.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "users" && (() => {
            const filtered = filteredWithIndex(usersList, sectionsById.users.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.users.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.users.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}
            </CardContent>
          </Card>
        </section>
      </main>

      {showModal && (
        (() => {
          const initial =
            active === "perusahaan"
              ? sectionsById.perusahaan.initial(editIndex >= 0 ? companies[editIndex] : undefined)
              : active === "mak"
              ? sectionsById.mak.initial(editIndex >= 0 ? makCodes[editIndex] : undefined)
              : active === "satker"
              ? sectionsById.satker.initial(editIndex >= 0 ? satkers[editIndex] : undefined)
              : active === "ppk"
              ? sectionsById.ppk.initial(editIndex >= 0 ? ppkCodes[editIndex] : undefined)
              : active === "persiapan"
              ? sectionsById.persiapan.initial(editIndex >= 0 ? preps[editIndex] : undefined)
              : active === "users"
              ? sectionsById.users.initial(editIndex >= 0 ? usersList[editIndex] : undefined)
              : sectionsById.proses.initial(editIndex >= 0 ? procs[editIndex] : undefined);

          const rawBase =
            active === "users" ? userModalFields(editIndex) : sectionsById[active].fields;
          const base =
            editIndex < 0
              ? rawBase.filter((f) => {
                  if (active === "perusahaan" || active === "ppk")
                    return f.name !== "id";
                  if (active === "persiapan" || active === "proses")
                    return !["id", "createdAt", "updatedAt", "deletedAt"].includes(
                      f.name,
                    );
                  return true;
                })
              : rawBase;
          const existing = new Set(base.map((f) => f.name));
          const extra =
            active === "users" ||
            active === "perusahaan" ||
            active === "ppk" ||
            active === "mak" ||
            active === "satker" ||
            active === "persiapan" ||
            active === "proses"
              ? []
              : Object.keys(initial)
                  .filter((k) => !existing.has(k))
                  .sort((a, b) => a.localeCompare(b))
                  .map((k) => autoField(k, initial[k] || ""));

          return (
            <EditModal
              key={`${active}:${editIndex}`}
              title={`${editIndex >= 0 ? "Edit" : "Tambah"} ${sectionsById[active].label}`}
              onClose={resetModal}
              onSave={saveCurrent}
              fields={[...base, ...extra]}
              initial={initial}
            />
          );
        })()
      )}
    </div>
  );
}

function FilterBar({
  filters,
  values,
  onChange,
  onReset,
}: {
  filters: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onReset: () => void;
}) {
  const activeCount = Object.values(values).filter((v) => (v || "").trim().length > 0).length;
  return (
    <div className="flex flex-wrap items-end gap-2 border-t border-[#F0F4FA] pt-3">
      {filters.map((f) => (
        <div key={f.name} className="min-w-[160px] space-y-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F]">
            {f.label}
          </div>
          {f.select ? (
            <select
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              className="h-9 w-full rounded-xl border border-[#C9E3FF] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0066CC]"
            >
              <option value="">Semua</option>
              {f.select.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              type={f.type || "text"}
              placeholder="Semua"
              className="h-9 border-[#C9E3FF] bg-white text-sm focus-visible:ring-[#0066CC]"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-[#C9E3FF] bg-white text-sm"
          onClick={onReset}
          disabled={activeCount === 0}
        >
          Reset Filter
        </Button>
        {activeCount ? (
          <span className="text-xs text-[#5B6B7F]">({activeCount} aktif)</span>
        ) : null}
      </div>
    </div>
  );
}

function DataTable({
  columns,
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  showRowActions = true,
}: {
  columns: string[];
  rows: { index: number; cells: string[] }[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  /** Jika false, kolom menu aksi baris disembunyikan (mis. API tanpa update/delete). */
  showRowActions?: boolean;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * pageSize;
  const end = start + pageSize;
  const view = rows.slice(start, end);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(end, total);
  return (
    <div className="overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white/90 text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F] backdrop-blur">
            <tr className="border-b border-[#E1ECF7]">
              {showRowActions ? (
                <th className="w-12 px-4 py-3 text-left"> </th>
              ) : null}
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 text-left">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4FA]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showRowActions ? 1 : 0)}
                  className="px-4 py-14"
                >
                  <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#E1ECF7] bg-[#F7FBFF] text-[#0066CC]">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold">Belum ada data</div>
                    <div className="text-xs text-[#5B6B7F]">
                      Klik tombol “Tambah” untuk membuat entri baru.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              view.map((r) => (
                <tr key={r.index} className="group hover:bg-[#F7FBFF]">
                  {showRowActions ? (
                    <td className="px-2 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#5B6B7F] hover:text-[#0066CC]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          side="bottom"
                          sideOffset={6}
                          className="z-[200] w-48 rounded-xl border border-[#C9E3FF] bg-white p-1.5 text-[#0B1E33] shadow-xl"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer gap-2 rounded-lg py-2 text-[#0B1E33] focus:bg-[#E6F3FF] focus:text-[#0066CC]"
                            onClick={() => onEdit(r.index)}
                          >
                            <Pencil className="h-4 w-4 shrink-0 text-[#0066CC]" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#E1ECF7]" />
                          <DropdownMenuItem
                            className="cursor-pointer gap-2 rounded-lg py-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => onDelete(r.index)}
                          >
                            <Trash2 className="h-4 w-4 shrink-0" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  ) : null}
                  {r.cells.map((cell, j) => {
                    const value = cell?.trim() ? cell : "—";
                    return (
                      <td key={j} className="px-4 py-2.5 align-top">
                        <div className="max-w-[340px] truncate" title={value}>
                          {value}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#E1ECF7] bg-white px-4 py-2 text-xs text-[#5B6B7F]">
        <div>
          Menampilkan {from}-{to} dari {total}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-[#C9E3FF] bg-white px-2"
          >
            {[10, 25, 50].map((s) => (
              <option key={s} value={s}>
                {s}/halaman
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              Prev
            </Button>
            <div className="px-2">
              {page} / {pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(Math.min(pages, cur + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  title,
  onClose,
  onSave,
  fields,
  initial,
}: {
  title: string;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  fields: Field[];
  initial: Record<string, string>;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => initial || {});

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1E33]/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-3xl items-center">
        <Card className="w-full overflow-hidden shadow-xl">
          <CardHeader className="gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>Lengkapi field yang diperlukan lalu simpan perubahan.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[68vh] overflow-auto">
            <FormGrid
              fields={fields}
              values={formData}
              onChange={(name, value) => setFormData((p) => ({ ...p, [name]: value }))}
            />
          </CardContent>
          <div className="flex items-center justify-end gap-2 border-t border-[#F0F4FA] bg-white p-4">
            <Button variant="outline" className="h-9" onClick={onClose}>
              Batal
            </Button>
            <Button className="h-9" onClick={() => onSave(formData)}>
              Simpan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FormGrid({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((f) => (
        <div
          key={f.name}
          className={cn("space-y-1.5", f.fullWidth && "md:col-span-2")}
        >
          <div className="text-xs font-medium text-[#5B6B7F]">{f.label}</div>
          {f.select ? (
            (() => {
              const opts = f.select;
              const raw = values[f.name] ?? "";
              const allowEmpty = f.allowEmpty !== false;
              const optionValues = new Set(opts.map((o) => o.value));
              const selectedValue = allowEmpty
                ? raw === ""
                  ? "__empty__"
                  : raw
                : raw !== "" && optionValues.has(raw)
                  ? raw
                  : (opts[0]?.value ?? "");
              return (
                <Select
                  value={selectedValue}
                  onValueChange={(v) => {
                    if (allowEmpty) {
                      onChange(f.name, v === "__empty__" ? "" : v);
                    } else {
                      onChange(f.name, v);
                    }
                  }}
                  disabled={Boolean(f.readonly)}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 w-full min-w-0 rounded-xl border border-[#C9E3FF] bg-white px-3 text-sm shadow-none focus-visible:border-[#C9E3FF] focus-visible:ring-2 focus-visible:ring-[#0066CC] data-[size=default]:h-10 [&_svg]:text-[#5B6B7F]",
                      f.readonly
                        ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]"
                        : "",
                    )}
                  >
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowEmpty ? (
                      <SelectItem
                        value="__empty__"
                        className="text-[#5B6B7F]"
                      >
                        —
                      </SelectItem>
                    ) : null}
                    {opts.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })()
          ) : f.textarea ? (
            <textarea
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              disabled={Boolean(f.readonly)}
              className={[
                "min-h-[96px] w-full rounded-xl border border-[#C9E3FF] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#0066CC]",
                f.readonly ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]" : "",
              ].join(" ")}
            />
          ) : (
            <Input
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              type={
                f.type === "password"
                  ? "password"
                  : f.type === "date"
                    ? "date"
                    : f.type === "number"
                      ? "number"
                      : "text"
              }
              disabled={Boolean(f.readonly)}
              className={[
                "h-10 border-[#C9E3FF] bg-white text-sm focus-visible:ring-[#0066CC]",
                f.readonly ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]" : "",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
