import qs from 'query-string';

export class UrlExtra {
  parse(str: string): { [key: string]: any } {
    let res = {};
    if (str.length > 1 && str[0] === '?') {
      res = qs.parse(str.slice(1));
    }
    return res || {};
  }

  stringify(params: { [key: string]: any }) {
    return qs.stringify(params);
  }

  // 获取路径部分
  __path(url: string): string {
    // 分离出不含参数或哈希的路径
    return url.split(/[?#]/)[0];
  }

  // 获取参数部分
  __params(url: string): { [key: string]: any } {
    const queryString = url.split('?')[1]?.split('#')[0] || ''; // 获取参数部分，不包含哈希
    return queryString ? qs.parse(queryString) : {};
  }

  // 获取哈希部分
  __hash(url: string): string {
    // 提取哈希
    return url.split('#')[1] || '';
  }
}
