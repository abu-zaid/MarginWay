import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  product: Product;
}
const SearchCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="w-3xl max-w-3xl rounded-lg cursor-pointer">
        <div className="flex flex-1  p-2 bg-slate-50 rounded-lg mb-2 w-full">
          <div className="flex p-2 justify-start">
            <Image
              src={product.image}
              alt={product.title}
              width={150}
              height={150}
              className="rounded-lg object-contain w-32 h-32"
            />
          </div>
          <div className="flex flex-col flex-1 px-4 py-2 w-full">
            <div className="flex-1 w-full">
              <h3 className="text-sm">
                {product.title.substring(0, 50).concat("...")}
              </h3>
              <p className="text-sm text-gray-400">{product.category}</p>
            </div>
            {!product.isOutOfStock && (
              <div className="flex gap-2 items-baseline justify-end">
                <p className="line-through text-sm text-red-500">
                  <span>{product.currency}</span>
                  {product.originalPrice.toString().slice(0, 7)}
                </p>
                <p>
                  <span>{product.currency}</span>
                  {product.currentPrice}
                </p>
              </div>
            )}
            {product.isOutOfStock && (
              <div className="flex gap-2 items-baseline justify-end">
                <p className="text-red-500 text-sm">
                  Out Of stock
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchCard;
