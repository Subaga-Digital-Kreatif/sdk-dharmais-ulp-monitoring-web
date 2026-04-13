import { api } from "./api";

type MakCodeResponse = {
  data: MakCode[];
  meta: MetaResponse;
};

export const makCode = {
  getAll: async () => {
    const response = await api.get<MakCodeResponse>("/ulp-mak-codes");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<MakCode>(`/ulp-mak-codes/${id}`);
    return response.data;
  },

  create: async (request: CreateMakCodeRequest) => {
    const response = await api.post<MakCode>("/ulp-mak-codes", request);
    return response.data;
  },

  update: async (id: number, request: UpdateMakCodeRequest) => {
    const response = await api.put<MakCode>(`/ulp-mak-codes/${id}`, request);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<MakCode>(`/ulp-mak-codes/${id}`);
    return response.data;
  },
};
