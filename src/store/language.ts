import { setStoreProperties, zustandLocalStorage } from '@src/utils/store/zustand.ts';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * https://ant-design.antgroup.com/docs/react/i18n-cn
 */

export interface ILanguageStore {
  locale: any;
}

export const initialLanguage: ILanguageStore = {
  locale: '',
};

// useShallow(); 对象浅比较, 减少重绘
// const {
//   locale,
// } = useLanguageStore(useShallow((state: any) => state));
const useLanguageStore = create(
  persist<ILanguageStore>(
    (set, get) => ({
      ...initialLanguage,
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'languageStore', // unique name
      version: 1,
      storage: createJSONStorage(() => zustandLocalStorage), // zustandLocalStorage | zustandSessionStorage | localStorage ...
    },
  ),
);

export const setLanguageStore = (props: any) =>
  useLanguageStore.setState((prev: any) => ({ ...prev, ...props }));

export const setLanguageProperty = (
  key: string,
  value: any,
  merge = false,
  insertBefore = false,
  isDeconstruct = true,
) =>
  setStoreProperties({
    name: 'useLanguageStore',
    store: useLanguageStore,
    key,
    value,
    merge,
    insertBefore,
    isDeconstruct,
  });

export const setLocale = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setLanguageProperty('locale', value, merge, insertBefore, isDeconstruct);

export const resetLocale = () => setLanguageProperty('locale', initialLanguage.locale, false);

export const resetLanguageStore = () => useLanguageStore.setState({ ...initialLanguage });

export const clearLanguageStoreStorage = () => useLanguageStore.persist.clearStorage();

export default useLanguageStore;
