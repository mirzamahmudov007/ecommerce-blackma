import { ApiProduct } from "@/types/api";
import { Product } from "@/types/product";

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const mainImage = apiProduct.images?.[0]?.filename || "/images/product/product-01.png";

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: apiProduct.price,
    discountedPrice: apiProduct.price, // API doesn't specify discounted price in snippet
    reviews: 0, // Mocking reviews
    imgs: {
      thumbnails: [mainImage],
      previews: [mainImage],
    },
    businessId: apiProduct.business?.id,
  };
};
