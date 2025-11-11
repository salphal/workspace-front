import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (_props: TestProps) => {
  const [value, setValue] = useState<string>('');
  const [_isForce, setIsForce] = useState<boolean>(false);

  useEffect(() => {}, []);

  const onForce = () => {
    setIsForce(true);
  };

  const onBlur = () => {
    setIsForce(false);
  };

  return (
    <React.Fragment>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onForce}
        onBlur={onBlur}
      />
    </React.Fragment>
  );
};

export default React.memo(Test);
