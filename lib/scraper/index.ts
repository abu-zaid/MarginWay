import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../util";

export async function scrapeProduct(url: string) {
  if (!url) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_ip = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_ip}`,
      password: password,
    },
    host: "brd.superproxy.io",
    port: port,
    rejectUnauthorized: false,
  };

  try {
    //Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $(".a-price.a-text-price .a-offscreen"),
      $("#priceblock_ourprice"),
      $("#listPrice"),
      $(".a-size-base.a-color-price")
    );
    const outOfStock =
      $("#outOfStock")
        .text()
        .trim()
        .toLowerCase()
        .includes("currently unavailable") ||
      $("#availibility span")
        .text()
        .trim()
        .toLowerCase()
        .includes("currently unavailable");
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const description = extractDescription($);
    const data = {
      url,
      title,
      currentPrice: Number(currentPrice),
      originalPrice: Number(originalPrice),
      outOfStock,
      currency,
      image: imageUrls[0],
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "Category",
      reviewsCount: 0,
      rating: 0,
      isOutOfStock: outOfStock,
      description,
      stars: 0,
      lowestPrice: Number(currentPrice),
      highestPrice: Number(originalPrice),
      averagePrice: Number(currentPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product : ${error.message}`);
  }
}
