/** `/admin/ulp-ppk-codes` */

export type PpkCode = {
  id: number;
  ppkKode: string;
  ppkNomenklatur: string;
  ppkNama: string | null;
  ppkJabatan: string | null;
  ppkUsulanMasuk: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type CreateUlpPpkCodeRequest = {
  ppkKode: string;
  ppkNomenklatur: string;
  ppkNama?: string | null;
  ppkJabatan?: string | null;
  ppkUsulanMasuk?: string | null;
};

export type UpdateUlpPpkCodeRequest = Partial<CreateUlpPpkCodeRequest>;
