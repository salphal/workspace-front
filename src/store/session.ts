import { setStoreProperties, zustandSessionStorage } from '@src/util/store/zustand.ts';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ISessionStore {
  [key: string]: any;
}

export const initialSession = {
  key: {},
};

// useShallow(); 对象浅比较, 减少重绘
// const {
//   key,
// } = useSessionStore(useShallow((state: any) => state));
const useSessionStore = create(
  persist<ISessionStore>(
    (set, get) => ({
      ...initialSession,
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'sessionStore', // unique name
      version: 1,
      storage: createJSONStorage(() => zustandSessionStorage), // zustandLocalStorage | zustandSessionStorage | localStorage ...
    },
  ),
);

export const setSessionStore = (props: any) =>
  useSessionStore.setState((prev: any) => ({ ...prev, ...props }));

export const setSessionProperty = (
  key: string,
  value: any,
  merge = false,
  insertBefore = false,
  isDeconstruct = true,
) =>
  setStoreProperties({
    name: 'useSessionStore',
    store: useSessionStore,
    key,
    value,
    merge,
    insertBefore,
    isDeconstruct,
  });

export const setKey = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setSessionProperty('key', value, merge, insertBefore, isDeconstruct);

export const resetKey = () => setSessionProperty('key', initialSession.key, false);

export const resetSessionStore = () => useSessionStore.setState({ ...initialSession });

export const clearSessionStoreStorage = () => useSessionStore.persist.clearStorage();

export default useSessionStore;
