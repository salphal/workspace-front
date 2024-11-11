import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { setStoreProperties, zustandLocalStorage } from '@/utils/store/zustand.ts';

export interface ILocalStore {
  [key: string]: any;
}

export const initialLocal = {
  key: {},
};

// useShallow(); 对象浅比较, 减少重绘
// const {
//   key,
// } = useLocalStore(useShallow((state: any) => state));
const useLocalStore = create(
  persist<ILocalStore>(
    (set, get) => ({
      ...initialLocal,
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'localStore', // unique name
      version: 1,
      storage: createJSONStorage(() => zustandLocalStorage), // zustandLocalStorage | zustandSessionStorage | localStorage ...
    },
  ),
);

export const setLocalStore = (props: any) =>
  useLocalStore.setState((prev: any) => ({ ...prev, ...props }));

export const setLocalProperty = (
  key: string,
  value: any,
  merge = false,
  insertBefore = false,
  isDeconstruct = false,
) => setStoreProperties(useLocalStore, key, value, merge, insertBefore, isDeconstruct);

export const setKey = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setLocalProperty('key', value, merge, insertBefore, isDeconstruct);

export const resetKey = () => setLocalProperty('key', initialLocal.key, false);

export const resetLocalStore = () => useLocalStore.setState({ ...initialLocal });

export const clearLocalStoreStorage = () => useLocalStore.persist.clearStorage();

export default useLocalStore;
