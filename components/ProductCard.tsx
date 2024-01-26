import { getWebsiteFromURL } from "@/lib/util";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  const websiteName = getWebsiteFromURL(product.url);
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <div className="flex gap-2 justify-start items-end">
            <p className="text-xs text-slate-200 font-medium bg-slate-400 px-2 py-1 rounded-lg">
              {websiteName}
            </p>
            <p className="text-black text-sm opacity-50 capitalize">
              {product.category}
            </p>
          </div>
          {!product.isOutOfStock && product.currentPrice != 0 && (
            <p className="text-black text-lg font-semibold">
              <span>{product.currency}</span>
              <span>{product.currentPrice}</span>
            </p>
          )}
          {(product.isOutOfStock || product.currentPrice === 0) && (
            <p className="text-teal-800 text-lg font-semibold">
              <span>Out Of Stock!</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
