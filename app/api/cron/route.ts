import { getAllProducts } from "@/lib/actions";
import Product from "@/lib/models/product.model";
import { connectToDatabase } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/util";
import { NextResponse } from "next/server";
export const maxDuration = 300;
export const dynamic = 'force-dynamic';
export const revalidate =0;
export async function GET() {
  try {
    connectToDatabase();
    const products = await getAllProducts();
    if (!products) throw new Error("No products");

    //scrape latest products and update db
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct: any) => {
        const scrapedProduct = await scrapeProduct(currentProduct.url);
        if (!scrapedProduct) throw new Error("Failed to scrape product");
        const updatedPriceHistory: any = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product
        );

        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = generateEmailBody(productInfo, emailNotifType);

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );

          await sendEmail(emailContent, userEmails)
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
        message:'OK',
        data: updatedProducts
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
