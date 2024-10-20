import React, { FC, LazyExoticComponent } from 'react';

interface LazyImportComponentProps {
  lazyChildren: LazyExoticComponent<React.ComponentType<any>>;
}

const LazyImportComponent: FC<LazyImportComponentProps> = ({ lazyChildren: LazyChildren }) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <LazyChildren />
  </React.Suspense>
);

export default LazyImportComponent;
