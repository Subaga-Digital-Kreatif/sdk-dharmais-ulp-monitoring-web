/** `/admin/ulp-ppk-codes` */

export type PpkCode = {
  id: number;
  ppkKode: string;
  ppkNomenklatur: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type CreateUlpPpkCodeRequest = {
  ppkKode: string;
  ppkNomenklatur: string;
};

export type UpdateUlpPpkCodeRequest = Partial<CreateUlpPpkCodeRequest>;
