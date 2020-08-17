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

  // Check if player is a SBC
  await page.waitForSelector(".box_price");

  let sbcCheck = await page.evaluate(() => {
    // get the div which contain a text about SBC ("Estimated SBC price")
    const sbcText = document.querySelector(".estimated-price-sbc-text");
    // if the div exist, return the text
    if (sbcText) {
      return sbcText.innerText;
    }
    return;
  });

  // check if the SBC text exist
  if (sbcCheck) {
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
    const player = {
      name,
      rating,
      pos,
      psPrice,
      xbPrice,
      pcPrice,
    };
    return player;
  });

  await browser.close();
  return playerData;
};
