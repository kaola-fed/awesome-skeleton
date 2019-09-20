const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Inject the skeleton into the template
const insertSkeleton = (skeletonImageBase64, options) => {
  const skeletonHTMLPath = path.join(options.outputPath, `skeleton-${options.pageName}.html`);

  if (!skeletonImageBase64) {
    console.warn('The skeleton has not been generated yet');
    return false;
  }

  const skeletonClass = 'skeleton-remove-after-first-request';

  const content = `
    <style>
      @keyframes flush {
        0% {
          left: -100%;
        }
        50% {
          left: 0;
        }
        100% {
          left: 100%;
        }
      }
    </style>
    <div class="${skeletonClass}" style="
      animation: flush 2s linear infinite;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 9999;
      background: linear-gradient(to left,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, .85) 50%,
        rgba(255, 255, 255, 0) 100%);
    "></div>
    <div class="${skeletonClass}" style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9998;
      background-repeat: no-repeat !important;
      background-size: ${options.device ? '100% auto' : '1920px 1080px'} !important;
      background-image: url(${skeletonImageBase64}) !important;
      background-color: #FFFFFF !important;
      background-position: center 0 !important;
    "></div>
    <script class="${skeletonClass}">
      // Define hooks
      window.SKELETON = {
        destroy: function () { // Manually destroy the skeleton
          var removes = Array.from(document.body.querySelectorAll('.${skeletonClass}'));
          removes && removes.map(function(item){
            document.body.removeChild(item);
          });
        }
      };

      // destroy after the onload event 1s by default
      window.addEventListener('load', function(){
        setTimeout(function(){
          window.SKELETON && SKELETON.destroy()
        }, 1000);
      });
    </script>`;

  // Code compression
  const minifyContent = minify(content, {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });

  // Write file
  fs.writeFileSync(skeletonHTMLPath, minifyContent, 'utf8', function(err) {
    if (err) return console.error(err);
  });

  return {
    minHtml: minifyContent,
    html: content,
    img: skeletonImageBase64,
  };
};

module.exports = insertSkeleton;
