(function () {
  'use strict';

  // sleep function
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Check if the node is in the first screen
  const inViewPort = ele => {
    try {
      const rect = ele.getBoundingClientRect();
      return rect.top < window.innerHeight &&
        rect.left < window.innerWidth;

    } catch (e) {
      return true;
    }
  };

  // Determine if the node has attributes
  const hasAttr = (ele, attr) => {
    try {
      return ele.hasAttribute(attr);
    } catch (e) {
      return false;
    }
  };

  // Set node transparency
  const setOpacity = ele => {
    if (ele.style) {
      ele.style.opacity = 0;
    }
  };

  // Unit conversion px -> rem
  const px2rem = px => {
    const pxValue = typeof px === 'string' ? parseInt(px, 10) : px;
    const htmlElementFontSize = getComputedStyle(document.documentElement).fontSize;

    return `${(pxValue / parseInt(htmlElementFontSize, 10))}rem`;
  };

  // Batch setting element properties
  const setAttributes = (ele, attrs) => {
    Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]));
  };

  // Delete element
  const removeElement = ele => {
    const parent = ele.parentNode;
    if (parent) {
      parent.removeChild(ele);
    }
  };

  // Check the element pseudo-class to return the corresponding element and width
  const checkHasPseudoEle = ele => {
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

  // Skeleton main color
  const MAIN_COLOR = '#EEEEEE';
  const MAIN_COLOR_RGB = 'rgb(238, 238, 238)';

  // Pseudo-class style
  const PSEUDO_CLASS = 'sk-pseudo';

  // button style
  const BUTTON_CLASS = 'sk-button';

  // Transparent style
  const TRANSPARENT_CLASS = 'sk-transparent';

  // Transparent 1 pixel image
  const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  // text class
  const SKELETON_TEXT_CLASS = 'skeleton-text-block-mark';

  // List item Tag
  const LIST_ITEM_TAG = [ 'LI', 'DT', 'DD' ];

  function aHandler(node) {
    node.removeAttribute('href');
  }

  function svgHandler(node) {
    const { width, height } = node.getBoundingClientRect();

    // Remove elements if they are not visible
    if (width === 0 || height === 0 || node.getAttribute('aria-hidden') === 'true') {
      return removeElement(node);
    }

    // Clear node centent
    node.innerHTML = '';

    // Set style
    Object.assign(node.style, {
      width: px2rem(parseInt(width)),
      height: px2rem(parseInt(height)),
    });
  }

  function imgHandler(node) {
    const { width, height } = node.getBoundingClientRect();

    setAttributes(node, {
      width,
      height,
      src: SMALLEST_BASE64,
    });

    node.style.backgroundColor = MAIN_COLOR;
  }

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

    // Clear button content
    node.innerHTML = '';
  }

  function getTextWidth(ele, style) {
    const MOCK_TEXT_ID = 'skeleton-text-id';
    let offScreenParagraph = document.querySelector(`#${MOCK_TEXT_ID}`);
    if (!offScreenParagraph) {
      const wrapper = document.createElement('p');
      offScreenParagraph = document.createElement('span');
      Object.assign(wrapper.style, {
        width: '10000px',
        position: 'absolute',
        top: '0',
      });
      offScreenParagraph.id = MOCK_TEXT_ID;
      offScreenParagraph.style.visibility = 'hidden';
      wrapper.appendChild(offScreenParagraph);
      document.body.appendChild(wrapper);
    }
    Object.assign(offScreenParagraph.style, style);
    ele.childNodes && setStylesInNode(ele.childNodes);
    offScreenParagraph.innerHTML = ele.innerHTML;
    return offScreenParagraph.getBoundingClientRect().width;
  }

  function setStylesInNode(nodes) {
    Array.from(nodes).forEach(node => {
      if (!node || !node.tagName) return;
      const comStyle = getComputedStyle(node);
      Object.assign(node.style, {
        marginLeft: comStyle.marginLeft,
        marginRight: comStyle.marginRight,
        marginTop: comStyle.marginTop,
        marginBottom: comStyle.marginBottom,
        paddingLeft: comStyle.paddingLeft,
        paddingRight: comStyle.paddingRight,
        paddingTop: comStyle.paddingTop,
        paddingBottom: comStyle.paddingBottom,
        fontSize: comStyle.fontSize,
        lineHeight: comStyle.lineHeight,
        position: comStyle.position,
        textAlign: comStyle.textAlign,
        wordSpacing: comStyle.wordSpacing,
        wordBreak: comStyle.wordBreak,
        dispaly: comStyle.dispaly,
        boxSizing: comStyle.boxSizing,
      });

      if (node.childNodes) {
        setStylesInNode(node.childNodes);
      }
    });
  }

  function addTextMask(paragraph, {
    textAlign,
    lineHeight,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }, maskWidthPercent = 0.5) {

    let left;
    let right;
    switch (textAlign) {
      case 'center':
        left = document.createElement('span');
        right = document.createElement('span');
        [ left, right ].forEach(mask => {
          Object.assign(mask.style, {
            display: 'inline-block',
            width: `${maskWidthPercent / 2 * 100}%`,
            height: lineHeight,
            background: '#fff',
            position: 'absolute',
            bottom: paddingBottom,
          });
        });
        left.style.left = paddingLeft;
        right.style.right = paddingRight;
        paragraph.appendChild(left);
        paragraph.appendChild(right);
        break;
      case 'right':
        left = document.createElement('span');
        Object.assign(left.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          left: paddingLeft,
        });
        paragraph.appendChild(left);
        break;
      case 'left':
      default:
        right = document.createElement('span');
        Object.assign(right.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          right: paddingRight,
        });
        paragraph.appendChild(right);
        break;
    }
  }

  function handleTextStyle(ele, width) {
    const comStyle = getComputedStyle(ele);
    let {
      lineHeight,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      position: pos,
      fontSize,
      textAlign,
      wordSpacing,
      wordBreak,
    } = comStyle;
    if (!/\d/.test(lineHeight)) {
      const fontSizeNum = parseInt(fontSize, 10) || 14;
      lineHeight = `${fontSizeNum * 1.4}px`;
    }

    const position = [ 'fixed', 'absolute', 'flex' ].find(p => p === pos) ? pos : 'relative';

    const height = ele.offsetHeight;
    // Round down
    let lineCount = (height - parseFloat(paddingTop, 10) - parseFloat(paddingBottom, 10)) / parseFloat(lineHeight, 10) || 0;

    lineCount = lineCount < 1.5 ? 1 : lineCount;

    const textHeightRatio = 0.6; // Default

    // Add text block class name tag
    ele.classList.add(SKELETON_TEXT_CLASS);

    Object.assign(ele.style, {
      backgroundImage: `linear-gradient(
        transparent ${(1 - textHeightRatio) / 2 * 100}%,
        ${MAIN_COLOR} 0%,
        ${MAIN_COLOR} ${((1 - textHeightRatio) / 2 + textHeightRatio) * 100}%,
        transparent 0%
      )`,
      backgroundSize: `100% ${px2rem(parseInt(lineHeight) * 1.1)}`,
      position,
    });

    // add white mask
    if (lineCount > 1) {
      addTextMask(ele, Object.assign(JSON.parse(JSON.stringify(comStyle)), {
        lineHeight,
      }));
    } else {
      const textWidth = getTextWidth(ele, {
        fontSize,
        lineHeight,
        wordBreak,
        wordSpacing,
      });
      const textWidthPercent = textWidth / (width - parseInt(paddingRight, 10) - parseInt(paddingLeft, 10));
      ele.style.backgroundSize = `${textWidthPercent * 100}% 100%`;
      switch (textAlign) {
        case 'left':
          break;
        case 'right':
          ele.style.backgroundPositionX = '100%';
          break;
        default: // center
          ele.style.backgroundPositionX = '50%';
          break;
      }
    }
  }

  function textHandler(ele, options) {
    const {
      width,
    } = ele.getBoundingClientRect();

    // Elements with a width less than N are not handled
    const minGrayBlockWidth = options.minGrayBlockWidth || 30;
    if (width <= minGrayBlockWidth) {
      return setOpacity(ele);
    }

    // If it is a button, it ends early
    const isBtn = /(btn)|(button)/g.test(ele.getAttribute('class'));
    if (isBtn) {
      return buttonHandler(ele);
    }

    // Handling text styles
    handleTextStyle(ele, width);
  }

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

  function emptyHandler(node) {
    node.innerHTML = '';

    let classNameArr = node.className && node.className.split(' ');
    classNameArr = classNameArr.map(item => {
      return '.' + item;
    });
    const className = classNameArr.join('');
    const id = node.id ? '#' + node.id : '';
    const query = className || id;

    if (!query) return;

    let styleSheet;

    for (const item of document.styleSheets) {
      if (!item.href) {
        styleSheet = item;
        return;
      }
    }

    try {
      styleSheet && styleSheet.insertRule(`${query}::before{content:'' !important;background:none !important;}`, 0);
      styleSheet && styleSheet.insertRule(`${query}::after{content:'' !important;background:none !important;}`, 0);
    } catch (e) {
      console.log('handleEmptyNode Error: ', JSON.stringify(e));
    }
  }

  function styleHandler() {
    const skeletonBlockStyleEle = document.createElement('style');

    skeletonBlockStyleEle.innerText = `
    .${SKELETON_TEXT_CLASS},
    .${SKELETON_TEXT_CLASS} * {
      background-origin: content-box;
      background-clip: content-box;
      background-color: transparent !important;
      color: transparent !important;
      background-repeat: repeat-y;
    }

    .${PSEUDO_CLASS}::before,
    .${PSEUDO_CLASS}::after {
      background: ${MAIN_COLOR} !important;
      background-image: none !important;
      color: transparent !important;
      border-color: transparent !important;
      border-radius: 0 !important;
    }

    .${BUTTON_CLASS} {
      box-shadow: none !important;
    }

    .${TRANSPARENT_CLASS}::before,
    .${TRANSPARENT_CLASS}::after {
      opacity: 0 !important;
    }
  `.replace(/\n/g, '');

    document.body.prepend(skeletonBlockStyleEle);
  }

  function inputHandler(node) {
    node.removeAttribute('placeholder');
    node.value = '';
  }

  function scriptHandler(node) {
    removeElement(node);
  }

  function pseudoHandler(node, options) {
    if (!node.tagName) return;

    const pseudo = checkHasPseudoEle(node);

    if (!pseudo || !pseudo.ele) return;

    const { ele, width } = pseudo;

    // Width is less than the hiding threshold
    if (width < options.minGrayPseudoWidth) {
      return ele.classList.add(TRANSPARENT_CLASS);
    }

    ele.classList.add(PSEUDO_CLASS);
  }

  function beforeHandler(node, options) {
    if (!node.tagName) return;

    // Handling empty elements of user tags
    if (hasAttr(node, 'data-skeleton-empty')) {
      emptyHandler(node);
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
      const switchWrapElement = document.createElement('div');
      switchWrapElement.style.height = '100px';
      const switchElement = document.createElement('button');
      switchElement.innerHTML = '开始生成骨架图';
      Object.assign(switchElement.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        color: '#FFFFFF',
        background: 'red',
        fontSize: '30px',
        height: '100px',
      });
      switchWrapElement.appendChild(switchElement);
      document.body.prepend(switchWrapElement);

      // Need to wait for event processing, so use Promise for packaging
      return new Promise((resolve, reject) => {
        try {
          switchElement.onclick = async () => {
            removeElement(switchWrapElement);
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
      styleHandler();
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
        textHandler(node, this.options);
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
            textHandler(tmpNode, this.options);
            return true;
          }
        }
      }

      // Processing <span>111<a>222</a></span> <span>111<img src="xx" /></span>
      if (tagName === 'SPAN' && node.innerHTML) {
        // Process image and background image first
        this.handleImages(node.childNodes);

        textHandler(node, this.options);
        return true;
      }

      return false;
    },

    // The text nodes are processed uniformly, and the background image, IMG, SVG, etc. need to be processed again.
    handleImages(nodes) {
      if (!nodes) return;

      Array.from(nodes).forEach(node => {
        if (hasAttr(node, 'data-skeleton-ignore')) return;

        beforeHandler(node, this.options);
        pseudoHandler(node, this.options);
        const tagName = node.tagName && node.tagName.toUpperCase();
        if (tagName === 'IMG') {
          imgHandler(node);
        } else if (tagName === 'SVG') {
          svgHandler(node);
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
      beforeHandler(node, this.options);

      // Preprocessing pseudo-class style
      pseudoHandler(node, this.options);

      const tagName = node.tagName && node.tagName.toUpperCase();
      const isBtn = tagName && (tagName === 'BUTTON' || /(btn)|(button)/g.test(node.getAttribute('class')));

      let isCompleted = false;
      switch (tagName) {
        case 'SCRIPT':
          scriptHandler(node);
          break;
        case 'IMG':
          imgHandler(node);
          break;
        case 'SVG':
          svgHandler(node);
          break;
        case 'INPUT':
          inputHandler(node);
          break;
        case 'BUTTON': // Button processing ends once
          buttonHandler(node);
          break;
        case 'UL':
        case 'OL':
        case 'DL':
          listHandler(node, this.options);
          break;
        case 'A': // A label processing is placed behind to prevent IMG from displaying an exception
          aHandler(node);
          break;
      }

      if (isBtn) {
        // Handle button styles, end directly after processing
        buttonHandler(node);
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

}());
