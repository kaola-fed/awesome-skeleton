// 睡眠函数
export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 检查节点是否在首屏中
export const inViewPort = ele => {
  try {
    const rect = ele.getBoundingClientRect();
    return rect.top < window.innerHeight &&
      rect.left < window.innerWidth;

  } catch (e) {
    return true;
  }
};

// 判断节点是否存在属性
export const hasAttr = (ele, attr) => {
  try {
    return ele.hasAttribute(attr);
  } catch (e) {
    return false;
  }
};

// 设置节点透明
export const setOpacity = ele => {
  if (ele.style) {
    ele.style.opacity = 0;
  }
};

// 单位转换 px -> rem
export const px2rem = px => {
  const pxValue = typeof px === 'string' ? parseInt(px, 10) : px;
  const htmlElementFontSize = getComputedStyle(document.documentElement).fontSize;

  return `${(pxValue / parseInt(htmlElementFontSize, 10))}rem`;
};

// 批量设置元素属性
export const setAttributes = (ele, attrs) => {
  Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]));
};

// 删除元素
export const removeElement = ele => {
  const parent = ele.parentNode;
  if (parent) {
    parent.removeChild(ele);
  }
};

// 检查元素伪类，返回对应元素和宽度
export const checkHasPseudoEle = ele => {
  if (!ele) return false;

  const beforeComputedStyle = getComputedStyle(ele, '::before');
  const beforeContent = beforeComputedStyle.getPropertyValue('content');
  const beforeWidth = parseFloat(beforeComputedStyle.getPropertyValue('width'), 10) || 0;
  const hasBefore = beforeContent && beforeContent !== 'none';

  const afterComputedStyle = getComputedStyle(ele, '::after');
  const afterContent = afterComputedStyle.getPropertyValue('content');
  const afterWidth = parseFloat(afterComputedStyle.getPropertyValue('width'), 10) || 0;
  const hasAfter = afterContent && afterContent !== 'none';

  const width = Math.max(beforeWidth, afterWidth);

  if (hasBefore || hasAfter) {
    return { hasBefore, hasAfter, ele, width };
  }
  return false;
};
