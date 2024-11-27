import { EditorView, keymap } from '@uiw/react-codemirror';

/**
 * win: Ctrl
 * mac: Mod == Command
 */
const shortcutsExt = keymap.of([
  {
    key: 'Ctrl-s', // 保存功能
    preventDefault: true, // 阻止默认浏览器行为
    run: (view: EditorView) => {
      alert('保存成功！');
      return true; // 表示处理成功
    },
  },
  {
    key: 'Mod-i', // 插入文本功能
    run: (view: EditorView) => {
      const transaction = view.state.update({
        changes: { from: view.state.selection.main.head, insert: 'Hello, CodeMirror!' },
      });
      view.dispatch(transaction);
      return true; // 表示处理成功
    },
  },
]);
