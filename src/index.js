const fs = require('fs');
const path = require('path');

const {
  saveScreenShot,
} = require('./saveFile');
const openPage = require('./openPage');
const insertSkeleton = require('./insertSkeleton');

/**
 * Entry function
 * @param {Object} options Configuration
 * @param {String} options.pageName Page name (English only)
 * @param {String} options.pageUrl Page URL (must be accessible)
 * @param {String} options.outputPath Skeleton map file output folder path, output to the default project without filling
 * @param {Boolean} options.openRepeatList The first item of each list is copied by default, the default value is true
 * @param {Object} options.device reference puppeteer/DeviceDescriptors.js
 * @param {Number} options.minGrayBlockWidth Minimum processing width of gray blocks
 * @param {Number} options.minGrayPseudoWidth Minimum processing pseudo-class width
 * @param {Boolean} options.debug Whether to turn on debug mode
 * @param {Number} options.debugTime In debug mode, the time the page stays in the skeleton diagram
 */
const getSkeleton = async function(options) {
  // Parameter check
  if (!options.pageUrl) {
    console.warn('页面地址不能为空！');
    return false;
  }

  // Set default parameters
  options.pageName = options.pageName ? options.pageName : 'output';
  options.outputPath = options.outputPath ? options.outputPath : path.join('skeleton-output');

  // Create directory if there is no output directory
  if (!fs.existsSync(options.outputPath)) {
    fs.mkdirSync(options.outputPath);
  }

  // Open URL
  const { page, browser } = await openPage(options);

  // Processing the page as a skeleton page
  await page.evaluate(async options => {
    await window.AwesomeSkeleton.genSkeleton(options);
  }, options);

  // Screenshot and save as png and base64 txt files
  const skeletonImageBase64 = await saveScreenShot(page, options);

  // Inject the skeleton into the desired page
  const result = insertSkeleton(skeletonImageBase64, options);

  // Close the browser
  await browser.close();

  return result;
};

module.exports = getSkeleton;
