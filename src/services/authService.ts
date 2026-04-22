import {
  ApiResponse,
  AuthInitResponse,
  AuthResponseData,
  Client,
  LoginPayload,
  RegisterPayload,
  VerifyPayload,
} from "@/types/api";
import { apiClient } from "./apiClient";

export const authService = {
  register: (body: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthInitResponse>>(
      "/marketplace/clients/register",
      body
    ),

  login: (body: LoginPayload) =>
    apiClient.post<ApiResponse<AuthInitResponse>>(
      "/marketplace/clients/login",
      body
    ),

  verify: (body: VerifyPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>(
      "/marketplace/clients/verify",
      body
    ),

  getProfile: (clientId: string) =>
    apiClient.get<ApiResponse<Client>>(`/marketplace/clients/${clientId}`),
};
