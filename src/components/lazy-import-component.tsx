import React, { FC, LazyExoticComponent } from 'react';
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
  lazyChildren: LazyExoticComponent<React.ComponentType<any>>;
}

const LazyImportComponent: FC<LazyImportComponentProps> = ({ lazyChildren: LazyChildren }) => (
  <React.Suspense fallback={<Loading />}>
    <LazyChildren />
  </React.Suspense>
);

export default LazyImportComponent;
