import React, { Ref, useImperativeHandle } from 'react';
import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';
import CodeMirror, { EditorView, ViewUpdate } from '@uiw/react-codemirror';
import classNames from 'classnames';

import EditorController, { ISettings } from './components/editor-controller';
import EditorStatusBar from './components/editor-status-bar';
import { CodeEditorContextProvider } from './context.ts';
import { useCursorListener } from './extensions/cursor.ts';
import { useEvents } from './extensions/events.ts';
import { hyperLink } from './extensions/hyper-link.ts';
import { languageOptions, useLanguage } from './extensions/language.ts';
import { defaultEditorOptions } from './extensions/options.ts';
import { themeOptions, useTheme } from './extensions/theme.ts';
import styles from './index.module.scss';
import { defaultSettings } from '@/components/code-editor/constants/code-editor.ts';
import { useCompletion } from '@/components/code-editor/extensions/completion.ts';
import { useShortcut } from '@/components/code-editor/extensions/shortcut.ts';
import { ExtensionList, Themes } from '@/components/code-editor/typings';

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

  /** 点击事件 */
  onClick?: (e: Event) => void;
  /** 聚焦事件 */
  onFocus?: (e: Event) => void;
  /** 失焦事件 */
  onBlur?: (e: Event) => void;
  /** 滚动事件 */
  onScroll?: (e: Event) => void;
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
    onClick,
    onFocus,
    onBlur,
    onScroll,
    ...restProps
  } = props;

  const [value, setValue] = useState<string>('console.log("hello world!");');

  const [options, setOptions] = useState<BasicSetupOptions>(defaultEditorOptions);
  const [settings, setSettings] = useState<ISettings>(defaultSettings);

  const codeEditorRef = useRef<any>(null);

  const { editorEventListExt } = useEvents({ onClick, onFocus, onBlur, onScroll });
  const { cursorInfo, cursorListenerExt } = useCursorListener();
  const { editorTheme } = useTheme({ settings });
  const { language } = useLanguage({ settings });
  const { shortcutListExt } = useShortcut();
  const { completionExt } = useCompletion();
  // const { highlightExt } = useHighLight();

  useImperativeHandle(ref, () => ({}));

  const editorOnChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
    setValue(val);
    typeof onChange === 'function' && onChange(val);
  }, []);

  const editorExtensions: ExtensionList = [
    /** 代码中超链接识别扩展跳转 */
    hyperLink,
    /** 语言扩展 */
    language,
    /** 输入时相对行号扩展 */
    // lineNumbersRelative,
    /** 快捷键扩展 */
    shortcutListExt,
    /** 光标扩展 */
    cursorListenerExt,
    // mentionExt,
    /** 自定义代码提示扩展 */
    // completionExt,
    /** 事件扩展 */
    ...editorEventListExt,
    // regexHighlightPlugin,
    EditorView.lineWrapping,
  ];

  return (
    <React.Fragment>
      <CodeEditorContextProvider
        value={{
          options,
          settings,
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
              theme={editorTheme() as Themes}
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
