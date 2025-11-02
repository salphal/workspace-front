import React, { useState } from 'react';

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {
  const [value, setValue] = useState<string>('');
  const [isForce, setIsForce] = useState<boolean>(false);

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
