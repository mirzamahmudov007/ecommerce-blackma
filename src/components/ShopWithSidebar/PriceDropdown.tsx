"use client";
import { useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useTranslations } from "next-intl";

interface PriceDropdownProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceDropdown = ({ minPrice = 0, maxPrice = 1000, onPriceChange }: PriceDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const t = useTranslations();

  const [selectedPrice, setSelectedPrice] = useState({
    from: minPrice,
    to: maxPrice,
  });

  const handleInput = (e: any) => {
    const from = Math.floor(e[0]);
    const to = Math.ceil(e[1]);
    setSelectedPrice({ from, to });
  };

  const handleThumbEnd = (e: any) => {
    const from = Math.floor(e[0]);
    const to = Math.ceil(e[1]);
    onPriceChange(from, to);
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
      >
        <p className="text-dark">{t("price")}</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          id="price-dropdown-btn"
          aria-label="button for price dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && 'rotate-180'
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

      <div className={`p-6 ${toggleDropdown ? 'block' : 'hidden'}`}>
        <div id="pricingOne">
          <div className="price-range">
            <RangeSlider
              id="range-slider-gradient"
              className="margin-lg"
              step={10}
              min={0}
              max={1000000} // Assuming a larger range for actual prices
              value={[selectedPrice.from, selectedPrice.to]}
              onInput={handleInput}
              onThumbDragEnd={handleThumbEnd}
            />

            <div className="price-amount flex items-center justify-between pt-4">
              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  SUM
                </span>
                <span id="minAmount" className="block px-3 py-1.5">
                  {selectedPrice.from.toLocaleString()}
                </span>
              </div>

              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  SUM
                </span>
                <span id="maxAmount" className="block px-3 py-1.5">
                  {selectedPrice.to.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDropdown;
