import { apiClient } from "./apiClient";
import { ApiResponse, ClientAddress } from "@/types/api";

export const addressService = {
  createAddress: (body: any) =>
    apiClient.post<ApiResponse<ClientAddress>>("/api/client-addresses", body),
};
