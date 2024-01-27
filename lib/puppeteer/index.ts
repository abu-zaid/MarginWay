"use server";
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');

const getHTMLFromURL = async (urlToScrape: string) => {
  try {
    const browser = await puppeteer.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        ),
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
