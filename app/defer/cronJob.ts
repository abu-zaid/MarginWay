// the `defer()` helper will be used to define a background function
import Product from "@/lib/models/product.model";
import { connectToDatabase } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/util";
import { defer } from "@defer/client";

// a background function must be `async`
async function cronJob() {
    const connection = await connectToDatabase();
    console.log('db connection in cron',connection);
    if (connection){
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
    
            const product = {
              ...scrapedProduct,
              priceHistory: updatedPriceHistory,
              lowestPrice: getLowestPrice(updatedPriceHistory),
              highestPrice: getHighestPrice(updatedPriceHistory),
              averagePrice: getAveragePrice(updatedPriceHistory),
            };
    
            // Update Products in DB
            const updatedProduct = await Product.findOneAndUpdate(
              {
                url: product.url,
              },
              product
            );
    
            // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
            const emailNotifType = getEmailNotifType(
              scrapedProduct,
              currentProduct
            );
    
            if (emailNotifType && updatedProduct.users.length > 0) {
              const productInfo = {
                title: updatedProduct.title,
                url: updatedProduct.url,
              };
              // Construct emailContent
              const emailContent = generateEmailBody(productInfo, emailNotifType);
              // Get array of user emails
              const userEmails = updatedProduct.users.map((user: any) => user.email);
              // Send email notification
              await sendEmail(emailContent, userEmails);
            }
    
            return updatedProduct;
          })
        );
    }
}

export default defer(cronJob);