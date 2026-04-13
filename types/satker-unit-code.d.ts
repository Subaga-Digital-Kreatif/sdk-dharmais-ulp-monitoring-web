type SatkerUnitCode = {
  id: number;
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

type CreateSatkerUnitCodeRequest = {
  satkerUnitPengendaliKode: string;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
};

type UpdateSatkerUnitCodeRequest = CreateSatkerUnitCodeRequest;
