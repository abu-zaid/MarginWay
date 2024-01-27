import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
  DEFAULT: "DEFAULT",
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d+]/g, "");

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return "";
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(...elements: any) {
 
  for (const element of elements) {
     const currencyText = element.text().trim().slice(0, 1);
     return currencyText;
  }
  return "";
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }
  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price ? lowestPrice.price : priceList[0].price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
): {
  notification: keyof typeof Notification | "DEFAULT";
  thresholdAmount: number | null;
} => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  let notification: keyof typeof Notification | "DEFAULT" = "DEFAULT";
  let thresholdAmount: number | null = null;

  // Check if scrapedProduct.users is defined and not null
  if (currentProduct.users) {
    // Iterate through each user in the scrapedProduct
    for (const user of currentProduct.users) {
      const userThreshold = user.thresholdAmount;
      // Check if the current price is lower than the user's threshold
      if (scrapedProduct.currentPrice < userThreshold) {
        notification = "THRESHOLD_MET"; // Adjusted to match the enum value
        thresholdAmount = userThreshold;
        return { notification, thresholdAmount };
      }
    }
  } else {
    console.log("No users found for this product");
  }

  // If no user's threshold is met, check for other notification types
  if (scrapedProduct.currentPrice < lowestPrice) {
    notification = "LOWEST_PRICE"; // Adjusted to match the enum value
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    notification = "CHANGE_OF_STOCK"; // Adjusted to match the enum value
  }

  return { notification, thresholdAmount };
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getWebsiteFromURL = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;
    const sites: Record<string, string> = {
      amazon: "Amazon",
      flipkart: "Flipkart",
      myntra: "Myntra",
      ajio: "Ajio",
      bigbasket: "Bigbasket",
      lenskart: "Lenskart",
    };

    for (const site in sites) {
      if (hostName.includes(site)) {
        return sites[site];
      }
    }

    return "Not found"; // If the hostname doesn't match any known site
  } catch (error) {
    console.error("Error parsing URL:", error);
    return "Not found"; // Return null in case of any errors
  }
};

export const getDiscountRate = (currentPrice : number, originalPrice : number) => {
  // Calculate the discount rate
  const discountRate = ((originalPrice - currentPrice) / originalPrice) * 100;

  // Return the discount rate rounded to 2 decimal places
  return parseInt(discountRate.toFixed(2));
};

export function getFlipkartCategory(parentDiv:any) {
  // Find all child div elements with class "_3GIHBu" within the parent div
  const childDivs = parentDiv.find('._3GIHBu');

  // Extract the text from the second div (index 1, since indexing starts from 0)
  const categoryText = childDivs.eq(1).text().trim();

  return categoryText;
}