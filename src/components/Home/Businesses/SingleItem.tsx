import React from "react";
import { Business } from "@/types/api";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const SingleItem = ({ item }: { item: Business }) => {
  return (
    <div className="group bg-white rounded-lg border border-gray-3 p-2 transition-all duration-300 hover:shadow-lg">
      <div
        className="relative w-full aspect-square rounded-md overflow-hidden mb-4 flex items-center justify-center"
      >
        <div className="relative w-4/5 h-4/5">
          <Image
            src={item.logo.filename}
            alt={item.name}
            fill
            className="object-contain transition-transform duration-500 "
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <h3 className="font-semibold text-dark text-lg mb-1 leading-tight group-hover:text-blue transition-colors duration-300">
          {item.name}
        </h3>
        <p className="text-dark-5 text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        <Link
          href={`/shop-with-sidebar?businessId=${item.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark hover:text-blue transition-colors duration-300 bg-gray-1 py-2 px-3 rounded w-fit"
        >
          Mahsulotlar
          <svg
            className="fill-current w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.4767 6.16708L6.00686 10.6369C5.9145 10.7292 5.82215 10.7754 5.72979 10.7754C5.63744 10.7754 5.54508 10.7292 5.45272 10.6369C5.26801 10.4522 5.26801 10.1523 5.45272 9.9676L9.11717 6.30315H1.20001C0.93847 6.30315 0.730774 6.09545 0.730774 5.83391C0.730774 5.57237 0.93847 5.36467 1.20001 5.36467H9.11717L5.45272 1.70022C5.26801 1.51551 5.26801 1.21565 5.45272 1.03093C5.63744 0.846224 5.9373 0.846224 6.12201 1.03093L10.5919 5.50082C10.7073 5.6162 10.7765 5.73158 10.7765 5.83391C10.7765 5.97237 10.7073 6.08775 10.5919 6.20313C10.5457 6.24928 10.4996 6.16708 10.4767 6.16708Z"
              fill=""
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SingleItem;
