"use server";
const { chromium } = require("playwright");

const getHTMLFromURL = async (urlToScrape: string) => {
  try {
    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(urlToScrape);
    const elementContent = await page.evaluate(() => document.body.innerHTML);
    browser.close();
    return elementContent;
  } catch (error) {
    console.error("An error occurred while scraping the website: ", error);
    return "";
  }
};

export default getHTMLFromURL;
