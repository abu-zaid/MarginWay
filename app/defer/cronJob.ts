// the `defer()` helper will be used to define a background function
import Product from "@/lib/models/product.model";
import { connectToDatabase } from "@/lib/mongoose";
import { generateEmailBody } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/util";
import { defer } from "@defer/client";
import sendEmail from "@/app/defer/mailer";

// a background function must be `async`
async function cronJob() {
  const connection = await connectToDatabase();
  if (connection) {
    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Scrape product

        const scrapedProduct = await scrapeProduct(currentProduct.url);

        if (!scrapedProduct) return;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
          },
        ];

        let product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Check if product is out of stock, if so, don't update price history
        if (scrapedProduct.isOutOfStock) {
          product = {
            ...product,
            priceHistory: currentProduct.priceHistory, // Keep the existing price history
          };
        }

        // Update Products in DB

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
        if (currentProduct.priceHistory.length > 0) {
          const emailNotifType = getEmailNotifType(
            scrapedProduct,
            currentProduct
          );

          if (emailNotifType && updatedProduct.users.length > 0) {
            const productInfo = {
              image: updatedProduct.image,
              title: updatedProduct.title,
              url: updatedProduct.url,
              currency: updatedProduct.currency,
            };
            // Construct emailContent
            const emailContent = generateEmailBody(productInfo, emailNotifType.notification, emailNotifType.thresholdAmount);
            // Get array of user emails
            const userEmails = updatedProduct.users.map(
              (user: any) => user.email
            );
            // Send email notification
            await sendEmail(emailContent, userEmails);
          }
        }
        return updatedProduct;
      })
    );
  }
}

export default defer(cronJob);
