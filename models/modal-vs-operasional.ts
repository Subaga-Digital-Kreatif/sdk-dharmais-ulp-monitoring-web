import { api } from "./api";

export type ModalVsOperasional = {
    totalModal: string;
    totalOperasional: string;
    persentaseModal: number;
    persentaseOperasional: number;
};

export const getModalVsOperasional = async (): Promise<ModalVsOperasional> => {
  const response = await api.get("/dashboard/persiapan/modal-vs-operasional");
  return response.data;
};