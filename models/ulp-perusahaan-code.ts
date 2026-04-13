import type {
  CreateUlpPerusahaanCodeRequest,
  Perusahaan,
  UpdateUlpPerusahaanCodeRequest,
} from "@/types/ulp-perusahaan-code";

import { api } from "./api";

const BASE = "/admin/ulp-perusahaan-codes";

type ListResponse = {
  data: Perusahaan[];
  meta: MetaResponse;
};

export const ulpPerusahaanCode = {
  getAll: async () => {
    const response = await api.get<ListResponse>(BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Perusahaan>(`${BASE}/${id}`);
    return response.data;
  },

  create: async (request: CreateUlpPerusahaanCodeRequest) => {
    const response = await api.post<Perusahaan>(BASE, request);
    return response.data;
  },

  update: async (id: number, request: UpdateUlpPerusahaanCodeRequest) => {
    const response = await api.put<Perusahaan>(`${BASE}/${id}`, request);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
