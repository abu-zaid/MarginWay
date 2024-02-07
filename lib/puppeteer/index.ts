"use server";
const puppeteer = require('puppeteer-extra') 
const pluginStealth = require('puppeteer-extra-plugin-stealth') 
const {executablePath} = require('puppeteer'); 
puppeteer.use(pluginStealth()) 
const getHTMLFromURL = async (urlToScrape: string) => {

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath() 
    });

    const page = await browser.newPage();

    await page.goto(urlToScrape);
    const elementContent = await page.evaluate(() => document.body.innerHTML);
    console.log("elementContent", elementContent);
    browser.close();
    return elementContent;
  } catch (error) {
    console.error("An error occurred while scraping the website: ", error);
    return "";
  }
};

export default getHTMLFromURL;
