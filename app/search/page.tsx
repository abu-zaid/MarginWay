"use client";
import SearchCard from "@/components/SearchCard";
import { findProducts } from "@/lib/actions";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/types";
import React, { FormEvent, useState } from "react";
import { BarLoader } from "react-spinners";

const search = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [productsFound, setProductsFound] = useState(false);
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("in handle search");
      const productsString = await findProducts(searchPrompt);
      setProducts(JSON.parse(productsString));
      setProductsFound(true);
      console.log(products);
    } catch (error: any) {
      console.log(error.message);
    } finally {
    }
  };
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col  align-middle h-[90vh] w-full">
      <div className="px-4">
        <form
          onSubmit={handleSearch}
          className="flex -flex-wrap mt-10 justify-center"
        >
          <input
            className="searchbar"
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search..."
          />
          <button
            type="submit"
            className="search-btn"
            disabled={searchPrompt === ""}
          >
            {isLoading ? (
              <BarLoader loading={isLoading} color="white" width={90} />
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>
      {products.length > 0 && (
        <div className="flex flex-col w-full align-middle items-center max-h-[85%] overflow-auto mt-2 scrollbar-hide px-2">
          {products?.map((product) => (
            <SearchCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default search;
