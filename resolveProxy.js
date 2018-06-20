// TODO: Find a way to use something other than puppeteer
const puppeteer = require('puppeteer')

module.exports = async (url) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto(url);

  const realHref = page.url()
	
  await browser.close();

  return realHref
}

