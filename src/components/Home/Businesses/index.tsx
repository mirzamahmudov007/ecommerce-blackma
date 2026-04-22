"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplaceService";
import SingleItem from "./SingleItem";
import { useTranslations } from "next-intl";

const Businesses = ({ initialData, isLoading: parentLoading }: { initialData?: any, isLoading?: boolean }) => {
  const { data: queryData, isLoading: queryLoading, error } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => marketplaceService.getBusinesses(1, 10),
    enabled: !initialData,
  });

  const t = useTranslations();

  const data = initialData || queryData;
  const isLoading = parentLoading || queryLoading;

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-[1170px] mx-auto px-4">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.success) {
    return null;
  }

  const businesses = data.data;

  return (
    <section className="py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 text-center">

          <h2 className="font-bold text-3xl xl:text-4xl text-dark">
            {t("businesses")}
          </h2>
          <p className="max-w-[600px] mx-auto mt-4 text-dark-5">
            {t("businesses_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-7.5">
          {businesses?.map((business: any) => (
            <SingleItem key={business.id} item={business} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Businesses;
