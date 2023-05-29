import puppeteer from 'puppeteer';

export const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });

  return browser;
};
