import React, { FC, LazyExoticComponent } from 'react';
import { Spin } from 'antd';

interface LazyImportComponentProps {
  lazyChildren: LazyExoticComponent<React.ComponentType<any>>;
}

const LazyImportComponent: FC<LazyImportComponentProps> = ({ lazyChildren: LazyChildren }) => (
  <React.Suspense fallback={<Spin />}>
    <LazyChildren />
  </React.Suspense>
);

export default LazyImportComponent;
