import type {
  CreateUlpPpkCodeRequest,
  PpkCode,
  UpdateUlpPpkCodeRequest,
} from "@/types/ulp-ppk-code";

import { api } from "./api";

const BASE = "/admin/ulp-ppk-codes";

type ListResponse = {
  data: PpkCode[];
  meta: MetaResponse;
};

export const ulpPpkCode = {
  getAll: async () => {
    const response = await api.get<ListResponse>(BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<PpkCode>(`${BASE}/${id}`);
    return response.data;
  },

  create: async (request: CreateUlpPpkCodeRequest) => {
    const response = await api.post<PpkCode>(BASE, request);
    return response.data;
  },

  update: async (id: number, request: UpdateUlpPpkCodeRequest) => {
    const response = await api.put<PpkCode>(`${BASE}/${id}`, request);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
