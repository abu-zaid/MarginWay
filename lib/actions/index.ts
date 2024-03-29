"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeProduct } from "../scraper";
import { EmailContent, User } from "@/types";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../util";
import { redirect } from "next/navigation";
import { generateEmailBody } from "../nodemailer";
import sendEmail from "@/app/defer/mailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDatabase();

    const scrapedProduct = await scrapeProduct(productUrl);
    
    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
      return existingProduct._id;
    }

    if (scrapedProduct.isOutOfStock) {
      product = {
        ...product,
        priceHistory: existingProduct.priceHistory, // Keep the existing price history
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
    return newProduct._id;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDatabase();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    await connectToDatabase();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}
export async function findProducts(productTitle: string) {
  try {
    await connectToDatabase();

    const products = await Product.find({
      title: { $regex: productTitle, $options: "i" },
    }).lean();

    return JSON.stringify(products); // products;
  } catch (error) {
    console.log(error);
  }
  return "";
}

export async function getSimilarProducts(productId: string) {
  try {
    await connectToDatabase();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string,
  thresholdAmount: number | null = null
) {
  if (thresholdAmount === null) thresholdAmount = 0;
  try {
    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) return;

    // Check if the user already exists in the product's users array
    const userExistsIndex = product.users.findIndex(
      (user: any) => user.email === userEmail
    );

    // If the user exists, update their threshold amount
    if (userExistsIndex !== -1) {
      product.users[userExistsIndex].thresholdAmount = thresholdAmount;
    } else {
      // If the user doesn't exist, create a new user object
      const newUser = {
        email: userEmail,
        thresholdAmount: thresholdAmount,
      };

      // Push the new user object to the users array
      product.users.push(newUser);
    }

    // Save the updated product document
    await product.save();

    // Optionally, send an email to the user
    const emailContent = await generateEmailBody(product, "WELCOME");
    await sendEmail(emailContent, [userEmail]);
  } catch (error) {
    console.log(error);
  }
}