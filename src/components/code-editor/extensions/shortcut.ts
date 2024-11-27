import { EditorView, keymap } from '@uiw/react-codemirror';

import { insertShortcut, saveShortcut } from '@/components/code-editor/utils/keyboard.ts';

/**
 * 扩展快捷键
 */

export interface IUseShortcutProps {
  onSave?: () => void;
}

export const useShortcut = (props: IUseShortcutProps = {}) => {
  const { onSave } = props;

  /**
   * win: Ctrl
   * mac: Mod == Command
   */
  const shortcutListExt = keymap.of([
    {
      key: saveShortcut, // 保存功能
      preventDefault: true, // 阻止默认浏览器行为
      run: (view: EditorView) => {
        alert('保存成功!');
        typeof onSave === 'function' && onSave();
        return true; // 表示处理成功
      },
    },
    {
      key: insertShortcut, // 插入文本功能
      run: (view: EditorView) => {
        console.log('=>(shortcut.ts:41) view', view);
        const transaction = view.state.update({
          changes: { from: view.state.selection.main.head, insert: 'Hello, CodeMirror!' },
        });
        view.dispatch(transaction);
        return true; // 表示处理成功
      },
    },
  ]);

  return {
    shortcutListExt,
  };
};
