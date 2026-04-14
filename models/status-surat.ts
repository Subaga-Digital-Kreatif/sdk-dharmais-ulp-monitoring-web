import { api } from "./api";

export type StatusSuratResponse = {
  status: string;
  count: number;
};

export const getStatusSurat = async (): Promise<StatusSuratResponse[]> => {
  const response = await api.get("/dashboard/proses/status-surat");
  return response.data;
};