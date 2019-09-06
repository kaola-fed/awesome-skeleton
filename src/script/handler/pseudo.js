import {
  checkHasPseudoEle,
} from '../util';

import {
  PSEUDO_CLASS,
  TRANSPARENT_CLASS,
} from '../constants';

function pseudoHandler(node, options) {
  if (!node.tagName) return;

  const pseudo = checkHasPseudoEle(node);

  if (!pseudo || !pseudo.ele) return;

  const { ele, width } = pseudo;

  // 宽度小于阈值隐藏
  if (width < options.minGrayPseudoWidth) {
    return ele.classList.add(TRANSPARENT_CLASS);
  }

  ele.classList.add(PSEUDO_CLASS);
}

export default pseudoHandler;
