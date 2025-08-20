import React, { ReactElement } from 'react';
import LazyImportComponent from '@src/component/lazy-import-component.tsx';
import { useRoutes } from 'react-router-dom';

const OverviewRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <LazyImportComponent lazyChildren={React.lazy(() => import('./overview.tsx'))} />,
    },
  ]);
  return routers;
};

export default OverviewRoutes;
