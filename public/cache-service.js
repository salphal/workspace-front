/**
 * 强缓存
 *
 *  请求头:
 *    - Cache-Control     // http 1.1( 优先级更高 )
 *      - Cache-Control: s-maxage=300, public, max-age=60
 *    - Expires           // http 1.0
 *      - Expires: Tue, 01 May 2018 11:37:06 GMT
 *
 *  缓存位置
 *    - 1. 硬盘
 *    - 2. 内存
 *
 ** 浏览器不会像服务器发送任何请求, 直接从本地缓存中读取文件并返回 Status Code: 200 OK
 */

/**
 * 协商缓存
 *
 *  请求头:
 *    - Etag/If-None-Match                // http 1.1( 优先级更高 )
 *    - Last-Modifed/If-Modified-Since    // http 1.0
 *
 ** 向服务器发送请求, 服务器会根据这个请求的 request header 的一些参数来判断是否命中协商缓存
 ** 如果命中, 则返回 304状态码 并带上新的 response header 通知浏览器从缓存中读取资源
 */

/**
 * Service Worker
 *  - 一旦被 install, 就永远存在, 除非被手动 unregister
 *  - 用到的时候就可以直接唤醒, 不用的时候自动睡眠
 *
 *  生命周期:
 *    - installing --> installed --> activating --> activated --> redundant
 *
 * 运行在浏览器背后的独立线程
 * 主要用于代理网页请求, 可缓存请求结果
 * 可实现离线缓存功能, 可跨页面通信等
 *
 * vs Web Worker
 *  - 当网页关闭时，Web Worker就失效了
 */

/**
 * workbox
 ** google 开发的离线缓存库
 */

/**
 * cacheStore API 可以使用 caches 代替
 */

// 缓存的版本
const SW_VERSION = 'V1';
// 缓存的文件类型
const CACHE_FILE_TYPE = ['js', 'css', 'html', 'jpg', 'json', 'png', 'mp3', 'wav', 'mp4', 'ttf'];
// 需要确认缓存的文件
const CACHE_FILE_LIST = [];
// 忽略缓存的列表
const IGNORE_FILE_LIST = ['/test/index.js'];

/**
 * 是否是对应的文件类型
 * @param {string} url - 请求的地址
 */
const isAcceptFile = (url) => {
  let r = new RegExp('\\.(' + CACHE_FILE_TYPE.join('|') + ')$');
  return r.test(url);
};

/**
 * 检查文件名
 * @param {string} url - 请求的地址
 */
const checkIgnoreFileName = (url) => {
  let r = new RegExp('(' + IGNORE_FILE_LIST.join('|') + ')$');
  return r.test(url);
};

/**
 * 开辟缓存空间, 并缓存命中的请求结果
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    /**
     * 创建/打开 缓存空间, 并会返回 promise实例
     */
    caches.open(SW_VERSION).then(function (cache) {
      // cache对象 addAll方法 解析( 同fetch )并缓存所有的文件
      return cache.addAll(CACHE_FILE_LIST);
    }),
  );
});

/**
 * 更新缓存
 */
self.addEventListener('activate', function (event) {
  let cacheWhitelist = [SW_VERSION];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
});

/**
 * 拦截所有请求事件
 *  - 仅支持 fetch, 不支持 xmlHttpRequest
 *
 ** 判断是否已有缓存, 有则直接返回
 */
self.addEventListener('fetch', function (event) {
  const { method, url } = event.request;
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            let responseClone = response.clone();
            if (method === 'POST') {
              return response;
            }
            if (!isAcceptFile(url)) {
              return response;
            }
            if (checkIgnoreFileName(url)) {
              return response;
            }
            caches.open(SW_VERSION).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function (error) {
            return Promise.reject(error);
          });
      }
    }),
  );
});
