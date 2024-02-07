"use server";
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer');

const getHTMLFromURL = async (urlToScrape: string) => {
  try {
    const browser = await puppeteer.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
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
