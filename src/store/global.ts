import { setStoreProperties } from '@src/utils/store/zustand.ts';
import { create } from 'zustand';

export interface IGlobalStore {
  [key: string]: any;
}

export const initialGlobal = {
  data: {},
};

// useShallow(); 对象浅比较, 减少重绘
// import { useShallow } from 'zustand/react/shallow';
// const {
//   data,
// } = useGlobalStore(useShallow((state: any) => state));
const useGlobalStore = create<IGlobalStore>((set, get) => ({
  ...initialGlobal,
  // data: [],
  // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
  // getData: () => get().data.map((v: any) => !!v),
}));

export const setGlobalStore = (props: any) =>
  useGlobalStore.setState((prev: any) => ({ ...prev, ...props }));

export const setGlobalProperty = (
  key: string,
  value: any,
  merge = false,
  insertBefore = false,
  isDeconstruct = true,
) =>
  setStoreProperties({
    name: 'useGlobalStore',
    store: useGlobalStore,
    key,
    value,
    merge,
    insertBefore,
    isDeconstruct,
  });

export const setData = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setGlobalProperty('data', value, merge, insertBefore, isDeconstruct);

export const resetData = () => setGlobalProperty('data', initialGlobal.data, false);

export const resetGlobalStore = () => useGlobalStore.setState({ ...initialGlobal });

export default useGlobalStore;
