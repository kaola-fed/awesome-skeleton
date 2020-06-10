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
  // Entry function
  async genSkeleton(options) {
    this.options = options;
    if (options.debug) {
      await this.debugGenSkeleton(options);
    } else {
      await this.startGenSkeleton();
    }
  },

  // Start generating the skeleton
  async startGenSkeleton() {
    this.init();
    try {
      this.handleNode(document.body);
    } catch (e) {
      console.log('==genSkeleton Error==\n', e.message, e.stack);
    }
  },

  // The Debug mode generates a skeleton diagram for debugging.
  // There will be a button at the top of the page, and click to generate a skeleton map.
  async debugGenSkeleton(options) {
    const switchElement = document.createElement('button');
    switchElement.innerHTML = '开始生成骨架图';
    Object.assign(switchElement.style, {
      position: 'relative',
      width: '100%',
      zIndex: 9999,
      color: '#FFFFFF',
      background: 'red',
      fontSize: '30px',
      height: '100px',
    });
    document.body.prepend(switchElement);

    // Need to wait for event processing, so use Promise for packaging
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

  // Initialization processing DOM
  init() {
    this.cleanSkeletonContainer();
    handler.style();
  },

  // Remove skeleton image html and style from the page to avoid interference
  cleanSkeletonContainer() {
    const skeletonWrap = document.body.querySelector('#nozomi-skeleton-html-style-container');
    if (skeletonWrap) {
      removeElement(skeletonWrap);
    }
  },

  /**
   * Processing text nodes
   * @param {*} node Node
   * @return {Boolean} True means that processing has been completed, false means that processing still needs to be continued
   */
  handleText(node) {
    const tagName = node.tagName && node.tagName.toUpperCase();

    // Processing <div>xxx</div> or <a>xxx</a>
    if (node.childNodes && node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
      handler.text(node, this.options);
      return true;
    }

    // Processing xxx，change to <i>xxx</i>
    if (node && node.nodeType === 3 && node.textContent) {
      const parent = node.parentNode;
      // Determine if it has been processed
      if (!parent.classList.contains(SKELETON_TEXT_CLASS)) {
        // It is plain text itself and needs to be replaced with a node
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

    // Processing <span>111<a>222</a></span> <span>111<img src="xx" /></span>
    if (tagName === 'SPAN' && node.innerHTML) {
      // Process image and background image first
      this.handleImages(node.childNodes);

      handler.text(node, this.options);
      return true;
    }

    return false;
  },

  // The text nodes are processed uniformly, and the background image, IMG, SVG, etc. need to be processed again.
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

  // Processing node list
  handleNodes(nodes) {
    if (!nodes.length) return;

    Array.from(nodes).forEach(node => {
      this.handleNode(node);
    });
  },

  // Processing a single node
  handleNode(node) {
    if (!node) return;

    // Delete elements that are not in first screen, or marked for deletion
    if (!inViewPort(node) || hasAttr(node, 'data-skeleton-remove')) {
      return removeElement(node);
    }

    // Handling elements that are ignored by user tags -> End
    const ignore = hasAttr(node, 'data-skeleton-ignore') || node.tagName === 'STYLE';
    if (ignore) return;

    // Preprocessing some styles
    handler.before(node, this.options);

    // Preprocessing pseudo-class style
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
      case 'BUTTON': // Button processing ends once
        handler.button(node);
        break;
      case 'UL':
      case 'OL':
      case 'DL':
        handler.list(node, this.options);
        break;
      case 'A': // A label processing is placed behind to prevent IMG from displaying an exception
        handler.a(node);
        break;
      default:
        break;
    }

    if (isBtn) {
      // Handle button styles, end directly after processing
      handler.button(node);
    } else {
      // Other nodes are processed as TEXT
      isCompleted = this.handleText(node);
    }

    // If it is a button and has not been processed by handleText, then the child node is processed
    if (!isBtn && !isCompleted) {
      this.handleNodes(node.childNodes);
    }
  },
};
