"use client";
import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { marketplaceService } from "@/services/marketplaceService";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const BestSeller = () => {
  const t = useTranslations();

  const { data: businessesRes } = useQuery({
    queryKey: ["businesses", 1],
    queryFn: () => marketplaceService.getBusinesses(1, 1),
  });

  const businessId = businessesRes?.success && businessesRes.data?.items?.length > 0
    ? businessesRes.data.items[0].id
    : (businessesRes?.success && Array.isArray(businessesRes.data) && businessesRes.data.length > 0
      ? businessesRes.data[0].id
      : null);

  const { data: productsRes, isLoading } = useQuery({
    queryKey: ["best-sellers", businessId],
    queryFn: () => marketplaceService.getProducts(businessId!, 6),
    enabled: !!businessId,
  });

  const products = productsRes?.success ? productsRes.data : [];

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              {t("this_month")}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              {t("best_sellers")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {products.map((item: any, idx: number) => (
            <SingleItem
              item={{
                id: Number(item.id),
                title: item.name,
                price: item.price,
                discountedPrice: item.price,
                reviews: 0,
                imgs: {
                  thumbnails: [item.image],
                  previews: [item.image]
                }
              }}
              key={item.id || idx}
            />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            {t("view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
