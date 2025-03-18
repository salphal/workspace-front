import { setStoreProperties, zustandLocalStorage } from '@src/util/store/zustand.ts';
import { ThemeConfig } from 'antd/es/config-provider/context';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * https://ant-design.antgroup.com/docs/react/customize-theme-cn
 */

export interface IThemeStore {
  mode: 'light' | 'dark' | 'auto';
  theme: ThemeConfig;
}

export const initialTheme: IThemeStore = {
  mode: 'light',
  theme: {
    token: {
      // Seed Token，影响范围大
    },
  },
};

// useShallow(); 对象浅比较, 减少重绘
// const {
//   mode,
// } = useThemeStore(useShallow((state: any) => state));
const useThemeStore = create(
  persist<IThemeStore>(
    (set, get) => ({
      ...initialTheme,
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'themeStore', // unique name
      version: 1,
      storage: createJSONStorage(() => zustandLocalStorage), // zustandLocalStorage | zustandSessionStorage | localStorage ...
    },
  ),
);

export const setThemeStore = (props: any) =>
  useThemeStore.setState((prev: any) => ({ ...prev, ...props }));

export const setThemeProperty = (
  key: string,
  value: any,
  merge = false,
  insertBefore = false,
  isDeconstruct = true,
) =>
  setStoreProperties({
    name: 'useThemeStore',
    store: useThemeStore,
    key,
    value,
    merge,
    insertBefore,
    isDeconstruct,
  });

export const setMode = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setThemeProperty('mode', value, merge, insertBefore, isDeconstruct);

export const resetMode = () => setThemeProperty('mode', initialTheme.mode, false);

export const resetThemeStore = () => useThemeStore.setState({ ...initialTheme });

export const clearThemeStoreStorage = () => useThemeStore.persist.clearStorage();

export default useThemeStore;
