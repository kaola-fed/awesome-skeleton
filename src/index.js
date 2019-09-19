const fs = require('fs');
const path = require('path');

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
 * @param {String} options.outputPath 骨架图文件输出文件夹路径，不填则输出到默认项目
 * @param {Boolean} options.openRepeatList 默认会将每个列表的第一项进行复制，默认值 true
 * @param {Object} options.device 参考 puppeteer/DeviceDescriptors.js
 * @param {Number} options.minGrayBlockWidth 最小处理灰色块的宽度
 * @param {Number} options.minGrayPseudoWidth 最小处理伪类宽度
 * @param {Boolean} options.debug 是否开启调试
 * @param {Number} options.debugTime 调试模式下，页面停留在骨架图的时间
 */
const getSkeleton = async function(options) {
  // 参数校验
  if (!options.pageUrl) {
    console.warn('页面地址不能为空！');
    return false;
  }

  // 设置默认参数
  options.pageName = options.pageName ? options.pageName : 'output';
  options.outputPath = options.outputPath ? options.outputPath : path.join('skeleton-output');

  // 若不存在 output 目录，创建目录
  if (!fs.existsSync(options.outputPath)) {
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
  const result = insertSkeleton(skeletonImageBase64, options);

  // 关闭浏览器
  await browser.close();

  return result;
};

module.exports = getSkeleton;
