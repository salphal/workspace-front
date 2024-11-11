import * as cookie from 'cookie';
import { SerializeOptions } from 'cookie';

/**
 * https://github.com/jshttp/cookie
 *
 * CookieExtra 类封装了对 cookie 解析和序列化的操作，基于 `cookie` 库。
 * 该类提供便捷方法来解析 HTTP 请求中的 cookie 字符串，以及创建和设置新的 cookie。
 */
export class CookieExtra {
  /**
   * 解析 cookie 字符串，将其转为键值对对象。
   *
   * @param str - cookie 字符串，通常从 HTTP 请求头中获取
   * @returns {Object} - 返回一个对象，其中每个键值对表示一个 cookie 项
   *
   * 示例：
   * ```typescript
   * const cookies = new CookieExtra();
   * const parsedCookies = cookies.parse('name=John; session=abc123');
   * // parsedCookies: { name: 'John', session: 'abc123' }
   * ```
   */
  static parse(str: string) {
    return cookie.parse(str);
  }

  /**
   * 将键值对序列化为 cookie 字符串，以便设置新的 cookie。
   *
   * @param key - cookie 的键名
   * @param val - cookie 的值
   * @param options - 选项配置（可选），包括 httpOnly、maxAge 等
   * @returns {string} - 返回格式化的 cookie 字符串
   *
   * 示例：
   * ```typescript
   * const cookies = new CookieExtra();
   * const cookieStr = cookies.stringify('name', 'John', { httpOnly: true, maxAge: 604800 });
   * // cookieStr: 'name=John; HttpOnly; Max-Age=604800'
   * ```
   *
   * 常见的 `SerializeOptions`：
   * - `httpOnly`: 布尔值，设置为 true 时，客户端 JavaScript 不能访问该 cookie
   * - `maxAge`: 以秒为单位设置 cookie 的有效期
   * - `expires`: 设置 cookie 的具体过期时间
   * - `path`: 设置 cookie 的作用路径
   * - `secure`: 布尔值，设置为 true 时，cookie 仅在 HTTPS 连接上传输
   */
  static stringify(key: string, val: string, options?: SerializeOptions) {
    return cookie.serialize(key, val, options);
  }
}
