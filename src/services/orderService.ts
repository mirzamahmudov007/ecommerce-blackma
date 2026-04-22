import { apiClient } from "./apiClient";
import { ApiResponse, MarketplaceOrderPayload, MarketplaceOrderResponse, Order } from "@/types/api";

export const orderService = {
  createOrder: (body: any) =>
    apiClient.post<ApiResponse<Order>>("/api/orders", body),

  createMarketplaceOrder: (body: MarketplaceOrderPayload) =>
    apiClient.post<MarketplaceOrderResponse>("/marketplace/orders", body),

  getClientOrders: (clientId: string, limit = 20, offset = 0) =>
    apiClient.get<ApiResponse<Order[]>>(
      `/api/orders/client/${clientId}?limit=${limit}&offset=${offset}`
    ),

  getOrderById: (orderId: string, includeItems = true) =>
    apiClient.get<ApiResponse<Order>>(
      `/api/orders/${orderId}?includeItems=${includeItems}`
    ),

  getMarketplaceOrderById: (orderId: string) =>
    apiClient.get<MarketplaceOrderResponse>(`/marketplace/orders/${orderId}`),
};
