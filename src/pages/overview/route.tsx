import React, { ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import LazyImportComponent from '@src/components/lazy-import-component.tsx';

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
