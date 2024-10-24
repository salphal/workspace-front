import React from 'react';

import { demoPrefix } from './apps';
import { useSubMicroServices } from '@/hooks/use-submicro-services.tsx';
import { apps } from '@/microservices/apps.ts';

const wrapStyle = {
  width: '100%',
  height: '100%',
};

export interface SubMicroServicesProps {
  [key: string]: any;
}

const SubMicroServices: React.FC<SubMicroServicesProps> = (props: SubMicroServicesProps) => {
  const { error, microServiceApp } = useSubMicroServices({
    apps,
    prefix: demoPrefix,
    props: { foo: 'bar', ...props },
  });

  if (error) return <div style={wrapStyle}>load sub micro services error</div>;

  return <div style={wrapStyle}>{microServiceApp()}</div>;
};

export default React.memo(SubMicroServices);
