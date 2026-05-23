import { setStoreProperties, StoreProperties } from '@src/utils/store/zustand.ts';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const THEME_STORE = 'themeStore';

export interface ThemeStore {
  key: any;
  mode: string;
}

export const initialThemeData: ThemeStore = {
  key: {},
  mode: 'light',
};

const useThemeStore = create(
  persist<ThemeStore>(
    (set, get) => ({
      ...initialThemeData,
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: THEME_STORE, // Unique Name
      version: 1, // Version Upgrade
      storage: createJSONStorage(() => localStorage), // LocalStorage | SessionStorage | ...
    },
  ),
);

//# region [common] ================================================================================

export const setThemeProperty = <T>({
  key,
  value,
  merge = false,
  insertBefore = false,
  isDeconstruct = true,
}: StoreProperties<T>) =>
  setStoreProperties({
    name: THEME_STORE,
    store: useThemeStore,
    key,
    value,
    merge,
    insertBefore,
    isDeconstruct,
  });

export const setThemeStore = (state: Partial<ThemeStore>) => useThemeStore.setState(state);

export const resetThemeStore = async () => {
  useThemeStore.setState({ ...initialThemeData });
  useThemeStore.persist.clearStorage();
  await useThemeStore.persist.rehydrate();
};

//# endregion ======================================================================================

//# region [getters] ===============================================================================

export const useKey = () => useThemeStore((state: any) => state.key);

//# endregion ======================================================================================

//# region [setters] ===============================================================================

export const setKey = (value: any) => setThemeProperty<any>({ key: 'key', value });

//# endregion ======================================================================================

//# region [resets] ================================================================================

export const resetKey = () => setThemeProperty({ key: 'key', value: initialThemeData.key });

//# endregion ======================================================================================

export default useThemeStore;
