const getSkeleton = require('../src/index');

getSkeleton({
  pageName: 'baidu',
  pageUrl: 'https://www.baidu.com',
  openRepeatList: false,
  device: 'iPhone X', // 为空则使用默认 PC 页面打开
  minGrayBlockWidth: 80,
  minGrayPseudoWidth: 10,
  debug: true,
  cookies: [{
    "domain": ".baidu.com",
    "expirationDate": 3708990421.619608,
    "hostOnly": false,
    "httpOnly": false,
    "name": "BAIDUID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "xxxxxxxxx",
    "id": 1
  }, {
    "domain": ".baidu.com",
    "expirationDate": 1568267131.555328,
    "hostOnly": false,
    "httpOnly": false,
    "name": "BDORZ",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "yyyyyyyyy",
    "id": 2
  }],
  delayTime: 0,
  debugTime: 0,
}).then(result => {
  console.log(result.html)
})

