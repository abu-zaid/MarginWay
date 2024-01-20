import { NextResponse } from "next/server";

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/util";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import cronJob from "@/app/defer/cronJob";

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const updatedProducts = await cronJob();
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}