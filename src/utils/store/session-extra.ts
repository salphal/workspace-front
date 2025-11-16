/**
 * Session 存储工具类，用于简化 sessionStorage 的操作。
 */
export class SessionExtra {
  /**
   * 将键值对存储到 sessionStorage 中。
   * 如果 value 是对象，则会转换为 JSON 字符串进行存储。
   *
   * @param key - 存储的键名
   * @param value - 存储的值，支持任意类型
   */
  static set(key: string, value: any): void {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  }

  /**
   * 从 sessionStorage 获取指定键的值。
   * 如果存储的数据是 JSON 字符串，则会自动解析为对象。
   *
   * @param key - 获取的键名
   * @returns 解析后的值或原始字符串
   */
  static get(key: string): any {
    const data = sessionStorage.getItem(key);
    try {
      return JSON.parse(data as string);
    } catch {
      return data;
    }
  }

  /**
   * 从 sessionStorage 中移除指定的键值对。
   *
   * @param key - 要移除的键名
   */
  static remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * 清空 sessionStorage 中的所有数据。
   */
  static clear(): void {
    sessionStorage.clear();
  }
}
