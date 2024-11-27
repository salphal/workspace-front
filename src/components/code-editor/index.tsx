import React, { Ref, useImperativeHandle } from 'react';
import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';
import { langNames, loadLanguage } from '@uiw/codemirror-extensions-langs';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import classNames from 'classnames';

import EditorController, { IFormData } from './components/editor-controller';
import EditorStatusBar from './components/editor-status-bar';
import { languageOptions } from './constants/language.ts';
import { defaultEditorOptions } from './constants/options.ts';
import { defaultTheme, getDynamicTheme, ThemeNames, themeOptions } from './constants/theme.ts';
import styles from './index.module.scss';

/**
 * codemirror@6   // 最新版本: 模块整合
 * https://github.com/uiwjs/react-codemirror
 * https://uiwjs.github.io/react-codemirror/
 */

export interface CodeEditorProps {
  /** 代码内容 */
  value?: string;
  /** 代码改变时触发的事件 */
  onChange?: (value: string) => void;
  /** 高度 */
  height?: string;
  /** 编辑器基础配置 */
  options?: { [key: string]: any };
  /** 占位符 */
  placeholder?: string;
  /** 是否展示控制条 */
  controller?: boolean;
  /** 是否展示状态条 */
  statusBar?: boolean;
}

interface CodeEditorRef {}

const CodeEditor: React.ForwardRefRenderFunction<CodeEditorRef, CodeEditorProps> = (
  props: CodeEditorProps,
  ref: Ref<CodeEditorRef | HTMLDivElement>,
) => {
  const {
    height = '500px',
    onChange,
    placeholder = '',
    controller = true,
    statusBar = true,
    ...restProps
  } = props;

  const [value, setValue] = useState<string>('console.log("hello world!");');

  const [options, setOptions] = useState<BasicSetupOptions>(defaultEditorOptions);
  const [formData, setFormData] = useState<IFormData>({});
  const codeEditorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({}));

  /** 语言类型 */
  const editorExtensions = useMemo(
    () => () => {
      const defaultValue: Extension[] = [];
      if (formData.language && langNames.includes(formData.language)) {
        return [loadLanguage(formData.language)] as Extension[];
      }
      return defaultValue;
    },
    [formData],
  );

  /** 主题 */
  const editorTheme = useMemo(
    () => () => {
      if (formData.theme) {
        return getDynamicTheme(formData.theme);
      }
      return defaultTheme;
    },
    [formData],
  );

  const editorOnChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
    setValue(val);
    typeof onChange === 'function' && onChange(val);
  }, []);

  const controllerOnChange = (value: IFormData) => {
    setFormData(value);
  };

  return (
    <React.Fragment>
      <div className={classNames([styles['code-editor']])}>
        {/** 控制栏 */}
        {controller && (
          <div className={classNames([styles['editor-controller']])}>
            <EditorController
              onChange={controllerOnChange}
              languageOptions={languageOptions}
              themeOptions={themeOptions}
            />
          </div>
        )}
        {/** 编辑器 */}
        <div className={classNames([styles['editor-content']])}>
          <CodeMirror
            ref={codeEditorRef}
            value={value}
            height={height}
            theme={editorTheme() as ThemeNames}
            basicSetup={options}
            extensions={editorExtensions()}
            onChange={editorOnChange}
            placeholder={placeholder}
            {...restProps}
          />
        </div>
        {/** 状态条 */}
        {statusBar && (
          <div className={classNames([styles['editor-status-bar']])}>
            <EditorStatusBar />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(CodeEditor);
