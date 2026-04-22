import { Business, MarketplaceLocation } from "@/types/api";
import { useTranslations, useLocale } from "next-intl";
import Script from "next/script";
import { useEffect, useState } from "react";

interface BusinessMapProps {
  locations?: MarketplaceLocation[];
  businesses?: Business[];
}

declare global {
  interface Window {
    L: any;
  }
}

const BusinessMap: React.FC<BusinessMapProps> = ({ locations = [], businesses = [] }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    // Detect user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Tashkent if blocked
          setUserLocation([41.311081, 69.240562]);
        }
      );
    } else {
      setUserLocation([41.311081, 69.240562]);
    }
  }, []);

  const initMap = () => {
    if (typeof window === "undefined" || !window.L || !userLocation) return;

    const L = window.L;

    // Clear existing map if any
    const container = L.DomUtil.get("map");
    if (container !== null) {
      container._leaflet_id = null;
    }

    const map = L.map("map").setView(userLocation, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom icon for user
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: '<div class="w-4 h-4 bg-blue rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
      iconSize: [16, 16],
    });

    L.marker(userLocation, { icon: userIcon }).addTo(map).bindPopup(t("you_are_here"));

    // Add marketplace locations and branches
    locations.forEach((loc) => {
      loc.branches?.forEach((branch) => {
        if (branch.latitude && branch.longitude) {
          const shopIcon = L.divIcon({
            className: "shop-marker",
            html: `<div class="flex items-center justify-center bg-white p-1 rounded-full shadow-lg border-2" style="border-color: ${loc.backgroundColor || '#3C50E0'}">
                    <img src="${loc.logo}" class="w-8 h-8 rounded-full object-cover" alt="${loc.name}" />
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const popupContent = `
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center gap-2 mb-2">
                <img src="${loc.logo}" class="w-10 h-10 rounded-full" />
                <h3 class="font-bold text-dark text-lg">${loc.name}</h3>
              </div>
              <p class="text-xs text-gray-500 mb-1"><b>Filial:</b> ${branch.name}</p>
              <p class="text-xs text-gray-500 mb-1"><b>Manzil:</b> ${branch.addressName}</p>
              <p class="text-xs text-gray-500 mb-2">${loc.description}</p>
              <div class="flex flex-col gap-1 mb-3">
                <p class="text-xs">📞 ${branch.phoneNumber}</p>
                <p class="text-xs">✉️ ${branch.email}</p>
              </div>
              <a href="/${locale}/shop-with-sidebar?businessId=${loc.id}" 
                 class="block text-center bg-blue text-white py-1.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all">
                ${t("view_products")}
              </a>
            </div>
          `;

          L.marker([branch.latitude, branch.longitude], { icon: shopIcon })
            .addTo(map)
            .bindPopup(popupContent);
        }
      });
    });

    // Fallback for old businesses prop if locations empty
    if (locations.length === 0) {
      businesses.forEach((biz) => {
        if (biz.latitude && biz.longitude) {
          const bizIcon = L.divIcon({
            className: "biz-marker",
            html: `<div class="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-md border border-gray-200">
                    <div class="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span class="text-[10px] font-bold whitespace-nowrap">${biz.name}</span>
                  </div>`,
            iconSize: [100, 30],
            iconAnchor: [50, 15],
          });

          L.marker([biz.latitude, biz.longitude], { icon: bizIcon })
            .addTo(map)
            .bindPopup(`<b>${biz.name}</b><br>${biz.description}<br><a href="/${locale}/shop-with-sidebar?businessId=${biz.id}" class="text-blue">${t("view_products")}</a>`);
        }
      });
    }

    setMapLoaded(true);
  };

  useEffect(() => {
    if (userLocation) {
      initMap();
    }
  }, [userLocation, locations, businesses]);

  return (
    <section className="py-20 bg-gray-1">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 text-center">
          <span className="bg-blue bg-opacity-10 text-blue px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
            {t("businesses_near_you")}
          </span>
          <h2 className="font-bold text-3xl xl:text-4xl text-dark mb-4">
            Do'konlarimiz Xaritada
          </h2>
          <p className="text-dark-5 max-w-[600px] mx-auto">{t("map_desc")}</p>
        </div>

        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white bg-white group">
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <Script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossOrigin=""
            onLoad={initMap}
          />
          <div id="map" className="w-full h-full z-1"></div>

          {!userLocation && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
                <p className="text-dark font-medium animate-pulse">Xarita yuklanmoqda...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .user-location-marker {
          background: none !important;
          border: none !important;
        }
        .shop-marker {
          background: none !important;
          border: none !important;
          transition: transform 0.2s ease-out;
        }
        .shop-marker:hover {
          transform: scale(1.2) translateY(-5px);
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </section>
  );
};

export default BusinessMap;
