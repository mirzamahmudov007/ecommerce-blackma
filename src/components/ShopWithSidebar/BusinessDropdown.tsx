"use client";
import { useState } from "react";
import { Business } from "@/types/api";
import { useTranslations } from "next-intl";

interface BusinessItemProps {
  business: Business;
  isActive: boolean;
  onClick: (id: string) => void;
}

const BusinessItem = ({ business, isActive, onClick }: BusinessItemProps) => {
  return (
    <button
      type="button"
      className={`${isActive && "text-blue"
        } group flex items-center justify-between ease-out duration-200 hover:text-blue w-full text-left`}
      onClick={() => onClick(business.id)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${isActive ? "border-blue bg-blue" : "bg-white border-gray-3"
            }`}
        >
          <svg
            className={isActive ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="truncate max-w-[180px]">{business.name}</span>
      </div>
    </button>
  );
};

interface BusinessDropdownProps {
  businesses: Business[];
  activeBusinessId?: string | null;
  onBusinessClick: (id: string) => void;
}

const BusinessDropdown = ({
  businesses,
  activeBusinessId,
  onBusinessClick,
}: BusinessDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const t = useTranslations();

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"
          }`}
      >
        <p className="text-dark font-medium">{t("businesses")}</p>
        <button
          type="button"
          aria-label="button for business dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && "rotate-180"
            }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"
          }`}
      >
        {businesses?.map((business) => (
          <BusinessItem
            key={business.id}
            business={business}
            isActive={business.id === activeBusinessId}
            onClick={onBusinessClick}
          />
        ))}
        {businesses.length === 0 && (
          <p className="text-gray-5 text-custom-sm">{t("no_products")}</p>
        )}
      </div>
    </div>
  );
};

export default BusinessDropdown;
