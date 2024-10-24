import React from 'react';

import { prefix } from './apps';
import { useSubMicroServices } from '@/hooks/use-submicro-services.tsx';
import { apps } from '@/microservices/apps.ts';

export interface SubMicroServicesProps {
  [key: string]: any;
}

const SubMicroServices: React.FC<SubMicroServicesProps> = (props: SubMicroServicesProps) => {
  const { error, microServiceApp } = useSubMicroServices({
    apps,
    prefix,
  });

  if (error)
    return <div style={{ width: '100%', height: '100%' }}>load sub micro services error</div>;

  return <div style={{ width: '100%', height: '100%' }}>{microServiceApp()}</div>;
};

export default React.memo(SubMicroServices);
