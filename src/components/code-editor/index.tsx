import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import hljs from 'highlight.js'; // 引入 highlight.js

import { js } from 'js-beautify'; // 引入 js-beautify 用于代码格式化
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css'; // 引入 CodeMirror 样式
import 'codemirror/mode/javascript/javascript'; // JavaScript 语言支持

import 'codemirror/addon/hint/show-hint'; // 引入代码提示插件
import 'codemirror/addon/hint/javascript-hint'; // 适用于 JavaScript 的提示

import 'highlight.js/styles/github.css'; // 选择 highlight.js 样式

// 引入 js-beautify 用于代码格式化

export interface CodeEditorProps {
  children?: any;

  /** 编辑的代码 */
  value?: string;
  /** 编辑时触发的事件 */
  onChange?: (value: string) => void;
  /** 以什么语法高亮展示当前编辑的代码 */
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

  const [editorValue, setEditorValue] = useState(value || '');
  const [highlightedValue, setHighlightedValue] = useState(value || '');

  const codeMirrorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    formatCode,
  }));

  useEffect(() => {
    // 在 componentDidMount 和 componentDidUpdate 后触发高亮
    setHighlightedValue(hljs.highlight(language, editorValue).value);
  }, [editorValue, language]);

  const handleCodeChange = (editor: any, data: any, value: any) => {
    setEditorValue(value);
    onChange && onChange(value);
  };

  const formatCode = () => {
    const formattedCode = js(editorValue, { indent_size: 2 });
    setEditorValue(formattedCode); // 更新为格式化后的代码
  };

  return (
    <React.Fragment>
      <div>
        {/* 代码编辑器部分 */}
        <CodeMirror
          ref={codeMirrorRef}
          value={editorValue}
          options={{
            mode: language, // 语言模式
            theme: 'default', // 主题
            lineNumbers: true, // 显示行号
            indentUnit: 2,
            tabSize: 2,
            extraKeys: {
              'Ctrl-Space': 'autocomplete', // 按下 Ctrl + Space 时显示提示
            },
            hintOptions: {
              completeSingle: false, // 禁止自动完成，选择时手动触发
            },
          }}
          onBeforeChange={handleCodeChange}
        />
      </div>
      <div>
        {/* 代码高亮显示部分 */}
        <pre
          style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            marginTop: '10px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: '14px',
            border: '1px solid',
          }}
          dangerouslySetInnerHTML={{ __html: highlightedValue }}
        />
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(CodeEditor);
