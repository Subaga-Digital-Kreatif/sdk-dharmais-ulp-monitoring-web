type MakCode = {
  id: number;
  makKategori: string;
  makKode: string;
  makInduk: string;
  makRinci: string;
  makNo: string;
  makKeterangan: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

type CreateMakCodeRequest = {
  makKategori: string;
  makKode: string;
  makInduk: string;
  makRinci: string;
  makNo: string;
  makKeterangan: string;
};

type UpdateMakCodeRequest = {
  makKategori: string;
  makKode: string;
  makInduk: string;
  makRinci: string;
  makNo: string;
  makKeterangan: string;
};