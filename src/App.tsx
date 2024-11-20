import React, { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';

import Layout from '@/layout';
import routes from '@/routes';

import './App.scss';

import { themeKeys, toggleTheme } from '@/utils/tailwind/theme.ts';

function App() {
  const { pathname } = useLocation();

  const page = useRoutes(routes);

  if (['/overview'].includes(pathname)) return page;

  useEffect(() => {
    toggleTheme(themeKeys.dark);
  }, []);

  return (
    <React.Fragment>
      <Layout>{page}</Layout>
    </React.Fragment>
  );
}

export default App;
