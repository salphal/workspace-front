import { Navigate, type RouteObject } from 'react-router-dom';

import OverviewRoutes from '@/pages/overview/route.tsx';
import Test from '@/pages/test.tsx';

/**
 * React.lazy: 只会在真正渲染的时候再加载异步组件，无法提前加载
 */

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/overview" />,
  },
  {
    path: '/overview/*',
    element: <OverviewRoutes />,
  },
  {
    path: '/test',
    element: <Test />,
  },
];

export default routes;
