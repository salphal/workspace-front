import { StateStorage } from 'zustand/middleware';

export interface StoreProperties<T> {
  /** 更新的键 */
  key: string;
  /** 更新的值 */
  value: T;
  /** 是否与之前的数据合并 */
  merge?: boolean;
  /** 如果该数据为数组, 是否从前面插入数据 */
  insertBefore?: boolean;
  /** 是否使用解构数据合并值 */
  isDeconstruct?: boolean;
}

export interface SetStoreOptions<T = unknown> extends StoreProperties<T> {
  /** 状态库名称 */
  name?: string;
  /** 状态实例 */
  store: ZustandStore;
}

export interface ZustandStore {
  setState: (...args: any[]) => void;
}

/** 类型检查工具函数 */
const isZustandObject = (target: unknown): target is Record<string, unknown> =>
  Object.prototype.toString.call(target) === '[object Object]';

const isZustandFunc = (target: unknown): target is (arg: unknown) => unknown =>
  typeof target === 'function';

const isZustandArray = (target: unknown): target is unknown[] => Array.isArray(target);

const loggerWrapper =
  (updateFn: (prev: unknown) => unknown, name: string = '', isLogger: boolean = false) =>
  (prevState: unknown) => {
    const nextState = updateFn(prevState);

    if (isLogger) {
      const stateName = name || 'setState';
      const size = name.length + 40;
      const separator = (size: number) => Array(size).fill('-').join('');
      console.log(`%c${separator(20)} ${stateName} ${separator(20)}`, 'color: gray;');
      console.log('%c[ prev state ]:', 'color: gray;', prevState);
      console.log('%c[ next state ]:', 'color: green;', nextState);
      console.log(`%c${separator(size)}`, 'color: gray;');
    }

    return nextState;
  };

/**
 * 更新 Zustand 状态库属性的通用方法
 * @param config 配置对象
 * @param config.name 仓库名称
 * @param config.store ZustandStore 实例
 * @param config.key 数据名
 * @param config.value 数据值
 * @param config.merge 是否和之前的该值合并，默认 true
 * @param config.insertBefore 如果该数据为数组, 是否从前面插入数据，默认 false
 * @param config.isDeconstruct 是否使用解构数据合并值，默认 false
 *    - 会保证每次都是一个新的引用地址
 *    - 注意: 会失去解构对象上的私有成员
 */
export const setStoreProperties = <T>({
  name = 'ZustandStore',
  store,
  key,
  value,
  merge = true,
  insertBefore = false,
  isDeconstruct = false,
}: SetStoreOptions<T>) => {
  // 参数验证
  if (!store || !key) {
    console.warn('[setStoreProperties] store 和 key 参数不能为空');
    return;
  }

  // 提取一个更新状态的函数
  const updateState = (updateFn: (prev: unknown) => unknown) => {
    store.setState(loggerWrapper(updateFn, name, false));
  };

  // 避免解构, 丢失私有成员等
  if (isDeconstruct) {
    updateState((prev: unknown) => ({
      ...(prev as Record<string, unknown>),
      [key]: value,
    }));
    return;
  }

  // 根据不同的 value 类型进行状态更新
  const updateStateByType = (prev: unknown) => {
    const prevState = prev as Record<string, unknown>;
    const prevValue = prevState[key];

    if (isZustandObject(value)) {
      return {
        ...prevState,
        [key]: merge && isZustandObject(prevValue) ? { ...prevValue, ...value } : { ...value },
      };
    }

    if (isZustandArray(value)) {
      return {
        ...prevState,
        [key]:
          merge && isZustandArray(prevValue)
            ? insertBefore
              ? [...value, ...prevValue]
              : [...prevValue, ...value]
            : value,
      };
    }

    if (isZustandFunc(value)) {
      return {
        ...prevState,
        [key]: value(prevValue),
      };
    }

    // 基础类型直接赋值
    return {
      ...prevState,
      [key]: value,
    };
  };

  updateState(updateStateByType);
};

//# region [zustand-storage-utils] =================================================================

/** safe JSON parse */
const safeParse = (value: string | null): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (err) {
    console.warn('[zustand-storage] JSON parse failed:', err, value);
    return null;
  }
};

/** safe JSON stringify */
const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch (err) {
    console.warn('[zustand-storage] JSON stringify failed:', err, value);
    return '';
  }
};

/** custom zustand localStorage save methods */
export const zustandLocalStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const raw = localStorage.getItem(key);
    return raw;
  },
  setItem: (key: string, newValue: unknown): void => {
    localStorage.setItem(key, safeStringify(newValue));
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};

/** custom zustand sessionStorage save methods */
export const zustandSessionStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const raw = sessionStorage.getItem(key);
    return raw;
  },
  setItem: (key: string, newValue: unknown): void => {
    sessionStorage.setItem(key, safeStringify(newValue));
  },
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },
};

/** custom zustand cookie save methods */
export const zustandCookieStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  },
  setItem: (key: string, newValue: unknown): void => {
    document.cookie = `${key}=${encodeURIComponent(safeStringify(newValue))}; path=/;`;
  },
  removeItem: (key: string): void => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

/** custom zustand url hash save methods */
export const zustandUrlHashStorage: StateStorage = {
  getItem: (key: string): string | null => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    return searchParams.get(key);
  },
  setItem: (key: string, newValue: unknown): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, safeStringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key: string): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

//# endregion  =====================================================================================

//# region [zustand-channel-utils] =================================================================

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

//# endregion  =====================================================================================
