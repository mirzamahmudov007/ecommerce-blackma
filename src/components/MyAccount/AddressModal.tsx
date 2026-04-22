import React, { useEffect, useState } from "react";
import { marketplaceService } from "@/services/marketplaceService";
import { useQuery } from "@tanstack/react-query";

interface AddressModalProps {
  isOpen: boolean;
  closeModal: () => void;
  address?: any;
  clientId: string;
  onSuccess: () => void;
}

const AddressModal = ({ isOpen, closeModal, address, clientId, onSuccess }: AddressModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    streetAddress: "",
    apartment: "",
    floor: "",
    city: "",
    regionId: "",
    countryId: "",
    isMain: false,
  });

  const { data: countriesResponse } = useQuery({
    queryKey: ["countries"],
    queryFn: () => marketplaceService.getCountries(),
    enabled: isOpen,
  });

  const { data: regionsResponse } = useQuery({
    queryKey: ["regions", formData.countryId],
    queryFn: () => marketplaceService.getRegions(formData.countryId),
    enabled: isOpen && !!formData.countryId,
  });

  const countries = countriesResponse?.data?.countries || [];
  const regions = regionsResponse?.data?.regions || [];

  useEffect(() => {
    if (address) {
      setFormData({
        streetAddress: address.street_address || address.streetAddress || "",
        apartment: address.apartment || "",
        floor: String(address.floor || ""),
        city: address.city || "",
        regionId: address.region_id || address.regionId || "",
        countryId: address.country_id || address.countryId || "",
        isMain: address.is_main || address.isMain || false,
      });
    } else {
      setFormData({
        streetAddress: "",
        apartment: "",
        floor: "",
        city: "",
        regionId: "",
        countryId: "",
        isMain: false,
      });
    }
  }, [address, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedRegion = regions.find((r: any) => r.id === formData.regionId);

      const payload: any = {
        client_id: clientId,
        street_address: formData.streetAddress,
        latitude: selectedRegion?.latitude || 0,
        longitude: selectedRegion?.longitude || 0,
        apartment: formData.apartment,
        floor: String(formData.floor),
        region_id: formData.regionId,
        country_id: formData.countryId,
        city: formData.city,
        is_main: formData.isMain,
      };

      if (address) {
        await marketplaceService.updateClientAddress(address.id, payload);
      } else {
        await marketplaceService.createClientAddress(payload);
      }
      onSuccess();
      closeModal();
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Manzilni saqlashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      // Reset region if country changes
      if (name === "countryId") {
        newData.regionId = "";
      }

      return newData;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-dark/70 px-4 py-5">
      <div className="relative w-full max-w-[700px] rounded-xl bg-white p-6 shadow-3 sm:p-10 modal-content overflow-y-auto max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-1 text-dark hover:bg-gray-2 transition-colors"
        >
          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
            <path d="M15.707 4.293a1 1 0 00-1.414 0L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 101.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 000-1.414z" />
          </svg>
        </button>

        <h3 className="mb-8 text-2xl font-bold text-dark">
          {address ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2.5 block font-medium text-dark">Ko'cha va uy raqami</label>
            <input
              type="text"
              name="streetAddress"
              required
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Masalan: Mustaqillik shoh ko'chasi, 15-uy"
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="mb-2.5 block font-medium text-dark">Kvartira raqami</label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              placeholder="Masalan: 42"
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="mb-2.5 block font-medium text-dark">Qavat</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="Masalan: 3"
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="mb-2.5 block font-medium text-dark">Shahar</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Masalan: Toshkent"
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="mb-2.5 block font-medium text-dark">Region</label>
            <select
              name="regionId"
              required
              value={formData.regionId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors appearance-none"
            >
              <option value="">Regionni tanlang</option>
              {regions.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name || r.nameUz || r.nameRu || r.nameEn}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2.5 block font-medium text-dark">Davlat</label>
            <select
              name="countryId"
              required
              value={formData.countryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-5 py-3 outline-none focus:border-blue transition-colors appearance-none"
            >
              <option value="">Davlatni tanlang</option>
              {countries.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name || c.nameUz || c.nameRu || c.nameEn}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isMain"
              name="isMain"
              checked={formData.isMain}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-3 text-blue focus:ring-blue"
            />
            <label htmlFor="isMain" className="font-medium text-dark cursor-pointer select-none">
              Asosiy manzil sifatida belgilash
            </label>
          </div>

          <div className="sm:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-blue py-4 font-bold text-white hover:bg-blue-dark transition-colors disabled:bg-gray-4"
            >
              {loading ? "Saqlanmoqda..." : address ? "O'zgarishlarni saqlash" : "Manzilni qo'shish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
