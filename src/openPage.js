const {
  sleep,
  genScriptContent,
} = require('./util');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// puppeteer/DeviceDescriptors, If no device style, need to customize
const desktopDevice = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
  },
};

const openPage = async options => {
  const browser = await puppeteer.launch({
    headless: !options.debug,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
  });
  const page = await browser.newPage();
  const device = devices[options.device] || desktopDevice;
  await page.emulate(device);

  if (options.debug) {
    page.on('console', msg => console.log('PAGE LOG: ', msg.text()));
    page.on('warning', msg => console.log('PAGE WARN: ', JSON.stringify(msg)));
    page.on('error', msg => console.log('PAGE ERR: ', ...msg.args));
  }

  // Write cookies to solve the login status problem
  if (options.cookies && options.cookies.length) {
    await page.setCookie(...options.cookies);
    await page.cookies(options.pageUrl);
    await sleep(1000);
  }

  // open page
  await page.goto(options.pageUrl);

  // Get the packaged script in src/script
  const scriptContent = await genScriptContent();

  // Inject the script into the target page and get the global variable AwesomeSkeleton
  await page.addScriptTag({ content: scriptContent });

  // Waiting for page execution to complete
  await sleep(2000);

  return {
    page,
    browser,
  };
};

module.exports = openPage;
