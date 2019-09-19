import {
  removeElement,
} from '../util';

import {
  LIST_ITEM_TAG,
} from '../constants';

const listHandler = (node, options) => {
  if (!options.openRepeatList || !node.children.length) return;

  const children = node.children;
  const len = Array.from(children).filter(child => LIST_ITEM_TAG.indexOf(child.tagName) > -1).length;

  if (len === 0) return false;

  const firstChild = children[0];
  // 解决有时ul元素子元素不是指定列表元素的 bug。
  if (LIST_ITEM_TAG.indexOf(firstChild.tagName) === -1) {
    return listHandler(firstChild, options);
  }

  // 只保留第一个列表元素
  Array.from(children).forEach((li, index) => {
    if (index > 0) {
      removeElement(li);
    }
  });

  // 将 li 所有兄弟元素设置成相同的元素，保证生成的页面骨架整齐
  for (let i = 1; i < len; i++) {
    node.appendChild(firstChild.cloneNode(true));
  }
};

export default listHandler;
