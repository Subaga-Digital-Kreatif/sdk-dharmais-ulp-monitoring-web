import { api } from "./api";
import {
  type DashboardFilters,
  toFilterParams,
} from "@/lib/dashboard-filters";

export type ModalVsOperasional = {
    totalModal: number;
    totalOperasional: number;
    persentaseModal: number;
    persentaseOperasional: number;
};

export const getModalVsOperasional = async (
  filters: DashboardFilters = {},
): Promise<ModalVsOperasional> => {
  const response = await api.get("/dashboard/persiapan/modal-vs-operasional", {
    params: toFilterParams(filters),
  });
  return response.data;
};