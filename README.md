# awesome-skeleton

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency status][daviddm-image]][daviddm-url]

> Skeleton generation tool

English | [简体中文](./README-zh_CN.md)

## Effect preview

View online effects: [Kaola cart](https://m-buy.kaola.com/cart.html):

![kaola skeleton](https://user-images.githubusercontent.com/11460601/65293821-19225f00-db8f-11e9-802f-ef34458e9c58.jpg)

## Description
* skeleton generation component, only for the node side. This component provides two capabilities for skeleton generation and skeleton template injection.
* Skeletal diagram generation logic: Open the page address by using the Puppeteer headless browser by passing in the page address, perform gray background processing on the first screen image and text of the page, and then take a screenshot of the first screen of the page to generate a compressed base64 png image.

## Installation

### Global installation

```bash
$ npm i awesome-skeleton -g
```

### Installation in the project
```bash
$ npm i awesome-skeleton -D
```

## Instructions

### Adding a configuration file

skeleton.config.json:

```json
{
  "pageName": "baidu",
  "pageUrl": "https://www.baidu.com",
  "openRepeatList": false,
  "device": "iPhone X",
  "minGrayBlockWidth": 80,
  "minGrayPseudoWidth": 10,
  "debug": true,
  "debugTime": 3000,
  "cookies": [
    {
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
    }
  ]
}
```

### Globally generated skeleton

```bash
$ skeleton -c ./skeleton.config.json
```

After the page DomReady, a red button appears at the top of the page: Start generating the skeleton screen.

After the build is complete, a skeleton-output file is generated in the run directory, which includes the skeleton screen png image, base64 text, and html file:
- base64-baidu.png # skeleton picture
- base64-baidu.txt # skeleton diagram Base64 encoding
- base64-baidu.html # Final HTML generationL

The html file can be used directly, copy the following location:

```html
<html>
  <head>
    <!--- skeleton html code -->
  </head>
</html>
```

note:
- The skeleton is destroyed by default after the ons event 1s.
- Manual destruction method：

```js
window.SKELETON && SKELETON.destroy();
```

**Of course, you can also use the generated Base64 image directly in your project**

### Creating a skeleton screen in the project

Add a script to package.json :

```json
"scripts": {
   "skeleton": "skeleton -c ./skeleton.config.json"
}
```

Generate skeleton screen:：

```bash
$ npm run skeleton
```

### Solve the login status

If the page requires a login, you'll need to download the Chrome plugin [EditThisCookie] (https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg) to copy the cookie into the configuration parameters.

## Parameters

| Parameter Name | Required | Default | Description |
| --- | --- | --- | --- |
| pageUrl | Yes | - | Page address (this address must be accessible) |
| pageName | no | output | page name (English only) |
| cookies | no | | page cookies to resolve login status issues |
OutputPath | no | skeleton-output | skeleton file output folder path, default to project skeleton-output |
| openRepeatList | no | true | by default will copy the first item of each list |
| device | no | empty for PC | reference puppeteer/DeviceDescriptors.js, can be set to 'iPhone 6 Plus' |
| debug | no | false | turn on debug switch |
| debugTime | No | 0 | Time in the debug mode, the page stays in the skeleton |
| minGrayBlockWidth | No | 0 | Minimum processing width of gray blocks |
| minGrayPseudoWidth | No | 0 | Minimum processing pseudo-class width |

## dom node attribute

This is the main point of obtaining a high-quality skeleton. By setting the following dom node attributes, some nodes are removed, ignored, and specified in the skeleton to remove the interference of redundant nodes, thus making the skeleton effect Get the best.

| Parameter Name | Description |
| --- | --- |
| data-skeleton-remove | Specifies the dom node properties to remove |
| data-skeleton-bgcolor | Specify the background color added in a dom node |
| data-skeleton-ignore | Specifies to ignore dom node properties without any processing |
| data-skeleton-empty | Set a dom's innerHTML to an empty string |

Example:

```html
<div data-skeleton-remove><span>abc</span></div>
<div data-skeleton-bgcolor="#EE00EE"><span>abc</span></div>
<div data-skeleton-ignore><span>abc</span></div>
<div data-skeleton-empty><span>abc</span></div>
```

## Contributing

### Installation dependencies

```bash
$ git clone git@github.com:kaola-fed/awesome-skeleton.git
$ cd awesome-skeleton && npm i
```

### Running the project

Since the code that generates the skeleton is inserted through dynamic scripts, the code in src/script needs to be packaged into src/script/dist/index.js by Rollup.

```bash
$ npm run dev
```

Modify the configuration in demo/index.js to generate a skeleton of the different pages:

```bash
$ cd demo
$ node index.js
```

# Thanks

- [puppeteer](https://github.com/GoogleChrome/puppeteer)
- [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin)

[npm-image]: https://img.shields.io/npm/v/awesome-skeleton.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/awesome-skeleton
[travis-image]: https://img.shields.io/travis/kaola-fed/awesome-skeleton/master.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/kaola-fed/awesome-skeleton
[daviddm-image]: https://img.shields.io/david/kaola-fed/awesome-skeleton.svg?style=flat-square
[daviddm-url]: https://david-dm.org/kaola-fed/awesome-skeleton
