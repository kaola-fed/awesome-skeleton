const {
  sleep,
  genScriptContent,
} = require('./util');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

// puppeteer/DeviceDescriptors 没有桌面样式，需要自定义
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

  // 延迟打开页面，用来处理登录，写入 session/cookie
  await sleep(options.delayTime || 0);

  await page.goto(options.pageUrl);

  // 写入 cookie，解决登录态问题
  if (options.cookies && options.cookies.length) {
    await page.setCookie(...options.cookies);
    await page.cookies(options.pageUrl);
    await sleep(1000)
    await page.goto(options.pageUrl);
  }

  // 获取 src/script 中打包后的脚本
  const scriptContent = await genScriptContent();

  // 将脚本注入到目标页面中，拿到全局变量 AwesomeSkeleton
  await page.addScriptTag({ content: scriptContent });

  // 等待页面执行完成
  await sleep(2000);

  return {
    page,
    browser,
  };
};

module.exports = openPage;
