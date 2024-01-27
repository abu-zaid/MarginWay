import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractDescription,
  extractPrice,
  getDiscountRate,
  getFlipkartCategory,
  getWebsiteFromURL,
} from "../util";
import getHTMLFromURL from "../puppeteer";

export async function scrapeProduct(url: string) {
  if (!url) return;

  try {
    // Fetch the product page
    const response = await getHTMLFromURL(url);
    console.log('resonse', response);
    const websiteName = getWebsiteFromURL(url);
    const $ = cheerio.load(response);

    if (websiteName === "Not found") {
      return;
    } else if (websiteName === "Amazon") {
      const title = $("#productTitle").text().trim() || $(".yhB1nd").text();
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
        $("#availability span")
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
      console.log(data);

      return data;
    } else if (websiteName === "Flipkart") {
      const title = $(".yhB1nd").text();
      const currentPrice = extractPrice($("._30jeq3._16Jk6d"));
      const originalPrice = extractPrice($("._3I9_wc._2p6lqe"));
      const outOfStock = false;
      const image = $(".CXW8mj._3nMexc img").attr("src") || "";
      const category = getFlipkartCategory($("._1MR4o5"));
      const description = $("._2418kt").text();
      const rating = $("._2d4LTz").text();
      const data = {
        url,
        title,
        currentPrice:
          Number(currentPrice) == 0
            ? Number(originalPrice)
            : Number(currentPrice),
        originalPrice:
          Number(originalPrice) == 0
            ? Number(currentPrice)
            : Number(originalPrice),
        outOfStock,
        currency: "₹",
        image,
        priceHistory: [],
        discountRate:
          getDiscountRate(parseInt(currentPrice), parseInt(originalPrice)) || 0,
        category,
        reviewsCount: 0,
        rating: parseFloat(rating) || 0,
        isOutOfStock: parseInt(currentPrice) == 0 ? true : false,
        description,
        stars: 0,
        lowestPrice: Number(currentPrice),
        highestPrice: Number(originalPrice),
        averagePrice: Number(currentPrice),
      };
      console.log(data);
      return data;
    }
  } catch (error: any) {
    throw new Error(`Failed to scrape product : ${error.message}`);
  }
}
