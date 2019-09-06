import {
  BUTTON_CLASS,
  MAIN_COLOR,
} from '../constants';

function buttonHandler(node) {
  if (!node.tagName) return;

  node.classList.add(BUTTON_CLASS);

  let { backgroundColor: bgColor, width, height } = getComputedStyle(node);

  bgColor = bgColor === 'rgba(0, 0, 0, 0)' ? MAIN_COLOR : bgColor;

  node.style.backgroundColor = bgColor;
  node.style.color = bgColor;
  node.style.borderColor = bgColor;
  node.style.width = width;
  node.style.height = height;

  // 清空按钮内容
  node.innerHTML = '';
}

export default buttonHandler;
