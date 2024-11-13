/******** src/utils/rem.js ********/

/**
 * 移动端需要设置该 meta
 * <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
 */

/**
 * html.fontSize: 通过 <html> 控制 rem 基准 和 优化文本渲染
 * body.fontSize: 通过 <body> 控制基础字体大小
 *
 * https://github.com/amfe/lib-flexible/blob/2.0/index.js
 */
(function flexible(window: Window, document: Document): void {
  const docEl = document.documentElement; // 获取文档的根元素 <html>
  const dpr = window.devicePixelRatio || 1; // 获取设备的像素比，默认为 1
  const baseWidth = 768; // 设置移动端的基准宽度

  /**
   * 设置 body 的字体大小，以适应不同的 dpr 值
   * 这样做是为了在高分辨率屏幕上文本渲染更清晰
   */
  function setBodyFontSize(): void {
    if (document.documentElement.clientWidth <= baseWidth) {
      if (document.body) {
        document.body.style.fontSize = `${12 * dpr}px`;
      } else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize); // 当 body 元素不存在时，等待 DOMContentLoaded 事件后执行
      }
    } else {
      if (document.body) {
        document.body.style.fontSize = ''; // 清除 font-size 设置
      }
    }
  }

  setBodyFontSize(); // 初始调用设置 body 的字体大小

  /**
   * 有切仅在移动端时添加 font-size
   *
   * 设置 rem 基准单位：1rem 等于视口宽度的 1/10
   * 这样可以实现布局的自适应，使得布局随着视口宽度缩放
   */
  function setRemUnit(): void {
    if (docEl.clientWidth <= baseWidth) {
      const rem = docEl.clientWidth / 10;
      docEl.style.fontSize = `${rem}px`;
    } else {
      docEl.style.fontSize = ''; // 清除 font-size 设置
    }
  }

  setRemUnit(); // 初始调用设置 rem 单位

  /**
   * 在页面尺寸改变时重新设置 rem 单位，确保自适应
   * 页面从缓存恢复( 通过 pageshow 事件 )时也要重新设置 rem 单位
   */
  window.addEventListener('resize', setRemUnit);
  window.addEventListener('pageshow', function (e: PageTransitionEvent) {
    if (e.persisted) {
      setRemUnit(); // 当页面从缓存恢复时，重新计算 rem 单位
    }
  });

  /**
   * 检测浏览器是否支持 0.5px 边框
   * 如果支持，在 <html> 元素上添加 "hairlines" 类名，便于在样式中利用
   */
  if (dpr >= 2) {
    const fakeBody = document.createElement('body');
    const testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);

    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines'); // 浏览器支持 0.5px 边框时，添加类名
    }
    docEl.removeChild(fakeBody); // 清理临时测试元素
  }
})(window, document);
