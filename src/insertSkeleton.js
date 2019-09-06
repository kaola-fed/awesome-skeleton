const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// 在模板中注入骨架图
const insertSkeleton = (skeletonImageBase64, options) => {
  const skeletonHTMLPath = path.join(options.outputPath, `skeleton-${options.pageName}.html`);

  if (!skeletonImageBase64) {
    console.warn('骨架图还没未生成');
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
      background-size: 100% auto !important;
      background-image: url(${skeletonImageBase64}) !important;
      background-color: #FFFFFF !important;
    "></div>
    <script class="${skeletonClass}">
      // 定义外部调用的钩子
      window.SKELETON = {
        destroy: function () { // 主动销毁骨架图
          var removes = Array.from(document.body.querySelectorAll('.${skeletonClass}'));
          removes && removes.map(function(item){
            document.body.removeChild(item);
          });
        }
      };

      // 默认在 onload 事件 1s 后销毁
      window.addEventListener('load', function(){
        setTimeout(function(){
          window.SKELETON && SKELETON.destroy()
        }, 1000);
      });
    </script>`;

  // 代码压缩
  const minifyContent = minify(content, {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });

  // 写入文件
  fs.writeFileSync(skeletonHTMLPath, minifyContent, 'utf8', function(err) {
    if (err) return console.error(err);
  });

  return {
    html: minifyContent,
    img: skeletonImageBase64,
  };
};

module.exports = insertSkeleton;
