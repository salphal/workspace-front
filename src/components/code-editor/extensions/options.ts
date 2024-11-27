import { BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup';

/**
 * https://codemirror.net/docs/ref/#language.indentUnit
 */
export const defaultEditorOptions: BasicSetupOptions = {
  /** 是否显示行号 */
  lineNumbers: true,
  /** 是否高亮活动行的行号 */
  highlightActiveLineGutter: true,
  /** 是否启用折叠功能 */
  foldGutter: true,
  /** 是否显示拖放光标 */
  dropCursor: true,
  /** 是否允许多选内容 */
  allowMultipleSelections: true,
  /** 是否根据输入自动缩进 */
  indentOnInput: true,
  /** 是否启用括号匹配功能 */
  bracketMatching: true,
  /** 是否在输入括号后自动补全匹配的括号 */
  closeBrackets: true,
  /** 是否启用代码自动补全功能 */
  autocompletion: true,
  /** 是否允许矩形选择 */
  rectangularSelection: true,
  /** 是否显示十字准星光标 */
  crosshairCursor: true,
  /** 是否高亮当前活动的行 */
  highlightActiveLine: true,
  /** 是否高亮选中内容的匹配项 */
  highlightSelectionMatches: true,
  /** 是否启用关闭括号快捷键绑定 */
  closeBracketsKeymap: true,
  /** 是否启用搜索功能的快捷键绑定 */
  searchKeymap: true,
  /** 是否启用折叠功能的快捷键绑定 */
  foldKeymap: true,
  /** 是否启用代码补全功能的快捷键绑定 */
  completionKeymap: true,
  /** 是否启用代码检查功能的快捷键绑定 */
  lintKeymap: true,
  /** 设置缩进的单位，可以是空格或制表符。 */
  tabSize: 2,
};
