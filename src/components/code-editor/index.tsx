import React, { Ref, useImperativeHandle } from 'react';
import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';
import { langNames, loadLanguage } from '@uiw/codemirror-extensions-langs';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import classNames from 'classnames';

import EditorController, { ISettings } from './components/editor-controller';
import EditorStatusBar from './components/editor-status-bar';
import { CodeEditorContextProvider } from './context.ts';
import { defaultCursorInfo, ICursorInfo, useCursorListener } from './extensions/cursor.ts';
import { useEvents } from './extensions/events.ts';
import { hyperLink } from './extensions/hyper-link.ts';
import { languageOptions } from './extensions/language.ts';
import { defaultEditorOptions } from './extensions/options.ts';
import { defaultTheme, getDynamicTheme, ThemeNames, themeOptions } from './extensions/theme.ts';
import styles from './index.module.scss';
import { defaultSettings } from '@/components/code-editor/constants/code-editor.ts';

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
  const [settings, setSettings] = useState<ISettings>(defaultSettings);
  const [cursorInfo, setCursorInfo] = useState<ICursorInfo>(defaultCursorInfo);

  const codeEditorRef = useRef<any>(null);

  const { editorEventExtList } = useEvents({});
  const { cursorListenerExt } = useCursorListener({ onChange: setCursorInfo });

  useImperativeHandle(ref, () => ({}));

  /** 语言类型 */
  const editorLanguage = useMemo(
    () => () => {
      const defaultValue: Extension[] = [loadLanguage('javascript')] as Extension[];
      if (settings.language && langNames.includes(settings.language)) {
        return [loadLanguage(settings.language)] as Extension[];
      }
      return defaultValue;
    },
    [settings],
  );

  /** 主题 */
  const editorTheme = useMemo(
    () => () => {
      if (settings.theme) {
        return getDynamicTheme(settings.theme);
      }
      return defaultTheme;
    },
    [settings],
  );

  const editorOnChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
    setValue(val);
    typeof onChange === 'function' && onChange(val);
  }, []);

  const editorExtensions: Extension[] = [
    /** 语言扩展 */
    ...editorLanguage(),
    /** 事件扩展 */
    ...editorEventExtList,
    /** 代码中超链接识别扩展跳转 */
    hyperLink,
    /** 输入时相对行号扩展 */
    // lineNumbersRelative,
    /** 快捷键扩展 */
    // shortcutsExt,
    /** 光标扩展 */
    cursorListenerExt,
  ];

  return (
    <React.Fragment>
      <CodeEditorContextProvider
        value={{
          options,
          cursorInfo,
          languageOptions,
          themeOptions,
        }}
      >
        <div className={classNames([styles['code-editor']])}>
          {/** 控制栏 */}
          {controller && (
            <div className={classNames([styles['editor-controller']])}>
              <EditorController value={settings} onChange={setSettings} />
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
              extensions={editorExtensions}
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
      </CodeEditorContextProvider>
    </React.Fragment>
  );
};

export default React.forwardRef(CodeEditor);
