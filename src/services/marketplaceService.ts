import { apiClient } from "./apiClient";
import {
  ApiResponse,
  BusinessesResponse,
  Business,
  Category,
  ApiProduct,
  MarketplaceApiResponse,
  CategoryResponse,
  BannerData,
  ProductsResponse,
  ClientAddress,
  CreateClientAddressPayload,
  Region,
  Country,
  GlobalCategoryResponse,
  GlobalSubCategoryResponse,
  MarketplaceLocationResponse,
} from "@/types/api";

export const marketplaceService = {
  getBusinesses: (page = 1, limit = 20) =>
    apiClient.get<MarketplaceApiResponse<BusinessesResponse>>(
      `/marketplace?page=${page}&limit=${limit}`
    ),

  getBusinessById: (businessId: string) =>
    apiClient.get<ApiResponse<Business>>(`/marketplace/${businessId}`),

  getCategories: (businessId: string, limit = 20, offset = 0) =>
    apiClient.get<CategoryResponse>(
      `/marketplace/${businessId}/categories?limit=${limit}&offset=${offset}`
    ),

  getProducts: (
    businessId: string,
    limit = 20,
    offset = 0,
    filters?: {
      categoryId?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
    }
  ) => {
    let url = `/marketplace/${businessId}/products?limit=${limit}&offset=${offset}`;
    if (filters?.categoryId) url += `&categoryId=${filters.categoryId}`;
    if (filters?.search) url += `&search=${filters.search}`;
    if (filters?.minPrice !== undefined) url += `&minPrice=${filters.minPrice}`;
    if (filters?.maxPrice !== undefined) url += `&maxPrice=${filters.maxPrice}`;
    return apiClient.get<ProductsResponse>(url);
  },

  getProductById: (businessId: string, productId: string) =>
    apiClient.get<ApiResponse<ApiProduct>>(
      `/marketplace/${businessId}/products/${productId}`
    ),
  getBanners: (page = 1, limit = 20) =>
    apiClient.get<ApiResponse<BannerData>>(
      `/business-banners?page=${page}&limit=${limit}`
    ),

  // Client Address Methods
  getClientAddresses: (clientId: string) =>
    apiClient.get<ApiResponse<ClientAddress[]>>(
      `/marketplace/client-addresses?client_id=${clientId}`
    ),

  getClientAddressById: (addressId: string) =>
    apiClient.get<ApiResponse<ClientAddress>>(
      `/marketplace/client-addresses/${addressId}`
    ),

  getMainAddress: (clientId: string) =>
    apiClient.get<ApiResponse<ClientAddress>>(
      `/marketplace/client-addresses/client/${clientId}/main`
    ),

  createClientAddress: (payload: CreateClientAddressPayload) =>
    apiClient.post<ApiResponse<ClientAddress>>(
      `/marketplace/client-addresses`,
      payload
    ),

  updateClientAddress: (addressId: string, payload: Partial<CreateClientAddressPayload>) =>
    apiClient.put<ApiResponse<ClientAddress>>(
      `/marketplace/client-addresses/${addressId}`,
      payload
    ),

  setMainAddress: (addressId: string) =>
    apiClient.put<ApiResponse<any>>(
      `/marketplace/client-addresses/${addressId}/set-main`,
      {}
    ),

  deleteClientAddress: (addressId: string) =>
    apiClient.delete<ApiResponse<any>>(
      `/marketplace/client-addresses/${addressId}`
    ),

  getRegions: (countryId?: string) =>
    apiClient.get<ApiResponse<{ regions: Region[] }>>(
      `/regions${countryId ? `?countryId=${countryId}` : ""}`
    ),

  getCountries: () =>
    apiClient.get<ApiResponse<{ countries: Country[] }>>(`/countries`),

  getMainCategories: () =>
    apiClient.get<GlobalCategoryResponse>("/global-categories/main-categories?status=ACTIVE"),

  getSubCategories: (mainCategoryId: string) =>
    apiClient.get<GlobalSubCategoryResponse>(`/global-categories/sub-categories?mainCategoryId=${mainCategoryId}&status=ACTIVE`),

  getMarketplaceLocations: () =>
    apiClient.get<MarketplaceLocationResponse>("/marketplace/locations"),
};
