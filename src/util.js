const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

// 睡眠函数
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 获取 scr/script 打包后的脚本内容，用来注入到目标页面中
const genScriptContent = async function() {
  const sourcePath = path.resolve(__dirname, './script/dist/index.js');
  const result = await promisify(fs.readFile)(sourcePath, 'utf-8');
  return result;
};

module.exports = {
  sleep,
  genScriptContent,
};
