"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplaceService";
import { useTranslations } from "next-intl";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";

const HeroCarousal = () => {
  const t = useTranslations();
  const { data: bannersRes, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: () => marketplaceService.getBanners(1, 10),
  });

  const banners = bannersRes?.status ? bannersRes.data.items : [];

  if (isLoading) {
    return (
      <div className="h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-1 rounded-lg animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-dark-4 font-medium italic">{t("loading_banners")}</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {banners.map((banner: any) => (
        <SwiperSlide key={banner.id}>
          <div className="relative w-full aspect-[22/9] sm:aspect-[24/9] lg:aspect-[28/9] rounded-xl overflow-hidden shadow-2 transition-transform duration-700 ease-in-out hover:scale-[1.01]">
            <Image
              src={banner.imageUrl}
              alt="Promotion Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
