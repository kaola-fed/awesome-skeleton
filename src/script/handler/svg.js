import {
  px2rem,
  removeElement,
} from '../util';

function svgHandler(node) {
  const { width, height } = node.getBoundingClientRect();

  // 元素不可见则移除
  if (width === 0 || height === 0 || node.getAttribute('aria-hidden') === 'true') {
    return removeElement(node);
  }

  // 清空元素内容
  node.innerHTML = '';

  // 设置样式
  Object.assign(node.style, {
    width: px2rem(parseInt(width)),
    height: px2rem(parseInt(height)),
  });
}

export default svgHandler;
