/** `/admin/ulp-perusahaan-codes` */

export type Perusahaan = {
  id: number;
  perusahaanNama: string;
  perusahaanPimpinanNama: string;
  perusahaanContact: string;
  perusahaanAlamat: string;
  perusahaanKbli: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type CreateUlpPerusahaanCodeRequest = {
  perusahaanNama: string;
  perusahaanPimpinanNama?: string;
  perusahaanContact?: string;
  perusahaanAlamat?: string;
  perusahaanKbli?: string;
};

export type UpdateUlpPerusahaanCodeRequest =
  Partial<CreateUlpPerusahaanCodeRequest>;
