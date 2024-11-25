import React from 'react';

import CodeEditor from '@/components/code-editor';

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {
  useEffect(() => {}, []);

  const value = `
    <React.Fragment>
      <CodeEditor value={value} onChange={() => {}} language={'javascript'} />
    </React.Fragment>;
  `;

  return (
    <React.Fragment>
      <CodeEditor value={value} onChange={() => {}} language={'javascript'} />
    </React.Fragment>
  );
};

export default React.memo(Test);
