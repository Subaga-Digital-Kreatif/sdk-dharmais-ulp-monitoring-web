import { api } from "./api";

type SatkerUnitCodeListResponse = {
  data: SatkerUnitCode[];
  meta: MetaResponse;
};

export const satkerUnitCode = {
  getAll: async () => {
    const response = await api.get<SatkerUnitCodeListResponse>(
      "/ulp-satker-unit-codes",
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<SatkerUnitCode>(`/ulp-satker-unit-codes/${id}`);
    return response.data;
  },

  create: async (request: CreateSatkerUnitCodeRequest) => {
    const response = await api.post<SatkerUnitCode>(
      "/ulp-satker-unit-codes",
      request,
    );
    return response.data;
  },

  update: async (id: number, request: UpdateSatkerUnitCodeRequest) => {
    const response = await api.put<SatkerUnitCode>(
      `/ulp-satker-unit-codes/${id}`,
      request,
    );
    return response.data;
  },

  /** Respons API 204 tanpa body. */
  delete: async (id: number) => {
    await api.delete(`/ulp-satker-unit-codes/${id}`);
  },
};
