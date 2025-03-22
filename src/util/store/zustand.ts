import { StateStorage } from 'zustand/middleware';

export interface ISetPropertiesConfig {
  /** 状态库名称 */
  name?: string;
  /** 状态实例 */
  store: ZustandStore;
  /** 更新的键 */
  key: string;
  /** 更新的值 */
  value: any;
  /** 是否与之前的数据合并 */
  merge: boolean;
  /** 如果该数据为数组, 是否从前面插入数据 */
  insertBefore: boolean;
  /** 是否使用解构数据合并值 */
  isDeconstruct: boolean;
}

export interface ZustandStore {
  setState: (...arg: any[]) => void;
}

/** 若存入的不是 object 类型, 而是自定义类, 则展开运算可能会导致私有成员丢失 */
const isZustandObject = (target: any) =>
  Object.prototype.toString.call(target) === '[object Object]';

const isZustandFunc = (target: any) => typeof target === 'function';

const isZustandArray = (target: any) => Array.isArray(target);

const loggerWrapper =
  (updateFn: (prev: any) => any, name: string = '') =>
  (prevState: any) => {
    const nextState = updateFn(prevState);
    const stateName = name ? name : 'setState';
    const size = name.length + 20 * 2 + 2;
    const separator = (size: number) => Array(size).fill('-').join('');
    console.log(`%c${separator(20)} ${stateName} ${separator(20)}`, 'color: gray;');
    console.log('%c[ prev state ]:', 'color: gray;', prevState);
    console.log('%c[ next state ]:', 'color: green;', nextState);
    console.log(`%c${separator(size)}`, 'color: gray;');
    return nextState;
  };

/**
 * @param {string} [name=''] - 仓库名称
 * @param {ZustandStore} store - ZustandStore 实例
 * @param {string} key - 数据名
 * @param {any} value - 数据值
 * @param {boolean} [merge=true] - 是否和之前的该值合并
 * @param {boolean} [insertBefore=false] - 如果该数据为数组, 是否从前面插入数据
 * @param {boolean} [isDeconstruct=false] - 是否使用解构数据合并值
 *    - 会保证每次都是一个新的引用地址
 *    - 注意: 会失去解构对象上的私有成员
 */
export const setStoreProperties = ({
  name = '',
  store,
  key,
  value,
  merge = true,
  insertBefore = false,
  isDeconstruct = false,
}: ISetPropertiesConfig) => {
  // 提取一个更新状态的函数
  const updateState = (updateFn: (prev: any) => any) => {
    store.setState(loggerWrapper(updateFn, name));
  };

  // 避免解构, 丢失私有成员等
  if (isDeconstruct) {
    updateState((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    return;
  }

  // 判断不同类型的 value，并更新状态
  if (isZustandObject(value)) {
    updateState((prev: any) => ({
      ...prev,
      [key]: merge ? { ...prev[key], ...value } : { ...value },
    }));
  } else if (isZustandArray(value)) {
    updateState((prev: any) => ({
      ...prev,
      [key]: merge ? (!insertBefore ? [...prev[key], ...value] : [...value, ...prev[key]]) : value,
    }));
  } else if (isZustandFunc(value)) {
    updateState((prev: any) => ({
      ...prev,
      [key]: value(prev[key]),
    }));
  } else {
    updateState((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }
};

/** custom zustand localStorage save methods */
export const zustandLocalStorage: StateStorage = {
  getItem: (key): string => {
    return JSON.parse(localStorage.getItem(key) as string);
  },
  setItem: (key, newValue): void => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key): void => {
    localStorage.removeItem(key);
  },
};

/** custom zustand sessionStorage save methods */
export const zustandSessionStorage: StateStorage = {
  getItem: (key): string => {
    return JSON.parse(sessionStorage.getItem(key) as string);
  },
  setItem: (key, newValue): void => {
    sessionStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key): void => {
    sessionStorage.removeItem(key);
  },
};

/** custom zustand cookie save methods */
export const zustandCookieStorage: StateStorage = {
  getItem: (key): string => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${key}=`));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
  },
  setItem: (key, newValue): void => {
    document.cookie = `${key}=${encodeURIComponent(JSON.stringify(newValue))}; path=/;`;
  },
  removeItem: (key): void => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

/** custom zustand url hash save methods */
export const zustandUrlHashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? '';
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

/** custom zustand cross tab sync save method */
const createStorageEventHandler = (zustandStore: ZustandStore) => {
  return (event: StorageEvent) => {
    if (event.key && event.newValue) {
      const newValue = JSON.parse(event.newValue);
      console.log('[zustand] 跨标签页更新:', { key: event.key, newValue });
      setStoreProperties({
        store: zustandStore,
        key: event.key,
        value: newValue,
        merge: true,
        insertBefore: false,
        isDeconstruct: false,
      });
    }
  };
};

/** 初始化跨标签页通信 */
const initCrossTabSync = (
  zustandStore: ZustandStore,
  channelName: string = 'zustandCrossTabChannel',
) => {
  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(channelName);

    // 监听 BroadcastChannel 消息
    bc.onmessage = (event) => {
      const { key, newValue } = event.data;
      console.log('[zustand] BroadcastChannel 收到更新:', { key, newValue });

      setStoreProperties({
        store: zustandStore,
        key,
        value: newValue,
        merge: true,
        insertBefore: false,
        isDeconstruct: false,
      });
    };

    // 包装存储方法，使其广播数据
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = (key, newValue) => {
      originalSetItem.call(localStorage, key, newValue);
      bc.postMessage({ key, newValue: JSON.parse(newValue) }); // 发送广播
    };
  } else {
    // 若不支持 BroadcastChannel，则降级监听 localStorage
    console.warn('[zustand] BroadcastChannel 不支持，降级到 localStorage 监听');
    const storageHandler = createStorageEventHandler(zustandStore);
    window.addEventListener('storage', storageHandler);
  }
};
