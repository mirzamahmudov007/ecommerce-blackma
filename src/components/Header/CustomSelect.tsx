"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0] || { label: "Loading...", value: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options && options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="custom-select relative min-w-[150px]">
      <div
        className={`select-selected whitespace-nowrap cursor-pointer px-4 py-2.5 rounded-l-[5px] border border-gray-3 bg-gray-1 text-dark-5 text-custom-sm font-medium flex items-center justify-between ${isOpen ? "select-arrow-active" : ""
          }`}
        onClick={toggleDropdown}
      >
        <span className="truncate mr-2">{selectedOption?.label}</span>
      </div>
      <div
        className={`select-items absolute left-0 top-full w-full mt-1 bg-white shadow-lg border border-gray-3 rounded-md z-99 overflow-hidden transition-all duration-200 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="max-h-[300px] overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`select-item px-4 py-2 hover:bg-gray-1 cursor-pointer text-custom-sm transition-colors duration-200 ${selectedOption?.value === option.value ? "bg-gray-1 text-blue font-bold" : "text-dark"
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
