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
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProducts([]);
      setSearchCompleted(false);
      setSearching(true);
      setProductsFound(false);
      console.log("in handle search");
      
      // Assuming findProducts returns a stringified array of products
      const productsString = await findProducts(searchPrompt);
      const parsedProducts = JSON.parse(productsString);
      
      if (parsedProducts.length > 0) {
        console.log("products found", parsedProducts.length);
        setProducts(parsedProducts);
        setProductsFound(true);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setSearchCompleted(true);
      setSearching(false);
    }
  };

  return (
    <>
      <div className="flex flex-col align-middle h-[90vh] w-full">
        <div className="px-4">
          <form
            onSubmit={handleSearch}
            className="flex -flex-wrap mt-10 justify-center"
          >
            <input
              className="searchbar text-[16px]"
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
              {searching ? (
                <BarLoader loading={searching} color="white" width={90} />
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
        {searchCompleted && !productsFound && (
          <p className="text-center text-3xl mt-10 font-semibold text-slate-500">
            No products found..
          </p>
        )}
        {!searchCompleted && !searching &&(
          <p className="text-center text-3xl mt-10 font-semibold text-slate-500">
            Search a product..
          </p>
        )}
      </div>
    </>
  );
};

export default search;
