"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplaceService";
import BusinessMap from "./BusinessMap";
import Businesses from "./index";

const BusinessSection = () => {
  const { data: bRes, isLoading: bLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => marketplaceService.getBusinesses(1, 10),
  });

  const { data: lRes, isLoading: lLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => marketplaceService.getMarketplaceLocations(),
  });

  const businesses = bRes?.data?.items?.filter((biz: any) => biz.latitude && biz.longitude) || [];
  const locations = lRes?.success ? lRes.data : [];

  return (
    <>
      <BusinessMap locations={locations} businesses={businesses} />
      <Businesses initialData={bRes} isLoading={bLoading || lLoading} />
    </>
  );
};

export default BusinessSection;
