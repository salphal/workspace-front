import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import styles from './index.module.scss';

export interface CodeEditorProps {
  children?: any;

  value?: string;
  onChange?: () => void;
  language?: string;
}

interface CodeEditorRef {
  [key: string]: any;
}

const CodeEditor: ForwardRefRenderFunction<CodeEditorRef, CodeEditorProps> = (
  props: CodeEditorProps,
  ref: Ref<CodeEditorRef | HTMLDivElement>,
) => {
  const { value, onChange, language = 'javascript', ...restProps } = props;

  const [code, setCode] = useState<string>('');

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {}, []);

  // const editorOnChange = (editor, data, value) => {};

  return (
    <React.Fragment>
      <div className={classNames([styles['code-editor']])}>
        <CodeMirror
          value="<h1>I ♥ react-codemirror2</h1>"
          options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {}}
        />
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(CodeEditor);
