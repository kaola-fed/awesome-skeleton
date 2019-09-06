

const fs = require('fs');

const {
  saveScreenShot,
} = require('./saveFile');
const openPage = require('./openPage');
const insertSkeleton = require('./insertSkeleton');

/**
 * 入口函数
 * @param {Object} options 配置
 * @param {String} options.pageName 页面名称（仅限英文）
 * @param {String} options.pageUrl 页面地址（此地址必须可访问）
 * @param {String} options.outputPath 骨架图文件输出文件夹路径
 * @param {Boolean} options.openRepeatList 默认会将每个列表的第一项进行复制，默认值 true
 * @param {Object} options.device 参考 puppeteer/DeviceDescriptors.js
 * @param {Number} options.minGrayBlockWidth 最小处理灰色块的宽度
 * @param {Number} options.minGrayPseudoWidth 最小处理伪类宽度
 * @param {String} options.tinifyApiKey TINIFY_API_KEY https://tinypng.com/developers
 * @param {Boolean} options.debug 是否开启调试
 * @param {Number} options.delayTime 延迟打开页面时间，用户处理登录等操作
 * @param {Number} options.debugTime 调试模式下，页面停留在骨架图的时间
 */
const getSkeleton = async function(options) {
  // 参数校验
  if (!options.pageName || !options.pageUrl || !options.outputPath) {
    console.warning('参数不能为空！');
    return false;
  }

  // 若不存在 output 目录，创建目录
  if (options.outputPath && !fs.existsSync(options.outputPath)) {
    fs.mkdirSync(options.outputPath);
  }

  // 打开连接
  const { page, browser } = await openPage(options);

  // 处理页面为骨架图页面
  await page.evaluate(async options => {
    await window.AwesomeSkeleton.genSkeleton(options);
  }, options);

  // 截图并保存为 png 和 base64 txt 文件
  const skeletonImageBase64 = await saveScreenShot(page, options);

  // 将骨架图注入要页面
  const skeletonHTML = insertSkeleton(skeletonImageBase64, options);

  // 关闭浏览器
  await browser.close();

  return skeletonHTML;
};

module.exports = getSkeleton;
