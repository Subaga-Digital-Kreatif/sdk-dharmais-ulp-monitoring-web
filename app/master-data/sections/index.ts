export type {
  Field,
  MakKategori,
  MakCode,
  MenuId,
  Perusahaan,
  PpkCode,
  SatkerUnit,
  StagePreparation,
  StageProcess,
} from "./section-types";

export { toFlat } from "./utils";

import { perusahaanSection } from "./perusahaan";
import { makSection } from "./mak";
import { satkerSection } from "./satker";
import { ppkSection } from "./ppk";
import { persiapanSection } from "./persiapan";
import { prosesSection } from "./proses";

export const sections = [
  perusahaanSection,
  makSection,
  satkerSection,
  ppkSection,
  persiapanSection,
  prosesSection,
] as const;

export const sectionsById = {
  perusahaan: perusahaanSection,
  mak: makSection,
  satker: satkerSection,
  ppk: ppkSection,
  persiapan: persiapanSection,
  proses: prosesSection,
} as const;

