import React, { useEffect } from 'react';

import './index.scss';

export interface TestProps {
  [key: string]: any;
}

const Index: React.FC<TestProps> = (props: TestProps) => {
  useEffect(() => {}, []);

  return <div className={'test-wrap'}>hello world</div>;
};

export default React.memo(Index);
