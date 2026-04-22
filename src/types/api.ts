/**
 * General Response Template
 */
export interface ApiResponse<T> {
  status?: boolean;
  success?: boolean;
  message?: string;
  data: T;
}

/**
 * 1. Register Client & 2. Verify Client
 */
export interface Client {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  is_deleted?: boolean;
  is_verified?: boolean;
  verification_code?: number;
  verification_code_expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponseData {
  client: Client;
  token: string;
}

export interface RegisterPayload {
  name: string;
  phone_number: string;
  email: string;
}

export interface LoginPayload {
  phone_number: string;
}

export interface VerifyPayload {
  clientId: string;
  code: number;
}

export interface AuthInitResponse {
  clientId: string;
}

/**
 * 4. Business / Marketplace
 */
export interface BusinessLogo {
  id: string;
  filename: string;
}

export interface BusinessLocation {
  id: string;
  name: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  registrationType: string;
  serviceType: string[];
  country?: BusinessLocation;
  region?: BusinessLocation;
  language?: string;
  logo: BusinessLogo;
  backgroundColor: string;
  isMarketplaceEnabled: boolean;
  marketplaceEnabledAt?: string | null;
  createdAt: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
}

export interface MarketplaceApiResponse<T> {
  success: boolean;
  data: T;
  count: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface BusinessesResponse {
  items: Business[];
  pagination: Pagination;
}

/**
 * 6. Category
 */
export interface Category {
  id: string;
  businessId: string;
  title: string;
  description: string;
  parentCategoryId: string | null;
  startTime: string;
  endTime: string;
  imageId: string;
  taxCode: string;
  packageCode: string | null;
  status: string;
  index: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
}

/**
 * 7. Product
 */
export interface ProductImage {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProduct {
  id: string;
  business?: Business;
  category?: Category;
  title: string;
  description: string;
  barcode: string | null;
  pluCode: string | null;
  price: number;
  index: number;
  images: ProductImage[];
  availability: boolean;
  taxCode: string;
  packageCode: string | null;
  options: any[];
  locationInfo: any[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: ApiProduct[];
  total: number;
}

/**
 * 9. Client Address
 */
export interface Region {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface ClientAddress {
  id: string;
  client_id: string;
  street_address: string;
  city: string;
  latitude: number;
  longitude: number;
  apartment?: string;
  floor?: number | string;
  entry_code?: string;
  region_id: string;
  country_id: string;
  is_main: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientAddressPayload {
  client_id: string;
  street_address: string;
  latitude: number;
  longitude: number;
  apartment?: string;
  floor?: string;
  entry_code?: string;
  region_id: string;
  country_id: string;
  city: string;
  is_main?: boolean;
}

/**
 * 10. Order
 */
export interface OrderItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Order {
  id: string;
  clientId: string;
  businessId: string;
  branchId: string;
  status: "NEW" | "PENDING" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  totalAmount: number;
  comment?: string;
  deliveryAddress?: {
    id: string;
    address: string;
  };
  items: OrderItem[];
  createdAt: string;
}

export interface Banner {
  id: string;
  businessId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerData {
  items: Banner[];
  pagination: Pagination & { totalPages: number };
}
export interface MarketplaceOrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  title: string;
}

export interface MarketplaceOrderPayload {
  business_id: string;
  branch_id: string;
  client_id: string;
  client_address_id: string;
  channel_order_id?: string;
  delivery_address: string;
  payment_type: "CARD" | "CASH";
  order_type: "DELIVERY" | "PICKUP";
  comment?: string;
  delivery_fee: number;
  total_discount: number;
  total_amount: number;
  items: MarketplaceOrderItem[];
}

export interface MarketplaceOrderResponse {
  success: boolean;
  data: Order;
}

/**
 * Global Categories
 */
export interface GlobalCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalCategoryResponse {
  code: number;
  msg: string;
  data: GlobalCategory[];
}

export interface GlobalSubCategory {
  id: string;
  mainCategoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  sortOrder: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalSubCategoryResponse {
  code: number;
  msg: string;
  data: GlobalSubCategory[];
}

/**
 * Marketplace Locations
 */
export interface WorkingHour {
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export interface WorkingHours {
  monday: WorkingHour;
  tuesday: WorkingHour;
  wednesday: WorkingHour;
  thursday: WorkingHour;
  friday: WorkingHour;
  saturday: WorkingHour;
  sunday: WorkingHour;
}

export interface Branch {
  id: string;
  name: string;
  addressName: string;
  destination: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  email: string;
  workingHours: WorkingHours;
  isActive: boolean;
}

export interface MarketplaceLocation {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  logo: string;
  backgroundColor: string;
  branches: Branch[];
}

export interface MarketplaceLocationResponse {
  success: boolean;
  data: MarketplaceLocation[];
}
