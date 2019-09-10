import {
  sleep,
  hasAttr,
  inViewPort,
  removeElement,
} from './util';

import {
  SKELETON_TEXT_CLASS,
} from './constants';

import * as handler from './handler/index';

window.AwesomeSkeleton = {
  // 入口函数
  async genSkeleton(options) {
    this.options = options;
    if (options.debug) {
      await this.debugGenSkeleton(options);
    } else {
      await this.startGenSkeleton();
    }
  },

  // 开始生成骨架图
  async startGenSkeleton() {
    this.init();
    try {
      this.handleNodes(document.body.childNodes);
    } catch (e) {
      console.log('==genSkeleton Error==\n', e.message, e.stack);
    }
  },

  // Debug 模式生成骨架图，用于调试。页面顶部会有按钮，点击后生成骨架图
  async debugGenSkeleton(options) {
    const switchElement = document.createElement('button');
    switchElement.innerHTML = '开始生成骨架图';
    Object.assign(switchElement.style, {
      width: '100%',
      zIndex: 9999,
      color: '#FFFFFF',
      background: 'red',
      fontSize: '30px',
      height: '100px',
    });
    document.body.prepend(switchElement);

    // 需要等待事件处理，所以使用 Promise 进行包装
    return new Promise((resolve, reject) => {
      try {
        switchElement.onclick = async () => {
          removeElement(switchElement);
          await this.startGenSkeleton();
          await sleep(options.debugTime || 0);
          resolve();
        };
      } catch (e) {
        console.error('==startGenSkeleton Error==', e);
        reject(e);
      }
    });
  },

  // 初始化处理 DOM
  init() {
    this.cleanSkeletonContainer();
    handler.style();
  },

  // 将骨架图html和style从页面中移除，避免干扰
  cleanSkeletonContainer() {
    const skeletonWrap = document.body.querySelector('#nozomi-skeleton-html-style-container');
    if (skeletonWrap) {
      removeElement(skeletonWrap);
    }
  },

  /**
   * 处理文本节点
   * @param {*} node 节点
   * @return {Boolean} true 已完成处理，false 还需要继续处理
   */
  handleText(node) {
    const tagName = node.tagName && node.tagName.toUpperCase();

    // 处理 <div>xxx</div> 或 <a>xxx</a>
    if (node.childNodes && node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
      handler.text(node, this.options);
      return true;
    }

    // 处理 xxx，改为 <i>xxx</i>
    if (node && node.nodeType === 3 && node.textContent) {
      const parent = node.parentNode;
      // 判断是否已经被处理过
      if (!parent.classList.contains(SKELETON_TEXT_CLASS)) {
        // 本身为纯文本，需要替换为节点
        const textContent = node.textContent.replace(/[\r\n]/g, '').trim();
        if (textContent) {
          const tmpNode = document.createElement('i');
          tmpNode.classList.add(SKELETON_TEXT_CLASS);
          tmpNode.innerText = textContent;
          node.parentNode.replaceChild(tmpNode, node);
          handler.text(tmpNode, this.options);
          return true;
        }
      }
    }

    // 处理 <span>111<a>222</a></span> <span>111<img src="xx" /></span>
    if (tagName === 'SPAN' && node.innerHTML) {
      // 先处理图片和背景图
      this.handleImages(node.childNodes);

      handler.text(node, this.options);
      return true;
    }

    return false;
  },

  // 文本节点统一处理，需要对背景图、IMG、SVG 等进行再次处理
  handleImages(nodes) {
    if (!nodes) return;

    Array.from(nodes).forEach(node => {
      if (hasAttr(node, 'data-skeleton-ignore')) return;

      handler.before(node, this.options);
      handler.pseudo(node, this.options);
      const tagName = node.tagName && node.tagName.toUpperCase();
      if (tagName === 'IMG') {
        handler.img(node);
      } else if (tagName === 'SVG') {
        handler.svg(node);
      } else {
        this.handleImages(node.childNodes);
      }
    });
  },

  // 处理节点列表
  handleNodes(nodes) {
    if (!nodes.length) return;

    Array.from(nodes).forEach(node => {
      this.handleNode(node);
    });
  },

  // 处理单个节点
  handleNode(node) {
    if (!node) return;

    // 删除不在首屏，或者标记为删除的元素
    if (!inViewPort(node) || hasAttr(node, 'data-skeleton-remove')) {
      return removeElement(node);
    }

    // 处理用户标记忽略的元素 -> 结束
    const ignore = hasAttr(node, 'data-skeleton-ignore') || node.tagName === 'STYLE';
    if (ignore) return;

    // 预处理一些样式
    handler.before(node, this.options);

    // 预处理伪类样式
    handler.pseudo(node, this.options);

    const tagName = node.tagName && node.tagName.toUpperCase();
    const isBtn = tagName && (tagName === 'BUTTON' || /(btn)|(button)/g.test(node.getAttribute('class')));

    let isCompleted = false;
    switch (tagName) {
      case 'SCRIPT':
        handler.script(node);
        break;
      case 'IMG':
        handler.img(node);
        break;
      case 'SVG':
        handler.svg(node);
        break;
      case 'INPUT':
        handler.input(node);
        break;
      case 'BUTTON': // 按钮处理一次就结束
        handler.button(node);
        break;
      case 'UL':
      case 'OL':
        handler.list(node, this.options);
        break;
      case 'A': // a 标签处理放在后面，防止 img 显示异常
        handler.a(node);
        break;
      default:
        break;
    }

    if (isBtn) {
      handler.button(node); // 处理按钮样式，处理完直接结束
    } else {
      isCompleted = this.handleText(node); // 其他节点按照文本处理
    }

    // 不是按钮并且没有被 handleText 处理过，则处理子节点
    if (!isBtn && !isCompleted) {
      this.handleNodes(node.childNodes);
    }
  },
};
