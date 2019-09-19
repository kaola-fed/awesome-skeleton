#!/usr/bin/env node


const {
  EOL,
} = require('os');
const path = require('path');
const program = require('commander');
const _ = require('xutil');
const updateNotifier = require('update-notifier');

const { chalk } = _;
const getSkeleton = require('../src');
const pkg = require('../package.json');

updateNotifier({
  pkg,
  updateCheckInterval: 5000, // 5s
}).notify();


program
  .option('--verbose', 'show more debugging information')
  .option('-c, --config <s>', 'set configuration file')
  .parse(process.argv);

let options = {};

if (program.config) {
  const configFile = path.resolve(program.config);

  if (_.isExistedFile(configFile)) {
    console.log(`${EOL}configuration file: ${chalk.cyan(configFile)}`);
    options = Object.assign(options, require(configFile));
  }
}

(async () => {
  try {
    await getSkeleton(options);

    const resultDir = path.join(process.cwd(), 'skeleton-output');
    console.log('result files save in: ', chalk.cyan(resultDir));
  } catch (error) {
    console.log(chalk.red(`${EOL}awesome-skeleton start unsuccessfully: ${error}${EOL}`));
    return;
  }
})();

