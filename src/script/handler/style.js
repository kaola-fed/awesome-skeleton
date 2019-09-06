import {
  MAIN_COLOR,
  PSEUDO_CLASS,
  BUTTON_CLASS,
  TRANSPARENT_CLASS,
  SKELETON_TEXT_CLASS,
} from '../constants';

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

export default styleHandler;
