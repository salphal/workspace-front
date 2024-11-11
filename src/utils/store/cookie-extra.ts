import dayjs from 'dayjs';

/**
 * Cookie 工具类，用于简化 Cookie 的操作。
 */
export class CookieExtra {
  /**
   * 设置一个 cookie。
   *
   * @param name - Cookie 名称
   * @param value - Cookie 值，支持任意类型，将会转换为字符串
   * @param days - Cookie 的有效期（天数），默认为会话结束时过期
   */
  static set(name: string, value: any, days: number = 0): void {
    let expires = '';
    if (days > 0) {
      const expireDate = dayjs().add(days, 'day').toDate();
      expires = `; expires=${expireDate.toUTCString()}`;
    }
    document.cookie = `${name}=${encodeURIComponent(
      typeof value === 'object' ? JSON.stringify(value) : value,
    )}${expires}; path=/`;
  }

  /**
   * 获取指定名称的 cookie 值。
   * 如果存储的数据是 JSON 字符串，则会自动解析为对象。
   *
   * @param name - 要获取的 Cookie 名称
   * @returns 解析后的值或原始字符串，如果不存在则返回 null
   */
  static get(name: string): any {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(cookie.substring(nameEQ.length));
        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      }
    }
    return null;
  }

  /**
   * 删除指定名称的 cookie。
   *
   * @param name - 要删除的 Cookie 名称
   */
  static remove(name: string): void {
    this.set(name, '', -1);
  }

  /**
   * 清空所有 cookie。
   */
  static clear(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      this.remove(name.trim());
    }
  }
}
