import {
  MAIN_COLOR,
  MAIN_COLOR_RGB,
} from '../constants';

import {
  hasAttr,
  setOpacity,
} from '../util';

import handlerEmpty from './empty.js';

function beforeHandler(node, options) {
  if (!node.tagName) return;

  // 处理用户标记的空元素
  if (hasAttr(node, 'data-skeleton-empty')) {
    handlerEmpty(node);
  }

  // 宽度小于阈值隐藏
  const { width } = node.getBoundingClientRect();
  if (width < options.minGrayBlockWidth) {
    setOpacity(node);
  }

  const ComputedStyle = getComputedStyle(node);

  // 背景图改为主色调
  if (ComputedStyle.backgroundImage !== 'none') {
    node.style.backgroundImage = 'none';
    node.style.background = MAIN_COLOR;
  }

  // 阴影调整为主色调
  if (ComputedStyle.boxShadow !== 'none') {
    const oldBoxShadow = ComputedStyle.boxShadow;
    const newBoxShadow = oldBoxShadow.replace(/^rgb.*\)/, MAIN_COLOR_RGB);
    node.style.boxShadow = newBoxShadow;
  }

  // 边框改为主色调
  if (ComputedStyle.borderColor) {
    node.style.borderColor = MAIN_COLOR;
  }

  // 设置用户标记的背景色
  const bgColor = node.getAttribute('data-skeleton-bgcolor');
  if (bgColor) {
    node.style.backgroundColor = bgColor;
    node.style.color = 'transparent';
  }
}

export default beforeHandler;
