import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import classNames from 'classnames';
import hljs from 'highlight.js';
import { Controlled as CodeMirror } from 'react-codemirror2';

import styles from './index.module.scss';
import {
  codeEditorKeys,
  defaultFormData,
  EditorFormData,
  IThemeList,
  languageOptions,
  themeOptions,
} from '@/components/code-editor/constant.ts';

import './reboot.scss'; // 重置 CodeMirror 的部分样式
import './plugins.ts'; // 引入 CodeMirror 的插件及样式等

const { Item } = Form;

export interface CodeEditorProps {
  children?: any;

  /** 编辑的代码 */
  value?: string;
  /** 编辑时触发的事件 */
  onChange?: (value: string) => void;
  /** 以什么语法高亮展示当前编辑的代码 */
  language?: string;

  /**
   * default( 默认主题 )
   * material( Material Design 风格 )
   * monokai( 流行的深色主题 )
   * dracula( 深色，适合夜间使用 )
   * solarized( 支持浅色和深色模式 )
   * eclipse( 浅色主题，适合白天使用 )
   * twilight( 柔和的深色主题 )
   * cobalt( 对比鲜明的深色主题 )
   */
  theme?: IThemeList;
}

interface CodeEditorRef {
  [key: string]: any;
}

const CodeEditor: ForwardRefRenderFunction<CodeEditorRef, CodeEditorProps> = (
  props: CodeEditorProps,
  ref: Ref<CodeEditorRef | HTMLDivElement>,
) => {
  const { value, onChange, language = 'javascript', ...restProps } = props;

  const [form] = useForm();

  const [editorOptions, setEditorOptions] = useState<EditorFormData>(defaultFormData);
  const [editorValue, setEditorValue] = useState(value || '');
  const [highlightedValue, setHighlightedValue] = useState(value || '');

  const codeMirrorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    formatCode,
  }));

  /**
   * 在 componentDidMount 和 componentDidUpdate 后触发高亮
   */
  useEffect(() => {
    setHighlightedValue(hljs.highlight(language, editorValue).value);
  }, [editorValue, language]);

  const handleCodeChange = (editor: any, data: any, value: any) => {
    setEditorValue(value);
    onChange && onChange(value);
  };

  const formatCode = () => {
    // const formattedCode = js(editorValue, { indent_size: 2 });
    // setEditorValue(formattedCode); // 更新为格式化后的代码
  };

  const formOnValueChange = (changedValue: any, formData: EditorFormData) => {
    setEditorOptions(formData);
  };

  return (
    <React.Fragment>
      <div className={classNames([styles['code-editor'], 'code-editor'])}>
        <div className={styles.controller}>
          <Form form={form} onValuesChange={formOnValueChange} size={'small'} layout={'inline'}>
            <Item name={codeEditorKeys.theme}>
              <Select placeholder={'请选择主题'} options={themeOptions} style={{ width: 100 }} />
            </Item>
            <Item name={codeEditorKeys.language}>
              <Select placeholder={'请选择语言'} options={languageOptions} style={{ width: 100 }} />
            </Item>
            <Item>
              <Button type={'primary'}>格式化</Button>
            </Item>
          </Form>
        </div>
        <div className={styles.content}>
          <div className={classNames([styles.editor, 'editor'])}>
            <CodeMirror
              ref={codeMirrorRef}
              value={editorValue}
              options={{
                /** 语言模式 */
                // mode: editorOptions.language,
                /** 主题 */
                // theme: editorOptions.theme,
                /** 是否显示行号 */
                lineNumbers: true,
                /** 字符缩进 */
                indentUnit: 2,
                /** tab缩进 */
                tabSize: 2,
                extraKeys: {
                  'Ctrl-Space': 'autocomplete', // 按下 Ctrl + Space 时显示提示
                },
                hintOptions: {
                  completeSingle: false, // 禁止自动完成，选择时手动触发
                },
                ...editorOptions,
              }}
              onBeforeChange={handleCodeChange}
            />
          </div>
          {/*<div className={styles.preview}>*/}
          {/*  <pre dangerouslySetInnerHTML={{ __html: highlightedValue }} />*/}
          {/*</div>*/}
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(CodeEditor);
