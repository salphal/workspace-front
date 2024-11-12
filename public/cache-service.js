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
 *
 * 1. 监听 install 事件，在 Service Worker 安装时执行
 * 2. 使用 `event.waitUntil` 确保 Service Worker 完成缓存操作后才进入下一状态
 * 3. 打开指定的缓存空间（版本号为 `SW_VERSION`），返回 `cache` 对象的 `Promise`
 * 4. 调用 `cache.addAll` 方法，将 `CACHE_FILE_LIST` 中的所有文件添加到缓存中
 *    - `addAll` 方法会像 `fetch` 一样逐一解析和缓存所有文件的响应
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    // 1. 创建/打开缓存空间，并返回 Promise 实例
    caches.open(SW_VERSION).then(function (cache) {
      // 2. 使用 `addAll` 方法缓存文件列表中的所有文件
      return cache.addAll(CACHE_FILE_LIST);
    }),
  );
});

/**
 * 更新缓存
 *
 * 1. 定义白名单 `cacheWhitelist`，其中包含当前缓存版本 `SW_VERSION`
 * 2. 在 activate 事件触发时，获取所有的缓存 key（即缓存版本）
 * 3. 遍历缓存的 key：
 *    - 如果缓存 key 不在白名单中，则将其删除
 * 4. 确保所有旧缓存删除完成后，新版本的缓存将生效
 */
self.addEventListener('activate', function (event) {
  let cacheWhitelist = [SW_VERSION]; // 1. 白名单包含当前缓存版本

  event.waitUntil(
    caches.keys().then(function (keyList) {
      // 2. 获取所有缓存的 key
      return Promise.all(
        keyList.map(function (key) {
          // 3. 如果缓存 key 不在白名单中，删除该缓存
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key); // 删除旧缓存
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
 * 1. 判断是否已有缓存，如果有则直接返回缓存内容
 * 2. 如果没有缓存，则发送网络请求，并将请求响应克隆一份以便存入缓存
 * 3. 根据请求的 method 和 url 判断是否需要缓存数据
 *    - 如果请求 method 为 POST，跳过缓存
 *    - 如果 url 不在需要缓存的文件类型范围内，跳过缓存
 *    - 如果 url 匹配需要忽略的文件名，跳过缓存
 * 4. 如果符合缓存条件，将响应存入指定版本的缓存中
 */
self.addEventListener('fetch', function (event) {
  const { method, url } = event.request;

  event.respondWith(
    caches.match(event.request).then(function (response) {
      // 1. 检查是否已有缓存，如果有缓存直接返回
      if (response !== undefined) {
        return response;
      } else {
        // 2. 没有缓存的情况，进行网络请求
        return fetch(event.request)
          .then(function (response) {
            let responseClone = response.clone();

            // 3. 如果请求为 POST 方法，直接返回响应，不进行缓存
            if (method === 'POST') {
              return response;
            }

            // 4. 判断是否为需要缓存的文件类型
            if (!isAcceptFile(url)) {
              return response;
            }

            // 5. 判断是否需要忽略某些特定文件名的请求
            if (checkIgnoreFileName(url)) {
              return response;
            }

            // 6. 符合缓存条件，将响应存入缓存
            caches.open(SW_VERSION).then(function (cache) {
              cache.put(event.request, responseClone);
            });

            // 返回网络请求的响应
            return response;
          })
          .catch(function (error) {
            // 7. 捕获网络请求失败的情况并返回错误
            return Promise.reject(error);
          });
      }
    }),
  );
});
