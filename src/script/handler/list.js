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
  // Solve the bug that sometimes the ul element child element is not a specified list element.
  if (LIST_ITEM_TAG.indexOf(firstChild.tagName) === -1) {
    return listHandler(firstChild, options);
  }

  // Keep only the first list element
  Array.from(children).forEach((li, index) => {
    if (index > 0) {
      removeElement(li);
    }
  });

  // Set all sibling elements of LI to the same element to ensure that the generated page skeleton is neat
  for (let i = 1; i < len; i++) {
    node.appendChild(firstChild.cloneNode(true));
  }
};

export default listHandler;
