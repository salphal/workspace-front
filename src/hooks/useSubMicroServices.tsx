import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import MicroServiceApp from '@/components/micro-service-app/micro-service-app.tsx';

export const useSubMicroServices = (apps: Array<any>, prefix: string) => {
  const { pathname = '', search = '', hash = '', state = {} } = useLocation();

  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [subApps, setSubApps] = useState<any>([]);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (Array.isArray(apps)) {
      const appArr = apps.filter((app) => app.name.includes(prefix));
      setSubApps(appArr);
    }
  }, [apps]);

  useEffect(() => {
    setError('');
    if (!pathname || !Array.isArray(subApps) || !subApps.length) return;
    if (pathname.includes(prefix)) {
      const [app] = subApps.filter((v: any) => pathname.includes(v.name));
      if (app && app.name && app.url) {
        setName(app.name);
        setUrl(app.url);
      }
    } else {
      setName('');
      setUrl('');
    }
  }, [pathname, subApps]);

  const loadError = (url: string, err: string) => {
    setError(String(err));
  };

  const microServiceApp = useMemo(
    () => () => {
      const [app] = apps.filter((app) => name === app.name);
      if (app) {
        return (
          <MicroServiceApp
            name={app.name}
            url={app.url + search + hash}
            props={{
              routerState: state || {},
            }}
            loadError={loadError}
          />
        );
      } else {
        return [];
      }
    },
    [apps, name, state, search, hash],
  );

  return {
    name,
    url,
    state,
    error,
    loadError,
    microServiceApp,
  };
};
