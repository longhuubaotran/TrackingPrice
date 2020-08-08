const puppeteer = require("puppeteer");
const { response } = require("express");

module.exports = async (url) => {
  // Set up puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });

  // Check if page is 404
  if (response._status === 404) {
    return;
  }

  // this selector contains player price
  await page.waitForSelector("span[data-price]");

  // crawl data and parse price to number
  let playerData = await page.evaluate(() => {
    const psPrice = parseFloat(
      document
        .getElementById("ps-lowest-1")
        .getAttribute("data-price")
        .replace(/,/g, "")
    );
    const xbPrice = parseFloat(
      document
        .getElementById("xbox-lowest-1")
        .getAttribute("data-price")
        .replace(/,/g, "")
    );

    const pcPrice = parseFloat(
      document
        .getElementById("pc-lowest-1")
        .getAttribute("data-price")
        .replace(/,/g, "")
    );

    const name = document.querySelector(".pcdisplay-name").innerText;
    const rating = document.querySelector(".pcdisplay-rat").innerText;
    const pos = document.querySelector(".pcdisplay-pos").innerText;
    const player = { name, rating, pos, psPrice, xbPrice, pcPrice, link: url };
    return player;
  });

  await browser.close();
  return playerData;
};
