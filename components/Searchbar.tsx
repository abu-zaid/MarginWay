"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BarLoader } from "react-spinners";

const isValidLink = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;
    if (hostName.includes("amazon.") || hostName.includes("amazon.")) {
      return true;
    }
  } catch (error) {
    return false;
    console.log(error);
  }
  return false;
};
const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = isValidLink(searchPrompt);
    if (!isValid) return alert("Please provide a valid link!");
    let product_id = null;
    try {
      setIsLoading(true);
      // TODO: Scrape
      product_id = await scrapeAndStoreProduct(searchPrompt);
      console.log(product_id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    router.push(`/products/${product_id}`);

  };
  return (
    <form className="flex -flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter Product Link"
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? (
          <BarLoader loading={isLoading} width="7rem" color="white" />
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};

export default Searchbar;
