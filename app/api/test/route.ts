import type { NextApiRequest, NextApiResponse } from "next";
// we import our `helloWorld()` background function
import helloWorld from "../../defer/helloWorld"

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    await helloWorld("Charly");

    return NextResponse.json({
      message: "Ok",
    });
  } catch (error: any) {
    throw new Error(`Failed to run test: ${error.message}`);
  }
}