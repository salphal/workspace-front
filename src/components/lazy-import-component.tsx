import React, { FC, LazyExoticComponent, startTransition } from 'react';
import { Spin } from 'antd';

const Loading = () => (
  <Spin
    style={{
      position: 'absolute',
      top: '45%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  />
);

interface LazyImportComponentProps {
  /** 组件 */
  lazyChildren: LazyExoticComponent<React.ComponentType<any>>;
  /** 元数据 */
  meta?: { [key: string]: any };
  /** 需要预加载的数据 */
  preload?: (...args: any[]) => Promise<any>;
}

// <LazyImportComponent lazyChildren={React.lazy(() => import('./component.tsx'))} />
const LazyImportComponent: FC<LazyImportComponentProps> = ({
  lazyChildren: LazyChildren,
  meta = {},
  preload = null,
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 预加载数据
   */
  const fetchData = async () => {
    if (!(preload instanceof Promise)) return;
    const res = await preload();
    startTransition(() => {
      if (res) setData(res);
    });
  };

  const props = {
    meta,
    preLoadData: data,
  };
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyChildren {...props} />
    </React.Suspense>
  );
};

export default React.memo(LazyImportComponent);
