"use server";
import puppeteer, { Browser } from "puppeteer";

const getHTMLFromURL = async (urlToScrape: string) => {
  try {
    const browser: Browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(urlToScrape);
    const elementContent = await page.evaluate(() => (document.body.innerHTML));
    browser.close();
    return elementContent;
  } catch (error) {
    console.error("An error occurred while scraping the website: ", error);
    return '';
  }
};

export default getHTMLFromURL;
