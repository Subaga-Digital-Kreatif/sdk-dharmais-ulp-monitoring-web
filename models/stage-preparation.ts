import { api } from "./api";

const BASE = "/ulp-stage-preperations";

type StagePreparationListResponse = {
  data: StagePreparation[];
  meta: MetaResponse;
};

export const stagePreparation = {
  getAll: async () => {
    const response = await api.get<StagePreparationListResponse>(BASE);
    return response.data;
  },

  getById: async (id: number, params?: { include?: string }) => {
    const response = await api.get<StagePreparation>(`${BASE}/${id}`, {
      params,
    });
    return response.data;
  },

  create: async (request: CreateStagePreparationRequest) => {
    const response = await api.post<StagePreparation>(BASE, request);
    return response.data;
  },

  update: async (id: number, request: UpdateStagePreparationRequest) => {
    const response = await api.put<StagePreparation>(`${BASE}/${id}`, request);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
