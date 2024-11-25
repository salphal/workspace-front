import React from 'react';
import { Button } from 'antd';

import CodeEditor from '@/components/code-editor';

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {
  useEffect(() => {}, []);

  const codeEditorRef = useRef<any>(null);

  const value = `
function    test()    {
      const foo = 'bar';
    }`;

  return (
    <React.Fragment>
      <Button
        onClick={() => {
          codeEditorRef.current.formatCode();
        }}
      >
        format
      </Button>
      <CodeEditor ref={codeEditorRef} value={value} onChange={() => {}} language={'javascript'} />
    </React.Fragment>
  );
};

export default React.memo(Test);
