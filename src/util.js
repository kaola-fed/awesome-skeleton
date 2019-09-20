const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

// sleep function
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Get the contents of the scr/script packaged script for injecting into the target page
const genScriptContent = async function() {
  const sourcePath = path.resolve(__dirname, './script/dist/index.js');
  const result = await promisify(fs.readFile)(sourcePath, 'utf-8');
  return result;
};

module.exports = {
  sleep,
  genScriptContent,
};
