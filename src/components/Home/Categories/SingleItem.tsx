import { Category } from "@/types/api";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const SingleItem = ({ item }: { item: any }) => {
  // Use name and slug from GlobalCategory, or title and id from Category
  const title = item.name || item.title;
  const linkId = item.slug || item.id;
  
  // Icon mapping or default image
  let imageUrl = `https://s3.blackma.uz/blackma/${item.imageId}.png`;
  
  if (item.icon === "restaurant") {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/1046/1046747.png";
  } else if (item.icon === "food") {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/3081/3081840.png";
  } else if (item.icon === "shop") {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/862/862856.png";
  } else if (item.icon === "service") {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/1066/1066371.png";
  }

  return (
    <Link href={`/shop-with-sidebar?categoryId=${item.id}`} className="group flex flex-col items-center">
      <div 
        className="max-w-[130px] w-full h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-transparent transition-all duration-300 group-hover:border-blue/20"
        style={{ backgroundColor: item.color || "#F2F3F8" }}
      >
        <Image
          src={imageUrl}
          alt={title}
          width={82}
          height={62}
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
