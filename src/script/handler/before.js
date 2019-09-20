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

  // Handling empty elements of user tags
  if (hasAttr(node, 'data-skeleton-empty')) {
    handlerEmpty(node);
  }

  // Width is less than the hiding threshold
  const { width } = node.getBoundingClientRect();
  if (width < options.minGrayBlockWidth) {
    setOpacity(node);
  }

  const ComputedStyle = getComputedStyle(node);

  // The background image is changed to the main color
  if (ComputedStyle.backgroundImage !== 'none') {
    node.style.backgroundImage = 'none';
    node.style.background = MAIN_COLOR;
  }

  // The Shadow is changed to the main color
  if (ComputedStyle.boxShadow !== 'none') {
    const oldBoxShadow = ComputedStyle.boxShadow;
    const newBoxShadow = oldBoxShadow.replace(/^rgb.*\)/, MAIN_COLOR_RGB);
    node.style.boxShadow = newBoxShadow;
  }

  // The border is changed to the main color
  if (ComputedStyle.borderColor) {
    node.style.borderColor = MAIN_COLOR;
  }

  // Set the background color of the user class
  const bgColor = node.getAttribute('data-skeleton-bgcolor');
  if (bgColor) {
    node.style.backgroundColor = bgColor;
    node.style.color = 'transparent';
  }
}

export default beforeHandler;
