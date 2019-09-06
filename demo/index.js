const path = require('path');
const getSkeleton = require('../src/index');

getSkeleton({
  pageName: 'baidu',
  pageUrl: 'https://www.baidu.com',
  outputPath: path.join(__dirname, 'output'),
  openRepeatList: false,
  device: 'iPhone X', // 为空则使用默认 PC 页面打开
  minGrayBlockWidth: 80,
  minGrayPseudoWidth: 10,
  debug: false,
  delayTime: 0,
  debugTime: 1000,
}).then(result => {
  console.log(result)
})

